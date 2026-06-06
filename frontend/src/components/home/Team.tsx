'use client';
import { useEffect, useRef, useState } from 'react';
import type { Teacher } from '@/types';
import { teachersApi, getImageUrl } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Team() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);

  useEffect(() => {
    teachersApi.getAll()
      .then(setTeachers)
      .catch(() => setTeachers([]));
  }, []);

  useEffect(() => {
    if (!teachers) return;
    const els = ref.current?.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.08 });
    els?.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [teachers]);

  return (
    <section ref={ref} id="team" style={{ padding: '80px 5%' }}>
      <div style={{ marginBottom: '40px' }}>
        <div className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '10px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '12px' }}>
          <span style={{ width: '16px', height: '2px', background: 'var(--teal)', borderRadius: '2px', display: 'block' }} />
          {t('team_tag')}
        </div>
        <h2 className="reveal d1" style={{ fontSize: 'clamp(26px,3.2vw,40px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.06, marginBottom: '12px', color: 'var(--text)' }}>{t('team_title')}</h2>
        <p className="reveal d2" style={{ fontSize: '15px', color: 'var(--text2)', maxWidth: '520px', lineHeight: 1.75 }}>{t('team_sub')}</p>
      </div>

      {teachers === null ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontSize: '14px' }}>Loading…</div>
      ) : teachers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontSize: '14px' }}>No teachers listed yet.</div>
      ) : (
      <div className="team-grid">
        {teachers.map((tc, i) => (
          <div key={tc.id} className={`reveal${i ? ` d${i}` : ''}`}
            style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', overflow: 'hidden', transition: 'transform .3s,border-color .3s,background .3s', position: 'relative' }}>
            <div style={{ height: '180px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: tc.cover }}>
              <div style={{ position: 'absolute', inset: 0, background: tc.color, opacity: .15 }} />
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800, color: '#fff', border: '4px solid rgba(255,255,255,.2)', boxShadow: '0 8px 32px rgba(0,0,0,.3)', background: tc.color, margin: '0 auto 10px', overflow: 'hidden' }}>
                  {tc.imageUrl
                    ? <img src={getImageUrl(tc.imageUrl)!} alt={tc.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                    : tc.initials
                  }
                  <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--green)', border: '3px solid var(--card)' }} />
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '-.4px', textShadow: '0 1px 8px rgba(0,0,0,.4)' }}>{tc.name}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.75)', marginTop: '2px' }}>{tc.role}</div>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.65, marginBottom: '16px' }}>{tc.bio}</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '8px' }}>{t('team_subjects')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
                {tc.subjects.map((s) => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg3)', borderRadius: '8px', padding: '7px 10px' }}>
                    <span style={{ fontSize: '14px', flexShrink: 0 }}>{s.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{s.name}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px', marginBottom: '14px' }}>
                {[['team_students', tc.students], ['team_years', tc.years], ['team_rating', tc.rating]].map(([key, val]) => (
                  <div key={key} style={{ background: 'var(--bg3)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-.5px', color: key === 'team_rating' ? 'var(--gold)' : 'var(--text)' }}>{val}</div>
                    <div style={{ fontSize: '9px', color: 'var(--text2)', marginTop: '1px' }}>{t(key as Parameters<typeof t>[0])}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {tc.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: '10px', fontWeight: 600, padding: '3px 9px', borderRadius: '100px', background: 'var(--inp)', border: '1px solid var(--border)', color: 'var(--text2)' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </section>
  );
}
