'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/types';
import { blogApi, getImageUrl } from '@/lib/api';
import { FALLBACK_BLOG } from '@/lib/fallbackData';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

function parseCatColor(raw: unknown): React.CSSProperties {
  if (!raw) return {};
  try { return typeof raw === 'string' ? JSON.parse(raw) : (raw as React.CSSProperties); } catch { return {}; }
}

interface Props { slug: string; }

export default function BlogDetail({ slug }: Props) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    blogApi.getOne(slug)
      .then(setPost)
      .catch(() => {
        const fallback = FALLBACK_BLOG.find((p) => p.slug === slug);
        if (fallback) setPost(fallback);
        else setError(true);
      });
  }, [slug]);

  if (error) return (
    <>
      <Navbar />
      <main style={{ paddingTop: '60px', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text2)' }}>
          Post not found.{' '}
          <Link href="/#blog" style={{ color: 'var(--teal)' }}>Back to blog</Link>
        </div>
      </main>
      <Footer />
    </>
  );

  if (!post) return (
    <>
      <Navbar />
      <main style={{ paddingTop: '60px', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text3)', fontSize: '14px' }}>Loading…</div>
      </main>
      <Footer />
    </>
  );

  const coverSrc = getImageUrl(post.imageUrl);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '60px', background: 'var(--bg)', minHeight: '100vh' }}>

        {/* Cover image — full photo */}
        {coverSrc && (
          <div style={{ width: '100%', background: 'var(--bg3)', display: 'flex', justifyContent: 'center' }}>
            <img src={coverSrc} alt={post.title} style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '480px', objectFit: 'contain' }} />
          </div>
        )}
        {!coverSrc && (
          <div style={{ width: '100%', height: '180px', background: post.thumb }} />
        )}

        {/* Article */}
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 5% 80px' }}>

          {/* Back link */}
          <Link href="/#blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text2)', textDecoration: 'none', marginBottom: '28px' }}>
            ← Back to Blog
          </Link>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '.04em', ...parseCatColor(post.categoryColor) }}>
              {post.category}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text3)' }}>{post.date}</span>
            <span style={{ fontSize: '12px', color: 'var(--text3)' }}>· {post.readTime}</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, color: 'var(--text)', marginBottom: '20px' }}>
            {post.title}
          </h1>

          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: post.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {post.authorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{post.authorName}</div>
              <div style={{ fontSize: '11px', color: 'var(--text3)' }}>S2 Tech Training Center</div>
            </div>
          </div>

          {/* Excerpt */}
          <p style={{ fontSize: '17px', fontStyle: 'italic', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '28px', paddingLeft: '16px', borderLeft: '3px solid var(--teal)' }}>
            {post.excerpt}
          </p>

          {/* Full content */}
          {post.content ? (
            <div style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.85 }}>
              {post.content.split('\n').filter(Boolean).map((para, i) => (
                <p key={i} style={{ marginBottom: '20px' }}>{para}</p>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '14px', color: 'var(--text3)', fontStyle: 'italic' }}>
              Full content not available.
            </div>
          )}

          {/* Footer nav */}
          <div style={{ marginTop: '56px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <Link href="/#blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none' }}>
              ← All Posts
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
