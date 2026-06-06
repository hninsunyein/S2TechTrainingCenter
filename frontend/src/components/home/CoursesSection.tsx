'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Course } from '@/types';
import { coursesApi, getImageUrl } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CoursesSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    coursesApi.getAll()
      .then(setCourses)
      .catch(() => setCourses([]));
  }, []);

  useEffect(() => {
    if (!courses) return;
    const els = ref.current?.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.08 });
    els?.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [courses]);

  const list = courses ?? [];

  return (
    <section ref={ref} id="courses" style={{ padding: '80px 5%' }} className="sec-pad">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '10px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '12px' }}>
            <span style={{ width: '16px', height: '2px', background: 'var(--teal)', borderRadius: '2px', display: 'block' }} />
            {t('courses_tag')}
          </div>
          <h2 className="reveal d1" style={{ fontSize: 'clamp(26px,3.2vw,40px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.06, marginBottom: '12px', color: 'var(--text)' }}>{t('courses_title')}</h2>
          <p className="reveal d2" style={{ fontSize: '15px', color: 'var(--text2)', maxWidth: '520px', lineHeight: 1.75 }}>{t('courses_sub')}</p>
        </div>
      </div>

      {courses === null ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)', fontSize: '14px' }}>Loading courses…</div>
      ) : list.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)', fontSize: '14px' }}>No courses available yet.</div>
      ) : (
        <div className="courses-grid">
          {list.map((c, i) => (
            <Link key={c.id} href={`/courses/${c.slug}`} style={{ textDecoration: 'none' }}>
              <div className={`reveal${i ? (i < 3 ? ` d${i}` : '') : ''}`}
                style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', overflow: 'hidden', cursor: 'pointer', transition: 'transform .3s,border-color .3s,box-shadow .3s', display: 'flex', flexDirection: 'column', height: '100%' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 50px ${c.shadow}`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
              >
                <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '52px', position: 'relative', background: c.imageUrl ? 'transparent' : c.thumb, overflow: 'hidden' }}>
                  {c.imageUrl && <img src={getImageUrl(c.imageUrl)!} alt={c.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                  {!c.imageUrl && c.emoji}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', letterSpacing: '.04em', textTransform: 'uppercase', background: c.badgeColor, border: '1px solid rgba(255,255,255,.15)', color: c.badgeText }}>
                    {c.badge}
                  </div>
                </div>
                <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '6px' }}>{c.category}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-.4px', marginBottom: '7px', color: 'var(--text)' }}>{c.name}</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text2)', lineHeight: 1.65, marginBottom: '14px', flex: 1 }}>{c.tagline}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', display: 'flex', gap: '8px' }}>
                      {c.tags.slice(0, 2).map((tg) => <span key={tg}>{tg}</span>)}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '100px', background: 'var(--inp)', color: 'var(--text2)' }}>{c.tags[0]}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
