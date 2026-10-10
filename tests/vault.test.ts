import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  encryptPayload,
  decryptPayload,
  saveCredential,
  getCredential,
  deleteCredential,
  listConnectedCredentials,
} from '../lib/vault';

describe('Credentials Vault (AES-256-GCM)', () => {
  it('performs round-trip encryption and decryption of credentials', () => {
    const secretData = {
      apiKey: 'sk-live-secret-test-key-9988',
      clientId: 'client_nexvanta_production',
      tokenSecret: 'tok_random_secure_123',
    };

    const encrypted = encryptPayload(secretData);
    expect(encrypted).toBeDefined();
    expect(encrypted.startsWith('v1:')).toBe(true);

    const parts = encrypted.slice(3).split('.');
    expect(parts).toHaveLength(3); // iv, tag, ciphertext

    const decrypted = decryptPayload<typeof secretData>(encrypted);
    expect(decrypted).toEqual(secretData);
  });

  it('rejects corrupted ciphertext or invalid version tags', () => {
    expect(() => decryptPayload('v2:invalid.payload.here')).toThrow();
    expect(() => decryptPayload('corrupted-data')).toThrow();
  });

  it('stores, retrieves and deletes credentials in vault', async () => {
    const userId = 'usr_test_123';
    const instanceId = 'inst_test_abc';
    const provider = 'google_oauth';

    const payload = { accessToken: 'ya29.test-token-value', refreshToken: '1//refresh-test' };

    await saveCredential(userId, instanceId, provider, payload);

    const connected = await listConnectedCredentials(userId, instanceId);
    expect(connected.some((c) => c.provider === provider)).toBe(true);

    const fetched = await getCredential(userId, instanceId, provider);
    expect(fetched).toEqual(payload);

    await deleteCredential(userId, instanceId, provider);
    const afterDelete = await getCredential(userId, instanceId, provider);
    expect(afterDelete).toBeNull();
  });

  it('lint check: ensures no console.log near credentials or secrets', () => {
    const vaultFilePath = path.join(process.cwd(), 'lib', 'vault.ts');
    const content = fs.readFileSync(vaultFilePath, 'utf8');

    // Ensure no console.log prints decrypted secrets
    expect(content).not.toMatch(/console\.log\(.*decrypted/i);
    expect(content).not.toMatch(/console\.log\(.*payload/i);
    expect(content).not.toMatch(/console\.log\(.*token/i);
  });
});
