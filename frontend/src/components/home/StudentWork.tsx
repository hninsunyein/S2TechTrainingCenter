'use client';
import { useEffect, useRef, useState } from 'react';
import type { Student } from '@/types';
import { studentsApi, getImageUrl } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

export default function StudentWork() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const [students, setStudents] = useState<Student[] | null>(null);
  const [active, setActive] = useState('all');

  useEffect(() => {
    studentsApi.getAll()
      .then(setStudents)
      .catch(() => setStudents([]));
  }, []);

  useEffect(() => {
    if (!students) return;
    const els = ref.current?.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.08 });
    els?.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [students, active]);

  const list = students ?? [];
  const filtered = active === 'all' ? list : list.filter((s) => s.category === active);

  const badgeStyle: Record<string, React.CSSProperties> = {
    paint:   { background: 'rgba(244,114,182,.2)', border: '1px solid rgba(244,114,182,.35)', color: 'var(--pink)' },
    scratch: { background: 'rgba(14,165,200,.2)',  border: '1px solid rgba(14,165,200,.35)',  color: 'var(--teal)' },
    ppt:     { background: 'rgba(167,139,250,.2)', border: '1px solid rgba(167,139,250,.35)', color: 'var(--purple)' },
  };

  return (
    <section ref={ref} id="students" style={{ padding: '80px 5%', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', transition: 'background .3s' }}>
      <div style={{ marginBottom: '28px' }}>
        <div className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '10px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '12px' }}>
          <span style={{ width: '16px', height: '2px', background: 'var(--teal)', borderRadius: '2px', display: 'block' }} />
          {t('sw_tag')}
        </div>
        <h2 className="reveal d1" style={{ fontSize: 'clamp(26px,3.2vw,40px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.06, marginBottom: '12px', color: 'var(--text)' }}>{t('sw_title')}</h2>
        <p className="reveal d2" style={{ fontSize: '15px', color: 'var(--text2)', maxWidth: '520px', lineHeight: 1.75 }}>{t('sw_sub')}</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '7px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {[['all', t('sw_all')], ['scratch', t('sw_scratch')], ['paint', t('sw_paint')], ['ppt', t('sw_ppt')]].map(([key, label]) => (
          <button key={key} onClick={() => setActive(key)}
            style={{ padding: '7px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, border: active === key ? '1px solid var(--teal)' : '1px solid var(--border)', background: active === key ? 'var(--teal)' : 'transparent', color: active === key ? '#fff' : 'var(--text2)', cursor: 'pointer', transition: 'all .2s', fontFamily: 'inherit' }}>
            {label}
          </button>
        ))}
      </div>

      {students === null ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)', fontSize: '14px' }}>Loading…</div>
      ) : (
        <div className="sw-grid">
          {filtered.map((s, i) => (
            <div key={s.id} className={`reveal${i % 4 !== 0 ? ` d${Math.min(i % 4, 3)}` : ''}`}
              style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', overflow: 'hidden', transition: 'transform .3s,border-color .3s,background .3s' }}>
              <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: s.bg, overflow: 'hidden' }}>
                {s.imageUrl
                  ? <img src={getImageUrl(s.imageUrl)!} alt={s.project} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '46px', zIndex: 1 }}>{s.emoji}</span>
                }
                <span style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '9px', fontWeight: 700, padding: '3px 9px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '.05em', ...badgeStyle[s.category] }}>
                  {s.badgeLabel}
                </span>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px', letterSpacing: '-.2px' }}>{s.project}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff', flexShrink: 0, background: s.avatarColor }}>{s.initials}</div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{s.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text2)', marginTop: '1px' }}>{s.className}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text3)', fontSize: '14px' }}>No projects in this category yet.</div>
          )}
        </div>
      )}
    </section>
  );
}
