'use client';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import type { BlogPost, Teacher } from '@/types';
import { blogApi, teachersApi, getImageUrl } from '@/lib/api';

interface Props {
  post: BlogPost | null;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES = ['Scratch', 'Python', 'English', 'General'];

const CAT_COLORS: Record<string, object> = {
  Scratch: { background: 'rgba(14,165,200,.2)', border: '1px solid rgba(14,165,200,.35)', color: 'var(--teal)' },
  Python:  { background: 'rgba(167,139,250,.2)', border: '1px solid rgba(167,139,250,.35)', color: 'var(--purple)' },
  English: { background: 'rgba(245,158,11,.2)', border: '1px solid rgba(245,158,11,.35)', color: 'var(--gold)' },
  General: { background: 'rgba(34,197,94,.2)', border: '1px solid rgba(34,197,94,.35)', color: 'var(--green)' },
};

const AVATAR_COLORS: Record<string, string> = {
  teal:   'linear-gradient(135deg,#0ea5c8,#0284a8)',
  gold:   'linear-gradient(135deg,#f59e0b,#d97706)',
  green:  'linear-gradient(135deg,#22c55e,#16a34a)',
  purple: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
  pink:   'linear-gradient(135deg,#f472b6,#db2777)',
};

const THUMB_PRESETS: Record<string, string> = {
  teal:   'linear-gradient(135deg,#0c1e30,#0a2a40)',
  purple: 'linear-gradient(135deg,#12102a,#1a1040)',
  gold:   'linear-gradient(135deg,#1a1408,#2a2010)',
  green:  'linear-gradient(135deg,#0d2018,#0a2a16)',
  pink:   'linear-gradient(135deg,#2a1020,#180a18)',
};

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function todayStr() {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function guessAvatarKey(color: string) {
  if (color.includes('0ea5c8')) return 'teal';
  if (color.includes('f59e0b')) return 'gold';
  if (color.includes('22c55e')) return 'green';
  if (color.includes('a78bfa')) return 'purple';
  if (color.includes('f472b6')) return 'pink';
  return 'teal';
}

function guessThumbKey(thumb: string) {
  if (thumb.includes('0a2a40')) return 'teal';
  if (thumb.includes('1a1040')) return 'purple';
  if (thumb.includes('2a2010')) return 'gold';
  if (thumb.includes('0a2a16')) return 'green';
  return 'teal';
}

export default function BlogFormModal({ post, onClose, onSaved }: Props) {
  const isEdit = !!post;
  const imgRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [title, setTitle]       = useState(post?.title ?? '');
  const [category, setCategory] = useState(post?.category ?? 'Scratch');
  const [date, setDate]         = useState(post?.date ?? todayStr());
  const [readTime, setReadTime] = useState(post?.readTime ?? '4 min read');
  const [excerpt, setExcerpt]   = useState(post?.excerpt ?? '');
  const [content, setContent]   = useState(post?.content ?? '');
  const [authorName, setAuthorName] = useState(post?.authorName ?? '');
  const [thumbKey, setThumbKey] = useState(guessThumbKey(post?.thumb ?? ''));
  const [avatarKey, setAvatarKey] = useState(guessAvatarKey(post?.avatarColor ?? ''));
  const [imageFile, setImageFile]   = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(getImageUrl(post?.imageUrl) ?? '');

  useEffect(() => { teachersApi.getAll().then(setTeachers).catch(() => {}); }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!title.trim())   { toast.error('Title is required'); return; }
    if (!excerpt.trim()) { toast.error('Excerpt is required'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', title.trim());
      fd.append('slug', toSlug(title));
      fd.append('category', category);
      fd.append('categoryColor', JSON.stringify(CAT_COLORS[category] ?? CAT_COLORS.General));
      fd.append('date', date.trim());
      fd.append('readTime', readTime.trim());
      fd.append('excerpt', excerpt.trim());
      fd.append('content', content.trim());
      fd.append('authorName', authorName.trim() || 'S2 Tech Team');
      fd.append('avatarColor', AVATAR_COLORS[avatarKey]);
      fd.append('thumb', THUMB_PRESETS[thumbKey]);
      if (imageFile) fd.append('image', imageFile);

      if (isEdit && post?.id) {
        await blogApi.update(post.id, fd);
        toast.success('Post updated');
      } else {
        await blogApi.create(fd);
        toast.success('Post published');
      }
      onSaved();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to save post');
    } finally { setLoading(false); }
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
  const sec: React.CSSProperties = { borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--overlay)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--r2)', display: 'flex', flexDirection: 'column', animation: 'fadeUp .2s ease' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text)' }}>{isEdit ? 'Edit Post' : 'New Blog Post'}</div>
            <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>{isEdit ? post.title : 'Write and publish an article'}</div>
          </div>
          <button onClick={onClose} style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--inp)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '14px', color: 'var(--text2)', fontFamily: 'inherit' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Thumbnail */}
          <div style={sec}>
            <div style={lbl}>Cover Image</div>
            <div onClick={() => imgRef.current?.click()}
              style={{ height: '130px', borderRadius: '12px', border: '2px dashed var(--border2)', cursor: 'pointer', overflow: 'hidden', position: 'relative', background: imagePreview ? 'transparent' : THUMB_PRESETS[thumbKey], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {imagePreview
                ? <img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.6)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>Click to upload cover image</div>
                  </div>
              }
            </div>
            <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
              {Object.entries(THUMB_PRESETS).map(([k, v]) => (
                <button key={k} onClick={() => setThumbKey(k)}
                  style={{ width: '32px', height: '20px', borderRadius: '6px', background: v, border: thumbKey === k ? '2px solid var(--teal)' : '2px solid transparent', cursor: 'pointer' }} />
              ))}
              <span style={{ fontSize: '11px', color: 'var(--text3)', alignSelf: 'center', marginLeft: '4px' }}>Gradient fallback</span>
            </div>
          </div>

          {/* Meta */}
          <div style={sec}>
            <div style={{ marginBottom: '14px' }}>
              <div style={lbl}>Title *</div>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="5 Fun Scratch Projects for Beginners" style={inp} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={lbl}>Category</div>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div style={lbl}>Date</div>
                <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="May 10, 2025" style={inp} />
              </div>
              <div>
                <div style={lbl}>Read Time</div>
                <input value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="4 min read" style={inp} />
              </div>
            </div>
            <div>
              <div style={lbl}>Excerpt (summary) *</div>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short 1–2 sentence summary shown on the blog card..."
                rows={2} style={{ ...inp, resize: 'vertical' }} />
            </div>
          </div>

          {/* Content */}
          <div style={sec}>
            <div style={lbl}>Full Content</div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full article here..."
              rows={10} style={{ ...inp, resize: 'vertical', lineHeight: 1.7 }} />
          </div>

          {/* Author */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', alignItems: 'end' }}>
              <div>
                <div style={lbl}>Author Name</div>
                <select value={authorName} onChange={(e) => {
                  setAuthorName(e.target.value);
                  const t = teachers.find((x) => x.name === e.target.value);
                  if (t) setAvatarKey(guessAvatarKey(t.color));
                }} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="">Custom…</option>
                  {teachers.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
                {!teachers.find((t) => t.name === authorName) && (
                  <input value={authorName} onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="S2 Tech Team" style={{ ...inp, marginTop: '8px' }} />
                )}
              </div>
              <div>
                <div style={lbl}>Avatar</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {Object.entries(AVATAR_COLORS).map(([k, v]) => (
                    <button key={k} onClick={() => setAvatarKey(k)}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', background: v, border: avatarKey === k ? '2px solid var(--teal)' : '2px solid transparent', cursor: 'pointer' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Post'}
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}
