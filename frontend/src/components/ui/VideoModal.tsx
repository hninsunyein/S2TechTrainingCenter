'use client';

interface Props {
  title: string;
  videoUrl: string;
  onClose: () => void;
}

function toEmbedUrl(url: string): string | null {
  // youtube.com/watch?v=ID or youtu.be/ID
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
  // Already an embed URL
  if (url.includes('youtube.com/embed')) return url;
  return null;
}

export default function VideoModal({ title, videoUrl, onClose }: Props) {
  const embedUrl = toEmbedUrl(videoUrl);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '780px', animation: 'fadeUp .2s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', flex: 1, marginRight: '16px' }}>{title}</div>
          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'inherit' }}>
            ×
          </button>
        </div>

        {/* Video */}
        <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 'var(--r2)', overflow: 'hidden', background: '#000' }}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.5)', gap: '12px' }}>
              <div style={{ fontSize: '48px', opacity: 0.4 }}>▶</div>
              <div style={{ fontSize: '13px' }}>Video not available</div>
              <div style={{ fontSize: '11px', opacity: 0.6 }}>{videoUrl}</div>
            </div>
          )}
        </div>

        <div style={{ marginTop: '10px', fontSize: '11px', color: 'rgba(255,255,255,.4)', textAlign: 'center' }}>
          Free preview · Click outside to close
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}
