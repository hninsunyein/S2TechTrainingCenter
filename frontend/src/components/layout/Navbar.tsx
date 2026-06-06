'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TKey } from '@/lib/translations';

const NAV_LINK_DEFS: { key: TKey; href: string }[] = [
  { key: 'nav_about',    href: '/#about' },
  { key: 'nav_courses',  href: '/#courses' },
  { key: 'nav_students', href: '/#students' },
  { key: 'nav_reviews',  href: '/#reviews' },
  { key: 'nav_blog',     href: '/#blog' },
  { key: 'nav_team',     href: '/#team' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('s2-user');
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 800,
        height: '60px', padding: '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,.08)' : 'none',
        transition: 'box-shadow .3s',
        ['--text' as string]: '#1f2937',
        ['--text2' as string]: '#6b7280',
        ['--text3' as string]: '#9ca3af',
        ['--border' as string]: '#e5e7eb',
        ['--inp' as string]: 'rgba(0,0,0,0.05)',
      } as React.CSSProperties}>
        {/* Logo */}
        <Link href="/" onClick={closeMenu}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <img src="/logo.png" alt="S2 Tech" style={{ height: '52px', width: 'auto', display: 'block', flexShrink: 0 }} />
          <div>
            <strong style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text)', display: 'block', lineHeight: 1.1 }}>
              S2 Tech Training Center
            </strong>
           
           
          </div>
        </Link>

        {/* Desktop nav links */}
        <ul className="nav-desktop-links" style={{ display: 'flex', gap: '6px', listStyle: 'none', flex: 1, justifyContent: 'center' }}>
          {NAV_LINK_DEFS.map((link) => (
            <li key={link.href}>
              <a href={link.href} style={{
                fontSize: '12px', fontWeight: 500, color: 'var(--text2)',
                textDecoration: 'none', padding: '5px 10px', borderRadius: '8px',
                transition: 'all .2s', cursor: 'pointer', display: 'block',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--teal)'; e.currentTarget.style.background = 'rgba(14,165,200,.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'transparent'; }}
              >{t(link.key)}</a>
            </li>
          ))}
        </ul>

        {/* Desktop right controls */}
        <div className="nav-desktop-right" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <Pill onClick={toggleLanguage}><span>🌐</span><span className="pill-label"> {language}</span></Pill>
          <Pill onClick={toggleTheme}><span>{theme === 'dark' ? '🌙' : '☀️'}</span><span className="pill-label"> {theme === 'dark' ? t('nav_dark') : t('nav_light')}</span></Pill>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </span>
              <button onClick={() => { localStorage.removeItem('s2-user'); localStorage.removeItem('s2-user-token'); setUser(null); }}
                style={{ fontSize: '11px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 6px' }}>
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" style={{
              background: 'var(--teal)', color: '#fff', fontSize: '13px', fontWeight: 700,
              padding: '8px 18px', borderRadius: '10px', textDecoration: 'none', whiteSpace: 'nowrap',
              transition: 'all .2s', display: 'inline-block',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--teal2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--teal)'; e.currentTarget.style.transform = 'none'; }}
            >
              Login
            </Link>
          )}
        </div>

        {/* Hamburger (mobile only) */}
        <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_LINK_DEFS.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>{t(link.key)}</a>
        ))}
        <div className="mobile-divider" />
        <div className="mobile-row">
          <button onClick={() => { toggleLanguage(); }} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '10px', background: 'var(--inp)', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit' }}>
            🌐 {language}
          </button>
          <button onClick={() => { toggleTheme(); }} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '10px', background: 'var(--inp)', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit' }}>
            {theme === 'dark' ? '🌙' : '☀️'} {theme === 'dark' ? t('nav_dark') : t('nav_light')}
          </button>
        </div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: 'rgba(14,165,200,.08)', border: '1px solid rgba(14,165,200,.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>{user.name}</span>
            </div>
            <button onClick={() => { localStorage.removeItem('s2-user'); localStorage.removeItem('s2-user-token'); setUser(null); closeMenu(); }}
              style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="mobile-enroll" onClick={closeMenu} style={{ textDecoration: 'none', textAlign: 'center' }}>
            Login →
          </Link>
        )}
      </div>

    </>
  );
}

function Pill({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '4px',
      background: 'var(--inp)', border: '1px solid var(--border)',
      borderRadius: '100px', padding: '5px 12px', fontSize: '12px',
      fontWeight: 600, color: 'var(--text2)', cursor: 'pointer',
      transition: 'all .2s', whiteSpace: 'nowrap', userSelect: 'none', fontFamily: 'inherit',
    }}>
      {children}
    </button>
  );
}
