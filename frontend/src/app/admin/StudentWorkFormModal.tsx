'use client';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import type { Student } from '@/types';
import { studentsApi, getImageUrl } from '@/lib/api';

interface Props {
  student: Student | null;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES: {
  key: string;
  label: string;
  icon: string;
  bg: string;
  badge: string;
  badgeLabel: string;
  badgeStyle: React.CSSProperties;
}[] = [
  {
    key: 'scratch',
    label: 'Scratch Game',
    icon: 'S',
    bg: 'linear-gradient(135deg,#0a1e2a,#081828)',
    badge: 'scratch-b',
    badgeLabel: 'Scratch',
    badgeStyle: { background: 'rgba(14,165,200,.2)', border: '1px solid rgba(14,165,200,.35)', color: 'var(--teal)' },
  },
  {
    key: 'paint',
    label: 'Paint / Drawing',
    icon: 'P',
    bg: 'linear-gradient(135deg,#1a2a14,#0d1a0a)',
    badge: 'paint-b',
    badgeLabel: 'Paint',
    badgeStyle: { background: 'rgba(244,114,182,.2)', border: '1px solid rgba(244,114,182,.35)', color: 'var(--pink)' },
  },
  {
    key: 'ppt',
    label: 'PowerPoint Slide',
    icon: 'W',
    bg: 'linear-gradient(135deg,#1a0a28,#120822)',
    badge: 'ppt-b',
    badgeLabel: 'PowerPoint',
    badgeStyle: { background: 'rgba(167,139,250,.2)', border: '1px solid rgba(167,139,250,.35)', color: 'var(--purple)' },
  },
];

const AVATAR_COLORS: Record<string, string> = {
  teal:   'linear-gradient(135deg,#0ea5c8,#0284a8)',
  gold:   'linear-gradient(135deg,#f59e0b,#d97706)',
  green:  'linear-gradient(135deg,#22c55e,#16a34a)',
  purple: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
  pink:   'linear-gradient(135deg,#f472b6,#db2777)',
  orange: 'linear-gradient(135deg,#fb923c,#ea580c)',
};

function autoInitials(name: string) {
  return name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() ?? '').join('').slice(0, 2);
}

function guessAvatarKey(color: string) {
  if (color.includes('0ea5c8')) return 'teal';
  if (color.includes('f59e0b')) return 'gold';
  if (color.includes('22c55e')) return 'green';
  if (color.includes('a78bfa')) return 'purple';
  if (color.includes('f472b6')) return 'pink';
  if (color.includes('fb923c')) return 'orange';
  return 'teal';
}

export default function StudentWorkFormModal({ student, onClose, onSaved }: Props) {
  const isEdit = !!student;
  const imgRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const defaultCat = CATEGORIES.find((c) => c.key === student?.category) ?? CATEGORIES[0];

  const [category, setCategory]   = useState(student?.category ?? 'scratch');
  const [project, setProject]     = useState(student?.project ?? '');
  const [studentName, setStudentName] = useState(student?.name ?? '');
  const [className, setClassName] = useState(student?.className ?? '');
  const [emoji, setEmoji]         = useState(student?.emoji ?? defaultCat.icon);
  const [avatarKey, setAvatarKey] = useState(guessAvatarKey(student?.avatarColor ?? ''));
  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(getImageUrl(student?.imageUrl) ?? '');

  const selectedCat = CATEGORIES.find((c) => c.key === category) ?? CATEGORIES[0];

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleCategoryChange = (key: string) => {
    setCategory(key);
    const cat = CATEGORIES.find((c) => c.key === key);
    if (cat && !isEdit) setEmoji(cat.icon);
  };

  const handleSubmit = async () => {
    if (!project.trim())     { toast.error('Project title is required'); return; }
    if (!studentName.trim()) { toast.error('Student name is required'); return; }
    if (!imageFile && !student?.imageUrl) {
      toast.error('Please upload a project image'); return;
    }

    setLoading(true);
    try {
      const cat = CATEGORIES.find((c) => c.key === category)!;
      const fd = new FormData();
      fd.append('category', category);
      fd.append('project', project.trim());
      fd.append('name', studentName.trim());
      fd.append('className', className.trim());
      fd.append('emoji', emoji || cat.icon);
      fd.append('bg', cat.bg);
      fd.append('badge', cat.badge);
      fd.append('badgeLabel', cat.badgeLabel);
      fd.append('avatarColor', AVATAR_COLORS[avatarKey]);
      fd.append('initials', autoInitials(studentName));
      if (imageFile) fd.append('image', imageFile);

      if (isEdit && student?.id) {
        await studentsApi.update(student.id, fd);
        toast.success('Student work updated');
      } else {
        await studentsApi.create(fd);
        toast.success('Student work added');
      }
      onSaved();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to save');
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
  const sec: React.CSSProperties = {
    borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px',
  };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--overlay)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '520px', maxHeight: '90vh', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--r2)', display: 'flex', flexDirection: 'column', animation: 'fadeUp .2s ease' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text)' }}>
              {isEdit ? 'Edit Student Work' : 'Add Student Work'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>
              Scratch · Paint · PowerPoint
            </div>
          </div>
          <button onClick={onClose} style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--inp)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '14px', color: 'var(--text2)', fontFamily: 'inherit' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* Category picker */}
          <div style={sec}>
            <div style={lbl}>Project Type *</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
              {CATEGORIES.map((cat) => (
                <button key={cat.key} onClick={() => handleCategoryChange(cat.key)}
                  style={{
                    padding: '14px 8px', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit',
                    border: category === cat.key ? '2px solid var(--teal)' : '2px solid var(--border)',
                    background: category === cat.key ? 'rgba(14,165,200,.08)' : 'var(--inp)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  }}>
                  <span style={{ fontSize: '26px' }}>{cat.icon}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: category === cat.key ? 'var(--teal)' : 'var(--text2)' }}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Project image upload */}
          <div style={sec}>
            <div style={lbl}>Project Image * <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '10px', color: 'var(--text3)' }}>(screenshot / photo of the work)</span></div>
            <div
              onClick={() => imgRef.current?.click()}
              style={{
                height: '180px', borderRadius: '12px', border: '2px dashed var(--border2)',
                cursor: 'pointer', overflow: 'hidden', position: 'relative',
                background: imagePreview ? 'transparent' : selectedCat.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
              {imagePreview ? (
                <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.7)', fontWeight: 600 }}>Click to upload project image</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.45)', marginTop: '4px' }}>PNG, JPG · max 5 MB</div>
                </div>
              )}
              {imagePreview && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}>
                  <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>Change Image</span>
                </div>
              )}
            </div>
            <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
          </div>

          {/* Project info */}
          <div style={sec}>
            <div style={{ marginBottom: '14px' }}>
              <div style={lbl}>Project Title *</div>
              <input value={project} onChange={(e) => setProject(e.target.value)}
                placeholder="e.g. Apple Tree Drawing, Star Catcher Game" style={inp} />
            </div>
            <div>
              <div style={lbl}>Emoji Icon <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '10px', color: 'var(--text3)' }}>(shown as fallback)</span></div>
              <input value={emoji} onChange={(e) => setEmoji(e.target.value)}
                placeholder="—" style={{ ...inp, fontSize: '14px', textAlign: 'center', width: '60px' }} maxLength={2} />
            </div>
          </div>

          {/* Student info */}
          <div style={sec}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <div style={lbl}>Student Name *</div>
                <input value={studentName} onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ma Khin Myat" style={inp} />
              </div>
              <div>
                <div style={lbl}>Class / Grade</div>
                <input value={className} onChange={(e) => setClassName(e.target.value)}
                  placeholder="Scratch L1 · Age 8" style={inp} />
              </div>
            </div>

            {/* Avatar color */}
            <div>
              <div style={lbl}>Avatar Color</div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {Object.entries(AVATAR_COLORS).map(([k, v]) => (
                  <button key={k} onClick={() => setAvatarKey(k)}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', background: v, border: avatarKey === k ? '3px solid var(--teal)' : '3px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {avatarKey === k && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 800 }}>OK</span>}
                  </button>
                ))}
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: AVATAR_COLORS[avatarKey], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#fff', marginLeft: '8px', flexShrink: 0 }}>
                  {autoInitials(studentName) || 'AB'}
                </div>
              </div>
            </div>
          </div>

          {/* Preview card */}
          <div>
            <div style={lbl}>Preview</div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', overflow: 'hidden', maxWidth: '200px' }}>
              <div style={{ height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: selectedCat.bg, overflow: 'hidden' }}>
                {imagePreview
                  ? <img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '36px', zIndex: 1 }}>{emoji || selectedCat.icon}</span>
                }
                <span style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '.05em', ...selectedCat.badgeStyle }}>
                  {selectedCat.badgeLabel}
                </span>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>{project || 'Project Title'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: AVATAR_COLORS[avatarKey], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{autoInitials(studentName) || 'AB'}</div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text)' }}>{studentName || 'Student Name'}</div>
                    <div style={{ fontSize: '9px', color: 'var(--text2)' }}>{className || 'Class · Age'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Student Work'}
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}
