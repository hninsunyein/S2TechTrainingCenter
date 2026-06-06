'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Review } from '@/types';
import { reviewsApi } from '@/lib/api';

interface Props {
  review: Review | null;
  onClose: () => void;
  onSaved: () => void;
}

const AVATAR_COLORS: Record<string, string> = {
  teal:   'linear-gradient(135deg,#0ea5c8,#0284a8)',
  gold:   'linear-gradient(135deg,#f59e0b,#d97706)',
  green:  'linear-gradient(135deg,#22c55e,#16a34a)',
  purple: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
  pink:   'linear-gradient(135deg,#f472b6,#db2777)',
  orange: 'linear-gradient(135deg,#fb923c,#ea580c)',
};

const COLOR_LABELS: Record<string, string> = {
  teal: 'T', gold: 'G', green: 'Gr', purple: 'P', pink: 'Pk', orange: 'Or',
};

function autoInitials(name: string) {
  return name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() ?? '').join('').slice(0, 2);
}

export default function ReviewFormModal({ review, onClose, onSaved }: Props) {
  const isEdit = !!review;
  const [loading, setLoading] = useState(false);

  const [stars, setStars]           = useState(review?.stars ?? 5);
  const [text, setText]             = useState(review?.text ?? '');
  const [authorName, setAuthorName] = useState(review?.authorName ?? '');
  const [authorRole, setAuthorRole] = useState(review?.authorRole ?? '');
  const [initials, setInitials]     = useState(review?.initials ?? '');
  const [colorKey, setColorKey]     = useState(() => {
    const entry = Object.entries(AVATAR_COLORS).find(([, v]) => v === review?.avatarColor);
    return entry?.[0] ?? 'teal';
  });

  const handleSubmit = async () => {
    if (!text.trim())       { toast.error('Review text is required'); return; }
    if (!authorName.trim()) { toast.error('Author name is required'); return; }
    setLoading(true);
    try {
      const payload = {
        stars,
        text: text.trim(),
        authorName: authorName.trim(),
        authorRole: authorRole.trim(),
        initials: (initials || autoInitials(authorName)).slice(0, 2),
        avatarColor: AVATAR_COLORS[colorKey],
      };
      if (isEdit && review?.id) {
        await reviewsApi.update(review.id, payload);
        toast.success('Review updated');
      } else {
        await reviewsApi.create(payload);
        toast.success('Review added');
      }
      onSaved();
    } catch { toast.error('Failed to save review'); }
    finally   { setLoading(false); }
  };

  const inp: React.CSSProperties = {
    width: '100%', background: 'var(--inp)', border: '1px solid var(--border)',
    borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: 'var(--text)',
    fontFamily: 'inherit', outline: 'none',
  };
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text2)',
    textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '6px',
  };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--overlay)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '480px', maxHeight: '90vh', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--r2)', display: 'flex', flexDirection: 'column', animation: 'fadeUp .2s ease' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text)' }}>{isEdit ? 'Edit Review' : 'New Review'}</div>
            <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>Customer testimonial</div>
          </div>
          <button onClick={onClose} style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--inp)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '14px', color: 'var(--text2)', fontFamily: 'inherit' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Stars */}
          <div>
            <div style={lbl}>Rating</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setStars(s)}
                  style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer', opacity: s <= stars ? 1 : 0.3, padding: 0, lineHeight: 1 }}>★</button>
              ))}
            </div>
          </div>

          {/* Review text */}
          <div>
            <div style={lbl}>Review Text *</div>
            <textarea value={text} onChange={(e) => setText(e.target.value)}
              placeholder="The student built their first game after Scratch Level 1..."
              rows={4} style={{ ...inp, resize: 'vertical' }} />
          </div>

          {/* Author */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={lbl}>Author Name *</div>
              <input value={authorName} onChange={(e) => { setAuthorName(e.target.value); if (!initials) setInitials(autoInitials(e.target.value)); }}
                placeholder="Ma Aye Khaing" style={inp} />
            </div>
            <div>
              <div style={lbl}>Initials (auto)</div>
              <input value={initials} onChange={(e) => setInitials(e.target.value.toUpperCase().slice(0, 2))}
                placeholder="AK" style={{ ...inp, textAlign: 'center', fontWeight: 700, fontSize: '16px', letterSpacing: '2px' }} maxLength={2} />
            </div>
          </div>

          <div>
            <div style={lbl}>Author Role</div>
            <input value={authorRole} onChange={(e) => setAuthorRole(e.target.value)}
              placeholder="Parent · Child age 9" style={inp} />
          </div>

          {/* Avatar color */}
          <div>
            <div style={lbl}>Avatar Color</div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {Object.keys(AVATAR_COLORS).map((k) => (
                <button key={k} onClick={() => setColorKey(k)}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: AVATAR_COLORS[k], border: colorKey === k ? '3px solid var(--teal)' : '3px solid transparent', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {colorKey === k && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 800 }}>OK</span>}
                </button>
              ))}
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: AVATAR_COLORS[colorKey], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#fff', marginLeft: '8px' }}>
                {(initials || autoInitials(authorName) || 'AB').slice(0, 2)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Review'}
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}
