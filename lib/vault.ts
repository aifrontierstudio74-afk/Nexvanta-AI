import crypto from 'crypto';
import { env } from '@/lib/env';
import { createAdminClient } from '@/lib/supabase/admin';

// In-memory fallback credential store for unit tests or when Supabase is unconfigured
const memoryCredentialStore = new Map<string, { payload: string; createdAt: string }>();

function getEncryptionKey(): Buffer {
  const rawKey = env.CREDENTIAL_ENC_KEY;
  if (rawKey && rawKey.trim()) {
    try {
      const buf = Buffer.from(rawKey, 'base64');
      if (buf.length === 32) return buf;
      // If rawKey is not exactly 32-byte base64, hash it to 32 bytes
      return crypto.createHash('sha256').update(rawKey).digest();
    } catch {
      return crypto.createHash('sha256').update(rawKey).digest();
    }
  }

  // Fallback dev/test key derived from token secret (32 bytes)
  return crypto.createHash('sha256').update(env.DOWNLOAD_TOKEN_SECRET || 'nexvanta-vault-default-key-2026').digest();
}

/**
 * Encrypt a credential payload with AES-256-GCM.
 * Output format: v1:<iv_base64>.<auth_tag_base64>.<ciphertext_base64>
 */
export function encryptPayload(data: Record<string, unknown> | string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // Standard 12-byte IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const serialized = typeof data === 'string' ? data : JSON.stringify(data);
  let ciphertext = cipher.update(serialized, 'utf8', 'base64');
  ciphertext += cipher.final('base64');
  const tag = cipher.getAuthTag();

  return `v1:${iv.toString('base64')}.${tag.toString('base64')}.${ciphertext}`;
}

/**
 * Decrypt an AES-256-GCM encrypted payload.
 */
export function decryptPayload<T = Record<string, unknown>>(encrypted: string): T {
  const key = getEncryptionKey();

  if (!encrypted.startsWith('v1:')) {
    throw new Error('Unsupported credential encryption version.');
  }

  const parts = encrypted.slice(3).split('.');
  if (parts.length !== 3) {
    throw new Error('Malformed encrypted payload format.');
  }

  const [ivBase64, tagBase64, ciphertextBase64] = parts;
  const iv = Buffer.from(ivBase64, 'base64');
  const tag = Buffer.from(tagBase64, 'base64');

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(ciphertextBase64, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  try {
    return JSON.parse(decrypted) as T;
  } catch {
    return decrypted as unknown as T;
  }
}

/**
 * Save an encrypted credential to the database (or memory fallback).
 */
export async function saveCredential(
  userId: string,
  instanceId: string,
  provider: string,
  payload: Record<string, unknown>
): Promise<boolean> {
  const encryptedPayload = encryptPayload(payload);
  const admin = createAdminClient();

  if (!admin) {
    const key = `${userId}:${instanceId}:${provider}`;
    memoryCredentialStore.set(key, { payload: encryptedPayload, createdAt: new Date().toISOString() });
    return true;
  }

  const { error } = await admin.from('credentials').upsert(
    {
      user_id: userId,
      instance_id: instanceId,
      provider,
      encrypted_payload: encryptedPayload,
    },
    { onConflict: 'user_id,instance_id,provider' }
  );

  if (error) {
    console.error('Failed to save credential:', error.message);
    throw new Error(`Vault storage failure: ${error.message}`);
  }

  return true;
}

/**
 * Retrieve and decrypt credential (Server-side ONLY).
 * NEVER expose this result to browser clients.
 */
export async function getCredential<T = Record<string, unknown>>(
  userId: string,
  instanceId: string,
  provider: string
): Promise<T | null> {
  const admin = createAdminClient();

  if (!admin) {
    const key = `${userId}:${instanceId}:${provider}`;
    const item = memoryCredentialStore.get(key);
    if (!item) return null;
    return decryptPayload<T>(item.payload);
  }

  const { data, error } = await admin
    .from('credentials')
    .select('encrypted_payload')
    .eq('user_id', userId)
    .eq('instance_id', instanceId)
    .eq('provider', provider)
    .maybeSingle();

  if (error || !data) return null;
  return decryptPayload<T>(data.encrypted_payload);
}

/**
 * Delete a credential (Disconnect integration).
 */
export async function deleteCredential(
  userId: string,
  instanceId: string,
  provider: string
): Promise<boolean> {
  const admin = createAdminClient();

  if (!admin) {
    const key = `${userId}:${instanceId}:${provider}`;
    return memoryCredentialStore.delete(key);
  }

  const { error } = await admin
    .from('credentials')
    .delete()
    .eq('user_id', userId)
    .eq('instance_id', instanceId)
    .eq('provider', provider);

  return !error;
}

/**
 * List connected providers for UI without exposing secrets.
 */
export async function listConnectedCredentials(
  userId: string,
  instanceId: string
): Promise<{ provider: string; connectedAt: string }[]> {
  const admin = createAdminClient();

  if (!admin) {
    const results: { provider: string; connectedAt: string }[] = [];
    const prefix = `${userId}:${instanceId}:`;
    for (const [k, v] of memoryCredentialStore.entries()) {
      if (k.startsWith(prefix)) {
        const provider = k.slice(prefix.length);
        results.push({ provider, connectedAt: v.createdAt });
      }
    }
    return results;
  }

  const { data } = await admin
    .from('credentials')
    .select('provider, created_at')
    .eq('user_id', userId)
    .eq('instance_id', instanceId);

  return (data || []).map((row) => ({
    provider: row.provider,
    connectedAt: row.created_at,
  }));
}
