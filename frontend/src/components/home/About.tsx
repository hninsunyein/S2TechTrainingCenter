'use client';
import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.08 });
    els?.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const MVM = [
    { accent: 'linear-gradient(90deg,var(--teal),var(--teal2))',   icon: '🎯', label: t('mission_label'), title: t('mission_title'), body: t('mission_body') },
    { accent: 'linear-gradient(90deg,var(--purple),#6d28d9)',      icon: '🔭', label: t('vision_label'),  title: t('vision_title'),  body: t('vision_body')  },
    { accent: 'linear-gradient(90deg,var(--gold),#d97706)',        icon: '⭐', label: t('motto_label'),   title: t('motto_title'),   body: t('motto_body')   },
  ];

  const STATS = [
    { n: '50+', l: t('stat_students'), featured: true,  color: 'var(--teal)' },
    { n: '4',   l: t('stat_courses'),  featured: false, color: 'var(--text)' },
    { n: '3',   l: t('stat_teachers'), featured: false, color: 'var(--text)' },
    { n: '2022',l: t('stat_founded'),  featured: false, color: 'var(--gold)' },
    { n: '5.0', l: t('stat_rating'),   featured: false, color: 'var(--green)'},
  ];

  return (
    <section ref={ref} id="about" style={{ padding: '80px 5%', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', transition: 'background .3s' }}>
      <div style={{ alignItems: 'center' }} className="about-grid">
        {/* Text */}
        <div>
          <div className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '10px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '12px' }}>
            <span style={{ width: '16px', height: '2px', background: 'var(--teal)', borderRadius: '2px', display: 'block' }} />
            {t('about_tag')}
          </div>
          <h2 className="reveal d1" style={{ fontSize: 'clamp(26px,3.2vw,40px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.06, marginBottom: '12px', color: 'var(--text)' }}>{t('about_title')}</h2>
          <p className="reveal d2" style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '14px' }}>{t('about_p1')}</p>
          <p className="reveal"    style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '14px' }}>{t('about_p2')}</p>
          <p className="reveal"    style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '14px' }}>{t('about_p3')}</p>

          <div className="mvm-grid">
            {MVM.map((m, i) => (
              <div key={m.label} className={`reveal${i ? ` d${i}` : ''}`}
                style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '24px', position: 'relative', overflow: 'hidden', transition: 'transform .3s,border-color .3s,background .3s' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: m.accent }} />
                <span style={{ fontSize: '30px', marginBottom: '12px', display: 'block' }}>{m.icon}</span>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '6px' }}>{m.label}</div>
                <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-.4px', color: 'var(--text)', marginBottom: '8px' }}>{m.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7 }}>{m.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats visual */}
        <div className="reveal d1">
          <div className="av-stat-grid">
            {STATS.map((s) => (
              <div key={s.l}
                style={{
                  gridColumn: s.featured ? 'span 2' : undefined,
                  background: s.featured ? 'linear-gradient(135deg,rgba(14,165,200,.12),rgba(14,165,200,.04))' : 'var(--card)',
                  border: s.featured ? '1px solid rgba(14,165,200,.25)' : '1px solid var(--border)',
                  borderRadius: 'var(--r2)', padding: s.featured ? '28px' : '22px',
                  textAlign: 'center', transition: 'background .3s',
                }}>
                <div style={{ fontSize: s.featured ? '48px' : '36px', fontWeight: 800, letterSpacing: '-2px', color: s.color, lineHeight: 1 }}>
                  {s.n.replace('+','')}{s.n.includes('+') && <em style={{ fontStyle: 'normal' }}>+</em>}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '6px' }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid rgba(245,158,11,.3)', borderRadius: 'var(--r2)', padding: '16px 20px', textAlign: 'center', marginTop: '12px', transition: 'background .3s' }}>
            <span style={{ fontSize: '24px' }}>🏆</span>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gold)', marginTop: '4px' }}>{t('stat_badge')}</p>
            <small style={{ fontSize: '11px', color: 'var(--text2)' }}>{t('stat_badge_sub')}</small>
          </div>
        </div>
      </div>
    </section>
  );
}
