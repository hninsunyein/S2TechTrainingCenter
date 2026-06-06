'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/types';
import { blogApi, getImageUrl } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

const LIMIT = 3;

function parseCatColor(raw: unknown): React.CSSProperties {
  if (!raw) return {};
  try { return typeof raw === 'string' ? JSON.parse(raw) : (raw as React.CSSProperties); } catch { return {}; }
}

function truncate(text: string, max = 110): { short: string; truncated: boolean } {
  if (text.length <= max) return { short: text, truncated: false };
  return { short: text.slice(0, max).trimEnd() + '…', truncated: true };
}

function PillBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 18px', borderRadius: '10px', border: '1px solid var(--border)',
        background: disabled ? 'var(--inp)' : 'var(--card)', color: disabled ? 'var(--text3)' : 'var(--text)',
        fontSize: '13px', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit', transition: 'all .2s',
      }}
    >
      {children}
    </button>
  );
}

export default function BlogSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const [posts, setPosts]           = useState<BlogPost[] | null>(null);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(false);

  function fetchPosts(p: number) {
    setLoading(true);
    blogApi.getAll(p, LIMIT)
      .then((res) => {
        setPosts(res.data);
        setTotalPages(res.totalPages);
        setTotal(res.total);
        setPage(p);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchPosts(1); }, []);

  useEffect(() => {
    if (!posts) return;
    const els = ref.current?.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.08 });
    els?.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [posts]);

  function goTo(p: number) {
    if (p < 1 || p > totalPages) return;
    fetchPosts(p);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <section ref={ref} id="blog" style={{ padding: '80px 5%', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', transition: 'background .3s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '10px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '12px' }}>
            <span style={{ width: '16px', height: '2px', background: 'var(--teal)', borderRadius: '2px', display: 'block' }} />
            {t('blog_tag')}
          </div>
          <h2 className="reveal d1" style={{ fontSize: 'clamp(26px,3.2vw,40px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.06, marginBottom: '12px', color: 'var(--text)' }}>{t('blog_title')}</h2>
          <p className="reveal d2" style={{ fontSize: '15px', color: 'var(--text2)', maxWidth: '520px', lineHeight: 1.75 }}>{t('blog_sub')}</p>
        </div>
        {total > 0 && (
          <div style={{ fontSize: '12px', color: 'var(--text3)', alignSelf: 'flex-end' }}>
            {total} post{total !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {posts === null || loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontSize: '14px' }}>Loading…</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontSize: '14px' }}>No posts yet.</div>
      ) : (
        <>
          <div className="blog-grid">
            {posts.map((p, i) => {
              const { short, truncated } = truncate(p.excerpt);
              const coverSrc = getImageUrl(p.imageUrl);
              return (
                <Link key={p.id} href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
                  <div className={`reveal${i ? ` d${Math.min(i, 3)}` : ''}`}
                    style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', overflow: 'hidden', cursor: 'pointer', transition: 'transform .3s,border-color .3s,background .3s', height: '100%', display: 'flex', flexDirection: 'column' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ''; }}>

                    {/* Cover */}
                    <div style={{ height: '160px', position: 'relative', overflow: 'hidden', background: coverSrc ? 'var(--bg3)' : p.thumb, flexShrink: 0 }}>
                      {coverSrc && <img src={coverSrc} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                      <span style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', letterSpacing: '.04em', textTransform: 'uppercase', ...parseCatColor(p.categoryColor) }}>
                        {p.category}
                      </span>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{p.date}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text3)' }}>· {p.readTime}</span>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-.4px', color: 'var(--text)', marginBottom: '8px', lineHeight: 1.35 }}>{p.title}</div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text2)', lineHeight: 1.65, marginBottom: '10px', flex: 1 }}>{short}</div>
                      {truncated && <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--teal)' }}>Read more →</span>}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: '#fff', background: p.avatarColor, flexShrink: 0 }}>
                          {p.authorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text2)' }}>{p.authorName}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '44px', flexWrap: 'wrap' }}>
              <PillBtn onClick={() => goTo(page - 1)} disabled={page === 1}>← Prev</PillBtn>

              {pageNumbers.map((n) => (
                <button
                  key={n}
                  onClick={() => goTo(n)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px', border: '1px solid',
                    borderColor: n === page ? 'var(--teal)' : 'var(--border)',
                    background: n === page ? 'var(--teal)' : 'var(--card)',
                    color: n === page ? '#fff' : 'var(--text2)',
                    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all .2s',
                  }}
                >
                  {n}
                </button>
              ))}

              <PillBtn onClick={() => goTo(page + 1)} disabled={page === totalPages}>Next →</PillBtn>
            </div>
          )}
        </>
      )}
    </section>
  );
}
