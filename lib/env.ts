export function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getOptionalEnv(key: string): string | undefined {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value : undefined;
}

export function isPlaceholder(value?: string) {
  return Boolean(value && /placeholder|replace_with/i.test(value));
}
