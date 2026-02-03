export type FeatureFlagKey =
  | 'explorer'
  | 'solutions'
  | 'advancedTools'
  | 'proSessions'
  | 'telemetry'
  | 'leadCapture';

const readFlag = (key: string, fallback: boolean) => {
  const raw = process.env[`NEXT_PUBLIC_BSS_${key}`];
  if (raw === undefined) return fallback;
  return raw.toLowerCase() === 'true';
};

export const FEATURE_FLAGS: Record<FeatureFlagKey, boolean> = {
  explorer: readFlag('EXPLORER', true),
  solutions: readFlag('SOLUTIONS', true),
  advancedTools: readFlag('ADVANCED_TOOLS', true),
  proSessions: readFlag('PRO_SESSIONS', true),
  telemetry: readFlag('TELEMETRY', true),
  leadCapture: readFlag('LEAD_CAPTURE', true),
};

export const isFeatureEnabled = (key: FeatureFlagKey) => FEATURE_FLAGS[key];
