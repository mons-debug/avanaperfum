import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          background: 'linear-gradient(135deg, #c8a45d 0%, #d4b76a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontFamily: 'serif',
          textAlign: 'center',
          borderRadius: '20px',
        }}
      >
        <div style={{ fontSize: 72, marginBottom: -10 }}>AP</div>
        <div style={{ fontSize: 24, fontWeight: 'normal' }}>AVANA</div>
        <div style={{ fontSize: 16, fontWeight: 'normal', opacity: 0.9 }}>PARFUM</div>
      </div>
    ),
    {
      ...size,
    }
  );
} 