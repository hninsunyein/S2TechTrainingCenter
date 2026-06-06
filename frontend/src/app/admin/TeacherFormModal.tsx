'use client';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import type { Teacher } from '@/types';
import { teachersApi, getImageUrl } from '@/lib/api';

interface Props {
  teacher: Teacher | null;
  onClose: () => void;
  onSaved: () => void;
}

const COLOR_PRESETS: Record<string, { color: string; cover: string }> = {
  teal:   { color: 'linear-gradient(135deg,#0ea5c8,#0c4a6e)', cover: 'linear-gradient(135deg,#0c2030,#082840)' },
  purple: { color: 'linear-gradient(135deg,#7c3aed,#4c1d95)', cover: 'linear-gradient(135deg,#1a0a30,#22103a)' },
  gold:   { color: 'linear-gradient(135deg,#f59e0b,#b45309)', cover: 'linear-gradient(135deg,#2a1804,#301e06)' },
  green:  { color: 'linear-gradient(135deg,#22c55e,#15803d)', cover: 'linear-gradient(135deg,#0d2018,#0a2a16)' },
  pink:   { color: 'linear-gradient(135deg,#f472b6,#be185d)', cover: 'linear-gradient(135deg,#2a1020,#180a18)' },
};

const PRESET_LABELS: Record<string, string> = { teal:'Teal', purple:'Purple', gold:'Gold', green:'Green', pink:'Pink' };

function guessPreset(color: string) {
  if (color.includes('0ea5c8')) return 'teal';
  if (color.includes('7c3aed')) return 'purple';
  if (color.includes('f59e0b')) return 'gold';
  if (color.includes('22c55e')) return 'green';
  if (color.includes('f472b6')) return 'pink';
  return 'teal';
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function autoInitials(name: string) {
  return name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() ?? '').join('').slice(0, 2);
}

interface SubjectRow { icon: string; name: string; }

export default function TeacherFormModal({ teacher, onClose, onSaved }: Props) {
  const isEdit = !!teacher;
  const imgRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName]         = useState(teacher?.name ?? '');
  const [role, setRole]         = useState(teacher?.role ?? '');
  const [bio, setBio]           = useState(teacher?.bio ?? '');
  const [colorPreset, setColorPreset] = useState(guessPreset(teacher?.color ?? ''));
  const [students, setStudents] = useState(teacher?.students ?? '');
  const [years, setYears]       = useState(teacher?.years ?? '');
  const [rating, setRating]     = useState(teacher?.rating ?? '5.0');
  const [tags, setTags]         = useState((teacher?.tags ?? []).join(', '));
  const [subjects, setSubjects] = useState<SubjectRow[]>(
    (teacher?.subjects ?? []).map((s) => ({ icon: s.icon, name: s.name }))
  );
  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(getImageUrl(teacher?.imageUrl) ?? '');

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const addSubject   = () => setSubjects((s) => [...s, { icon: '', name: '' }]);
  const removeSubject = (i: number) => setSubjects((s) => s.filter((_, idx) => idx !== i));
  const updateSubject = (i: number, field: 'icon' | 'name', val: string) =>
    setSubjects((s) => s.map((x, idx) => idx === i ? { ...x, [field]: val } : x));

  const handleSubmit = async () => {
    if (!name.trim()) { toast.error('Name is required'); return; }
    if (!role.trim()) { toast.error('Role is required'); return; }
    setLoading(true);
    try {
      const preset = COLOR_PRESETS[colorPreset];
      const fd = new FormData();
      fd.append('name', name.trim());
      fd.append('slug', toSlug(name));
      fd.append('initials', autoInitials(name));
      fd.append('role', role.trim());
      fd.append('bio', bio.trim());
      fd.append('color', preset.color);
      fd.append('cover', preset.cover);
      fd.append('students', students.trim());
      fd.append('years', years.trim());
      fd.append('rating', rating.trim());
      fd.append('tags', JSON.stringify(tags.split(',').map((t) => t.trim()).filter(Boolean)));
      fd.append('subjects', JSON.stringify(subjects.filter((s) => s.name)));
      if (imageFile) fd.append('image', imageFile);

      if (isEdit && teacher?.id) {
        await teachersApi.update(teacher.id, fd);
        toast.success('Teacher updated');
      } else {
        await teachersApi.create(fd);
        toast.success('Teacher added');
      }
      onSaved();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to save teacher');
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
      <div style={{ width: '100%', maxWidth: '560px', maxHeight: '90vh', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--r2)', display: 'flex', flexDirection: 'column', animation: 'fadeUp .2s ease' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text)' }}>{isEdit ? 'Edit Teacher' : 'New Teacher'}</div>
            <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>{isEdit ? teacher.name : 'Add a new instructor'}</div>
          </div>
          <button onClick={onClose} style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--inp)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '14px', color: 'var(--text2)', fontFamily: 'inherit' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Profile image */}
          <div style={sec}>
            <div style={lbl}>Profile Photo</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div onClick={() => imgRef.current?.click()}
                style={{ width: '90px', height: '90px', borderRadius: '50%', cursor: 'pointer', overflow: 'hidden', border: '3px solid var(--border2)', flexShrink: 0, background: imagePreview ? 'transparent' : COLOR_PRESETS[colorPreset].color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, color: '#fff', position: 'relative' }}>
                {imagePreview
                  ? <img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span>{autoInitials(name) || 'AB'}</span>
                }
              </div>
              <div>
                <button onClick={() => imgRef.current?.click()} style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--teal)', background: 'rgba(14,165,200,.1)', border: '1px solid rgba(14,165,200,.3)', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '6px' }}>
                  {imagePreview ? 'Change Photo' : 'Upload Photo'}
                </button>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>PNG, JPG · max 5 MB</div>
              </div>
            </div>
            <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
          </div>

          {/* Basic info */}
          <div style={sec}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <div style={lbl}>Full Name *</div>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tr. Hnin Su" style={inp} />
              </div>
              <div>
                <div style={lbl}>Role *</div>
                <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Lead Instructor" style={inp} />
              </div>
            </div>
            <div>
              <div style={lbl}>Bio</div>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Brief description of the teacher's background and teaching style..." rows={3} style={{ ...inp, resize: 'vertical' }} />
            </div>
          </div>

          {/* Color theme */}
          <div style={sec}>
            <div style={lbl}>Color Theme</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {Object.keys(COLOR_PRESETS).map((k) => (
                <button key={k} onClick={() => setColorPreset(k)}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', background: COLOR_PRESETS[k].color, border: colorPreset === k ? '3px solid var(--teal)' : '3px solid transparent', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {colorPreset === k && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>OK</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={sec}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={lbl}>Students</div>
                <input value={students} onChange={(e) => setStudents(e.target.value)} placeholder="50+" style={inp} />
              </div>
              <div>
                <div style={lbl}>Years Exp.</div>
                <input value={years} onChange={(e) => setYears(e.target.value)} placeholder="3+" style={inp} />
              </div>
              <div>
                <div style={lbl}>Rating</div>
                <input value={rating} onChange={(e) => setRating(e.target.value)} placeholder="5.0" style={inp} />
              </div>
            </div>
            <div>
              <div style={lbl}>Tags (comma-separated)</div>
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Online & Offline, Ages 5–14" style={inp} />
            </div>
          </div>

          {/* Subjects */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={lbl}>Subjects Taught</div>
              <button onClick={addSubject} style={{ fontSize: '12px', fontWeight: 700, color: 'var(--teal)', background: 'rgba(14,165,200,.1)', border: '1px solid rgba(14,165,200,.3)', borderRadius: '8px', padding: '4px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>+ Add</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {subjects.map((s, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '44px 1fr auto', gap: '8px', alignItems: 'center' }}>
                  <input value={s.icon} onChange={(e) => updateSubject(i, 'icon', e.target.value)} placeholder="icon" style={{ ...inp, textAlign: 'center', fontSize: '13px', padding: '7px' }} maxLength={2} />
                  <input value={s.name} onChange={(e) => updateSubject(i, 'name', e.target.value)} placeholder="Scratch Level 1" style={{ ...inp, fontSize: '12px', padding: '7px 10px' }} />
                  <button onClick={() => removeSubject(i)} style={{ width: '30px', height: '30px', borderRadius: '6px', background: 'rgba(239,68,68,.1)', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px', fontFamily: 'inherit' }}>×</button>
                </div>
              ))}
              {subjects.length === 0 && <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text3)', fontSize: '12px' }}>No subjects yet</div>}
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Teacher'}
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}
