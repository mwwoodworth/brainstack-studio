import { createHash, randomBytes } from 'crypto';

const API_KEY_PREFIX = 'bss_live_';

export function generateApiKey() {
  const secret = randomBytes(24).toString('base64url');
  return `${API_KEY_PREFIX}${secret}`;
}

export function hashApiKey(rawKey: string) {
  return createHash('sha256').update(rawKey).digest('hex');
}

export function buildKeyPrefix(rawKey: string) {
  return rawKey.slice(0, 16);
}

export function normalizeApiKeyName(value: unknown) {
  if (typeof value !== 'string') return 'Default key';
  const trimmed = value.trim();
  if (!trimmed) return 'Default key';
  return trimmed.slice(0, 80);
}
