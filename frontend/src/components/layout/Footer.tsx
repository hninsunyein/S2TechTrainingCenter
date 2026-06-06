'use client';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const COURSES = [
    { label: 'Scratch Level I',  slug: 'scratch-level-i'  },
    { label: 'Scratch Level II', slug: 'scratch-level-ii' },
    { label: 'Python Basic',     slug: 'python-basic'     },
    { label: 'EVC Class',        slug: 'evc-class'        },
  ];

  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '44px 5% 24px', transition: 'background .3s' }}>
      <div className="footer-grid">
        {/* Brand */}
        <div>
          <div style={{ marginBottom: '8px' }}>
            <strong style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', display: 'block', lineHeight: 1.1 }}>S2 Tech Training Center</strong>
            <span style={{ fontSize: '10px', color: 'var(--text2)' }}>Study Smart</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.75, maxWidth: '220px', margin: '10px 0 16px' }}>{t('ft_desc')}</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['📘','📷','💬'].map((icon, i) => (
              <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--inp)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', cursor: 'pointer' }}>{icon}</div>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '12px' }}>{t('ft_courses')}</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {COURSES.map((c) => (
              <li key={c.slug}><Link href={`/courses/${c.slug}`} style={{ fontSize: '13px', color: 'var(--text3)', textDecoration: 'none' }}>{c.label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Navigate */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '12px' }}>{t('ft_nav')}</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
            <li><a href="/#about"    style={{ fontSize: '13px', color: 'var(--text3)', textDecoration: 'none' }}>{t('ft_about')}</a></li>
            <li><a href="/#students" style={{ fontSize: '13px', color: 'var(--text3)', textDecoration: 'none' }}>{t('ft_sw')}</a></li>
            <li><a href="/#blog"     style={{ fontSize: '13px', color: 'var(--text3)', textDecoration: 'none' }}>{t('ft_blog')}</a></li>
            <li><a href="/#team"     style={{ fontSize: '13px', color: 'var(--text3)', textDecoration: 'none' }}>{t('ft_team')}</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '12px' }}>{t('ft_contact')}</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
            <li style={{ fontSize: '13px', color: 'var(--text3)' }}>📞 09-795350009</li>
            <li style={{ fontSize: '13px', color: 'var(--text3)' }}>📘 S2 Tech Training Center</li>
            <li><a href="/#courses" style={{ fontSize: '13px', color: 'var(--teal)', textDecoration: 'none', fontWeight: 600 }}>{t('ft_enroll')}</a></li>
          </ul>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{t('ft_copy')}</div>
        <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{t('ft_made')}</div>
      </div>
    </footer>
  );
}
