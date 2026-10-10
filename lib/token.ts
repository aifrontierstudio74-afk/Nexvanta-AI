import crypto from 'crypto';

const SECRET = process.env.DOWNLOAD_TOKEN_SECRET || 'fallback-secret-for-development-mode-nexvanta-32ch';

export function createDownloadToken(slug: string): string {
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
  const payload = `${slug}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64url');
}

export function verifyDownloadToken(token: string): { valid: boolean; slug?: string } {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return { valid: false };

    const [slug, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);

    if (Date.now() > expiresAt) {
      return { valid: false };
    }

    const expectedHmac = crypto.createHmac('sha256', SECRET).update(`${slug}:${expiresAt}`).digest('hex');
    if (expectedHmac !== signature) {
      return { valid: false };
    }

    return { valid: true, slug };
  } catch {
    return { valid: false };
  }
}
