'use client';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import type { Course, Teacher } from '@/types';
import { coursesApi, teachersApi, getImageUrl } from '@/lib/api';

interface Props {
  course: Course | null; // null = create mode
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES = [
  'Coding · Scratch',
  'Coding · Python',
  'Language · English',
];

const COLOR_THEMES: Record<string, {
  color: string; shadow: string; thumb: string; badgeColor: string; badgeText: string;
}> = {
  teal:   { color: '#0ea5c8', shadow: 'rgba(14,165,200,.18)',   thumb: 'linear-gradient(135deg,#0c1e30,#0a2a3a)', badgeColor: 'rgba(14,165,200,.2)',   badgeText: '#7dd3fc' },
  green:  { color: '#22c55e', shadow: 'rgba(34,197,94,.18)',    thumb: 'linear-gradient(135deg,#0d2018,#0a2a16)', badgeColor: 'rgba(34,197,94,.2)',    badgeText: '#86efac' },
  purple: { color: '#a78bfa', shadow: 'rgba(167,139,250,.18)',  thumb: 'linear-gradient(135deg,#12102a,#1a1040)', badgeColor: 'rgba(167,139,250,.2)',  badgeText: '#c4b5fd' },
  gold:   { color: '#f59e0b', shadow: 'rgba(245,158,11,.18)',   thumb: 'linear-gradient(135deg,#1e1608,#2a1e08)', badgeColor: 'rgba(245,158,11,.2)',   badgeText: '#fcd34d' },
  pink:   { color: '#f472b6', shadow: 'rgba(244,114,182,.18)',  thumb: 'linear-gradient(135deg,#2a1020,#180a18)', badgeColor: 'rgba(244,114,182,.2)',  badgeText: '#fbcfe8' },
};

const THEME_LABELS: Record<string, string> = {
  teal: 'Teal', green: 'Green', purple: 'Purple', gold: 'Gold', pink: 'Pink',
};

function guessTheme(color: string): string {
  if (color.includes('0ea5c8')) return 'teal';
  if (color.includes('22c55e')) return 'green';
  if (color.includes('a78bfa')) return 'purple';
  if (color.includes('f59e0b')) return 'gold';
  if (color.includes('f472b6')) return 'pink';
  return 'teal';
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

interface LessonRow { title: string; duration: string; isFree: boolean; videoUrl: string; }

export default function CourseFormModal({ course, onClose, onSaved }: Props) {
  const isEdit = !!course;
  const imgRef = useRef<HTMLInputElement>(null);

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName]           = useState(course?.name ?? '');
  const [category, setCategory]   = useState(course?.category ?? 'Coding · Scratch');
  const [emoji, setEmoji]         = useState(course?.emoji ?? '');
  const [tagline, setTagline]     = useState(course?.tagline ?? '');
  const [description, setDescription] = useState(course?.description ?? '');
  const [colorTheme, setColorTheme]   = useState(guessTheme(course?.color ?? ''));
  const [badge, setBadge]         = useState(course?.badge ?? '');
  const [price, setPrice]         = useState(course?.price ?? '35,000 Ks / month');
  const [priceShort, setPriceShort]   = useState(course?.priceShort ?? '35,000 Ks');
  const [ageMin, setAgeMin]       = useState(() => {
    const t = course?.tags?.find((x) => x.startsWith('Age '));
    return t ? t.replace('Age ', '').replace('+', '').replace('–14', '') : '7';
  });
  const [extraTags, setExtraTags] = useState(() =>
    (course?.tags ?? []).filter((t) => !t.startsWith('Age ')).join(', ')
  );
  const [teacherId, setTeacherId] = useState(course?.teacherId ?? '');
  const [aboutPoints, setAboutPoints] = useState((course?.aboutPoints ?? []).join('\n'));
  const [lessons, setLessons]     = useState<LessonRow[]>(() =>
    (course?.lessons ?? []).map((l) => ({ title: l.title, duration: l.duration, isFree: l.isFree, videoUrl: l.videoUrl ?? '' }))
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(getImageUrl(course?.imageUrl) ?? '');

  useEffect(() => {
    teachersApi.getAll().then(setTeachers).catch(() => {});
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const addLesson = () => setLessons((l) => [...l, { title: '', duration: '', isFree: false, videoUrl: '' }]);
  const removeLesson = (i: number) => setLessons((l) => l.filter((_, idx) => idx !== i));
  const updateLesson = (i: number, field: keyof LessonRow, val: string | boolean) =>
    setLessons((l) => l.map((x, idx) => idx === i ? { ...x, [field]: val } : x));

  const handleSubmit = async () => {
    if (!name.trim()) { toast.error('Course name is required'); return; }
    if (!teacherId) { toast.error('Please select a teacher'); return; }

    setLoading(true);
    try {
      const theme = COLOR_THEMES[colorTheme];
      const tags = [`Age ${ageMin}+`, ...extraTags.split(',').map((t) => t.trim()).filter(Boolean)];
      const points = aboutPoints.split('\n').map((l) => l.trim()).filter(Boolean);
      const stats = [
        { n: String(lessons.length || '?'), l: 'Lessons' },
        { n: ageMin + '+', l: 'Min Age' },
        { n: 'HD', l: 'Video' },
      ];

      const fd = new FormData();
      fd.append('name', name.trim());
      fd.append('slug', toSlug(name));
      fd.append('category', category);
      fd.append('emoji', emoji || '');
      fd.append('tagline', tagline.trim());
      fd.append('description', description.trim());
      fd.append('color', theme.color);
      fd.append('shadow', theme.shadow);
      fd.append('thumb', theme.thumb);
      fd.append('badge', badge.trim());
      fd.append('badgeColor', theme.badgeColor);
      fd.append('badgeText', theme.badgeText);
      fd.append('price', price.trim());
      fd.append('priceShort', priceShort.trim());
      fd.append('teacherId', teacherId);
      fd.append('tags', JSON.stringify(tags));
      fd.append('aboutPoints', JSON.stringify(points));
      fd.append('stats', JSON.stringify(stats));
      fd.append('lessons', JSON.stringify(lessons));
      if (imageFile) fd.append('image', imageFile);

      if (isEdit && course?.id) {
        await coursesApi.update(course.id, fd);
        toast.success('Course updated');
      } else {
        await coursesApi.create(fd);
        toast.success('Course created');
      }
      onSaved();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: '100%', background: 'var(--inp)', border: '1px solid var(--border)',
    borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: 'var(--text)',
    fontFamily: 'inherit', outline: 'none',
  };
  const label: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text2)',
    textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '6px',
  };
  const section: React.CSSProperties = {
    borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px',
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--overlay)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
    >
      <div style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--r2)', display: 'flex', flexDirection: 'column', animation: 'fadeUp .2s ease' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text)' }}>
              {isEdit ? 'Edit Course' : 'New Course'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>
              {isEdit ? course.name : 'Fill in the details below'}
            </div>
          </div>
          <button onClick={onClose} style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--inp)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '14px', color: 'var(--text2)', fontFamily: 'inherit' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Image */}
          <div style={section}>
            <div style={label}>Course Thumbnail Image</div>
            <div
              onClick={() => imgRef.current?.click()}
              style={{ height: '140px', borderRadius: '12px', border: '2px dashed var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative', background: imagePreview ? 'transparent' : COLOR_THEMES[colorTheme].thumb }}
            >
              {imagePreview
                ? <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.6)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>Click to upload image</div>
                    <div style={{ fontSize: '10px', marginTop: '2px', opacity: .7 }}>PNG, JPG · max 5 MB</div>
                  </div>
              }
              {imagePreview && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}>
                  <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>Change Image</span>
                </div>
              )}
            </div>
            <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
          </div>

          {/* Basic Info */}
          <div style={section}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <div style={label}>Course Name *</div>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Scratch Level 1" style={inp} />
              </div>
              <div>
                <div style={label}>Emoji Icon</div>
                <input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="—" style={{ ...inp, fontSize: '14px', textAlign: 'center' }} maxLength={2} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={label}>Category</div>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={label}>Tagline (short subtitle)</div>
              <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. Visual block programming for beginners" style={inp} />
            </div>

            <div>
              <div style={label}>Description</div>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Full description of the course..." rows={3} style={{ ...inp, resize: 'vertical' }} />
            </div>
          </div>

          {/* Color Theme & Badge */}
          <div style={section}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <div style={label}>Color Theme</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.keys(COLOR_THEMES).map((t) => (
                    <button
                      key={t}
                      onClick={() => setColorTheme(t)}
                      style={{
                        padding: '6px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 700,
                        border: colorTheme === t ? `2px solid ${COLOR_THEMES[t].color}` : '2px solid var(--border)',
                        background: colorTheme === t ? `${COLOR_THEMES[t].color}22` : 'var(--inp)',
                        color: colorTheme === t ? COLOR_THEMES[t].color : 'var(--text2)',
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >{THEME_LABELS[t]}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={label}>Badge (e.g. Level 1)</div>
                <input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Level 1" style={inp} />
              </div>
            </div>
          </div>

          {/* Pricing & Details */}
          <div style={section}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <div style={label}>Price (full)</div>
                <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="35,000 Ks / month" style={inp} />
              </div>
              <div>
                <div style={label}>Price (short)</div>
                <input value={priceShort} onChange={(e) => setPriceShort(e.target.value)} placeholder="35,000 Ks" style={inp} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <div style={label}>Minimum Age</div>
                <input value={ageMin} onChange={(e) => setAgeMin(e.target.value)} placeholder="7" style={inp} type="number" min="1" max="18" />
              </div>
              <div>
                <div style={label}>Teacher *</div>
                <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="">Select teacher…</option>
                  {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Extra Tags */}
          <div style={section}>
            <div style={label}>Extra Tags (comma-separated)</div>
            <input value={extraTags} onChange={(e) => setExtraTags(e.target.value)} placeholder="12 Lessons, 3 Months, Online + Offline" style={inp} />
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '5px' }}>
              "Age {ageMin}+" is added automatically. Add lesson count, duration, format etc.
            </div>
          </div>

          {/* What You'll Learn */}
          <div style={section}>
            <div style={label}>What You'll Learn (one point per line)</div>
            <textarea
              value={aboutPoints}
              onChange={(e) => setAboutPoints(e.target.value)}
              placeholder={'Learn to code with Scratch blocks\nBuild a mini-game project\nCreate animations and stories'}
              rows={5}
              style={{ ...inp, resize: 'vertical' }}
            />
          </div>

          {/* Lessons */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={label}>Lessons ({lessons.length})</div>
              <button onClick={addLesson} style={{ fontSize: '12px', fontWeight: 700, color: 'var(--teal)', background: 'rgba(14,165,200,.1)', border: '1px solid rgba(14,165,200,.3)', borderRadius: '8px', padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                + Add Lesson
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lessons.map((l, i) => (
                <div key={i} style={{ background: 'var(--inp)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '8px', alignItems: 'center' }}>
                    <input
                      value={l.title}
                      onChange={(e) => updateLesson(i, 'title', e.target.value)}
                      placeholder={`Lesson ${i + 1} title`}
                      style={{ ...inp, fontSize: '12px', padding: '7px 10px' }}
                    />
                    <input
                      value={l.duration}
                      onChange={(e) => updateLesson(i, 'duration', e.target.value)}
                      placeholder="10:00"
                      style={{ ...inp, width: '70px', fontSize: '12px', padding: '7px 10px', textAlign: 'center' }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '11px', color: 'var(--green)', fontWeight: 700, margin: 0 }}>
                      <input type="checkbox" checked={l.isFree} onChange={(e) => updateLesson(i, 'isFree', e.target.checked)} />
                      Free
                    </label>
                    <button onClick={() => removeLesson(i)} style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(239,68,68,.1)', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>×</button>
                  </div>
                  {l.isFree && (
                    <input
                      value={l.videoUrl}
                      onChange={(e) => updateLesson(i, 'videoUrl', e.target.value)}
                      placeholder="YouTube URL (e.g. https://youtube.com/watch?v=...)"
                      style={{ ...inp, fontSize: '11px', padding: '6px 10px', color: 'var(--text3)' }}
                    />
                  )}
                </div>
              ))}
              {lessons.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontSize: '13px' }}>No lessons yet — click "+ Add Lesson" to start</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Course'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
