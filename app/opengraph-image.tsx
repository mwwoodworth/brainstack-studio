import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BrainStack Studio - Operational AI Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px',
          color: '#f8fafc',
          background:
            'radial-gradient(circle at 20% 20%, rgba(14,165,233,0.4), transparent 45%), radial-gradient(circle at 80% 70%, rgba(16,185,129,0.35), transparent 45%), linear-gradient(135deg, #020617 0%, #0f172a 55%, #111827 100%)',
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#22d3ee',
          }}
        >
          BrainStack Studio
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 900 }}>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.05 }}>
            Operational AI for real workflows
          </div>
          <div style={{ fontSize: 30, color: '#cbd5e1' }}>
            Deterministic outputs. Governance controls. Measurable outcomes.
          </div>
        </div>
        <div style={{ fontSize: 24, color: '#94a3b8' }}>brainstackstudio.com</div>
      </div>
    ),
    size
  );
}
