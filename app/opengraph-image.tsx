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
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f8fafc',
          background: '#020617',
          position: 'relative',
        }}
      >
        {/* Background Gradients */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '60%',
            height: '60%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '60%',
            height: '60%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 10,
            padding: '40px',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.03)',
            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)',
          }}
        >
          {/* Logo / Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              B
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(to right, #22d3ee, #a78bfa)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              BrainStack Studio
            </div>
          </div>

          {/* Main Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: 900,
              marginBottom: '16px',
              background: 'linear-gradient(to bottom, #ffffff, #94a3b8)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Operational AI for real workflows
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 28,
              color: '#cbd5e1',
              maxWidth: 700,
              lineHeight: 1.4,
            }}
          >
            Deterministic outputs. Governance controls.
            <br />
            Measurable outcomes.
          </div>
        </div>

        {/* URL Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            background: 'rgba(255,255,255,0.05)',
            padding: '8px 24px',
            borderRadius: '999px',
            fontSize: 20,
            color: '#94a3b8',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          brainstackstudio.com
        </div>
      </div>
    ),
    size
  );
}
