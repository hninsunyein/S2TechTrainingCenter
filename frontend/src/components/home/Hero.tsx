'use client';
import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
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

  return (
    <section ref={ref} id="home"
      style={{ minHeight: '100vh', padding: '110px 5% 80px', alignItems: 'center', position: 'relative', overflow: 'hidden' }}
      className="hero-section">

      {/* Left column */}
      <div>
        <h1 className="reveal d1" style={{ fontSize: 'clamp(32px,4.5vw,58px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '8px' }}>
          <span style={{ color: 'var(--teal)' }}>{t('hero_h1a')}</span>{t('hero_h1b')}<br />{t('hero_h1c')}
        </h1>

        <p className="reveal d2" style={{ fontSize: '15px', fontStyle: 'italic', color: 'var(--gold)', marginBottom: '18px' }}>
          {t('hero_slogan')}
        </p>

        <p className="reveal" style={{ fontSize: '15px', color: 'var(--text2)', maxWidth: '440px', marginBottom: '10px', lineHeight: 1.75 }}>
          {t('hero_desc')}
        </p>
        <p className="reveal" style={{ fontSize: '14px', color: 'var(--teal)', maxWidth: '440px', marginBottom: '32px', lineHeight: 1.75, fontWeight: 600 }}>
          {t('hero_desc2')}
        </p>

        <div className="reveal d1" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '44px' }}>
          <a href="#courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', cursor: 'pointer', border: 'none', transition: 'all .2s' }}>
            {t('hero_btn1')}
          </a>
          <a href="#about" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text)', fontWeight: 700, fontSize: '14px', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', cursor: 'pointer', transition: 'all .2s' }}>
            {t('hero_btn2')}
          </a>
        </div>

        <div className="reveal d2 hero-stats-row" style={{ display: 'flex', gap: '36px', flexWrap: 'wrap' }}>
          {([['20', '+', 'hero_stat_s'], ['4', '', 'hero_stat_c'], ['3', '', 'hero_stat_t']] as [string,string,Parameters<typeof t>[0]][]).map(([num, suffix, key]) => (
            <div key={key}>
              <div style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-1.5px', color: 'var(--text)' }}>
                {num}<em style={{ color: 'var(--teal)', fontStyle: 'normal' }}>{suffix}</em>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{t(key)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — visual card */}
      <div style={{ position: 'relative', height: '460px', minWidth: 0 }} className="hero-vis">
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '275px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '20px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px' }}>
            {[['#ff5f57','mr'],['#febc2e','my'],['#28c840','mg']].map(([c, k]) => (
              <div key={k} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
            ))}
            <span style={{ marginLeft: '8px', fontSize: '10px', color: 'var(--text3)' }}>python_lesson.py · S2 Tech</span>
          </div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: '12.5px', lineHeight: 1.9 }}>
            <div><span className="cm"># S2 Tech — Bright the Future!</span></div>
            <div><span className="kw">def</span> <span className="fn">learn</span>(name, course):</div>
            <div>&nbsp;&nbsp;<span className="fn">print</span>(<span className="st">&quot;Hello &#123;name&#125;!&quot;</span>)</div>
            <div>&nbsp;&nbsp;<span className="kw">return</span> <span className="st">&quot;Bright Future&quot;</span></div>
            <div>&nbsp;</div>
            <div>learn(<span className="st">&quot;Lily&quot;</span>, <span className="st">&quot;Python&quot;</span>)</div>
            <div><span className="cm"># Hello Lily!</span></div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '-10px', left: 0, width: '158px', background: 'linear-gradient(135deg,#0284a8,#0c4a6e)', borderRadius: 'var(--r2)', padding: '14px 16px' }}>
          <b style={{ fontSize: '13px', color: '#fff', display: 'block', marginBottom: '2px' }}>Scratch Coding</b>
          <small style={{ fontSize: '10px', color: 'rgba(255,255,255,.6)' }}>Level 1 &amp; Level 2</small>
        </div>
        <div style={{ position: 'absolute', bottom: '-10px', right: 0, width: '158px', background: 'linear-gradient(135deg,#d97706,#92400e)', borderRadius: 'var(--r2)', padding: '14px 16px' }}>
          <b style={{ fontSize: '13px', color: '#fff', display: 'block', marginBottom: '2px' }}>EVC English</b>
          <small style={{ fontSize: '10px', color: 'rgba(255,255,255,.6)' }}>Vocabulary Class</small>
        </div>
        <div style={{ position: 'absolute', top: '10px', right: 0, padding: '6px 14px', borderRadius: '100px', background: 'rgba(244,114,182,.1)', border: '1px solid rgba(244,114,182,.3)', fontSize: '11px', fontWeight: 700, color: 'var(--pink)' }}>
          Age 5–14
        </div>
      </div>
    </section>
  );
}
