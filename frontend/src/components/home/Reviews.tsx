'use client';
import { useEffect, useRef, useState } from 'react';
import type { Review } from '@/types';
import { reviewsApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Reviews() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    reviewsApi.getAll()
      .then(setReviews)
      .catch(() => setReviews([]));
  }, []);

  useEffect(() => {
    if (!reviews) return;
    const els = ref.current?.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.08 });
    els?.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [reviews]);

  const list = reviews ?? [];

  return (
    <section ref={ref} id="reviews" style={{ padding: '80px 5%' }}>
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <div className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '10px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '12px', justifyContent: 'center' }}>
          <span style={{ width: '16px', height: '2px', background: 'var(--teal)', borderRadius: '2px', display: 'block' }} />
          {t('rev_tag')}
        </div>
        <h2 className="reveal d1" style={{ fontSize: 'clamp(26px,3.2vw,40px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.06, marginBottom: '12px', color: 'var(--text)' }}>{t('rev_title')}</h2>
        <p className="reveal d2" style={{ fontSize: '15px', color: 'var(--text2)', margin: '0 auto', maxWidth: '520px', lineHeight: 1.75 }}>{t('rev_sub')}</p>
      </div>

      {reviews === null ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontSize: '14px' }}>Loading…</div>
      ) : list.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontSize: '14px' }}>No reviews yet.</div>
      ) : (
        <div className="reviews-grid">
          {list.map((r, i) => (
            <div key={r.id} className={`reveal${i ? ` d${Math.min(i % 3, 3)}` : ''}`}
              style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '22px', position: 'relative', transition: 'border-color .25s,background .3s' }}>
              <div style={{ position: 'absolute', top: '10px', right: '16px', fontSize: '54px', fontWeight: 800, color: 'rgba(14,165,200,.1)', lineHeight: 1 }}>&quot;</div>
              <div style={{ color: 'var(--gold)', fontSize: '12px', letterSpacing: '1px', marginBottom: '10px' }}>{'★'.repeat(r.stars)}</div>
              <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '16px' }}>&quot;{r.text}&quot;</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0, background: r.avatarColor }}>{r.initials}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>{r.authorName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{r.authorRole}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
