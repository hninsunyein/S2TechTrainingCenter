'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Course, CourseStat, Lesson } from '@/types';
import { coursesApi, getImageUrl } from '@/lib/api';
import { FALLBACK_COURSES } from '@/lib/fallbackData';
import PaymentModal from '@/components/ui/PaymentModal';
import VideoModal from '@/components/ui/VideoModal';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props { slug: string; }

function safeArray<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : [];
}

export default function CourseDetail({ slug }: Props) {
  const { t } = useLanguage();
  const [course, setCourse] = useState<Course | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [videoLesson, setVideoLesson] = useState<{ title: string; videoUrl: string } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    setCourse(null);
    coursesApi.getOne(slug)
      .then((data) => setCourse(data))
      .catch(() => {
        const fallback = FALLBACK_COURSES.find((c) => c.slug === slug || c.id === slug);
        if (fallback) setCourse(fallback);
        else setError(true);
      });
  }, [slug]);

  if (error) return (
    <div style={{ padding: '100px 5%', textAlign: 'center', color: 'var(--text2)' }}>
      Course not found.{' '}
      <Link href="/#courses" style={{ color: 'var(--teal)' }}>Go back</Link>
    </div>
  );

  if (!course) return (
    <div style={{ padding: '100px 5%', textAlign: 'center', color: 'var(--text2)' }}>
      Loading...
    </div>
  );

  const teacher    = course.teacher;
  const tags       = safeArray<string>(course.tags);
  const stats      = safeArray<CourseStat>(course.stats);
  const lessons    = safeArray<Lesson>(course.lessons);
  const aboutPoints = safeArray<string>(course.aboutPoints);

  return (
    <>
      {/* ── Full-width thumbnail banner ── */}
      <div style={{ position: 'relative', width: '100%', height: '420px', overflow: 'hidden', background: course.thumb }}>
        {course.imageUrl ? (
          <img
            src={getImageUrl(course.imageUrl)!}
            alt={course.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <>
            {/* Decorative blurred orbs */}
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: course.color, opacity: .18, filter: 'blur(60px)' }} />
            <div style={{ position: 'absolute', bottom: '-80px', left: '-40px', width: '280px', height: '280px', borderRadius: '50%', background: course.color, opacity: .12, filter: 'blur(50px)' }} />
            {/* Grid pattern overlay */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            {/* Center content */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
              <div style={{ fontSize: '90px', lineHeight: 1, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,.4))' }}>{course.emoji}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-.5px', textShadow: '0 2px 16px rgba(0,0,0,.5)' }}>{course.name}</div>
              <div style={{ fontSize: '11px', fontWeight: 700, padding: '5px 14px', borderRadius: '100px', background: course.badgeColor, color: course.badgeText, border: '1px solid rgba(255,255,255,.18)', letterSpacing: '.04em' }}>
                {course.badge}
              </div>
            </div>
          </>
        )}
        {/* Bottom fade into page background */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, var(--bg), transparent)' }} />
        {/* Back link overlay */}
        <Link href="/#courses" style={{ position: 'absolute', top: '20px', left: '5%', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,.85)', textDecoration: 'none', background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '100px', border: '1px solid rgba(255,255,255,.15)' }}>
          {t('cd_back')}
        </Link>
        {/* Category badge overlay */}
        <div style={{ position: 'absolute', top: '20px', right: '5%', fontSize: '10px', fontWeight: 700, padding: '5px 13px', borderRadius: '100px', background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', textTransform: 'uppercase', letterSpacing: '.08em' }}>
          {course.category}
        </div>
      </div>

      {/* ── Hero grid ── */}
      <div style={{ padding: '36px 5% 50px', position: 'relative', overflow: 'hidden' }}
        className="detail-hero">

        {/* Left column */}
        <div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, marginBottom: '12px', color: 'var(--text)' }}>
            {course.name}
          </h1>

          <p style={{ fontSize: '15px', color: 'var(--text2)', maxWidth: '500px', lineHeight: 1.75, marginBottom: '20px' }}>
            {course.description}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {tags.map((tag, i) => (
              <span key={i} style={{ fontSize: '11px', fontWeight: 600, padding: '5px 12px', borderRadius: '100px', background: 'var(--inp)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Stats bar */}
          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', padding: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-1px', color: 'var(--text)' }}>{s.n}</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — enroll card */}
        <div className="enroll-sticky"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '24px', transition: 'background .3s' }}>

          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green)', marginBottom: '4px' }}>
            {t('cd_free_preview')}
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-1px', color: 'var(--text)', marginBottom: '4px' }}>
            {course.price}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '16px' }}>
            {t('cd_full_access')}
          </div>

          <button
            onClick={() => setPaymentOpen(true)}
            style={{ width: '100%', background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s', marginBottom: '10px', display: 'block', textAlign: 'center' }}>
            {t('cd_enroll_btn')}
          </button>

          <div style={{ fontSize: '11px', color: 'var(--text3)', textAlign: 'center', lineHeight: 1.6, marginBottom: '18px' }}>
            {t('cd_contact')}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '10px' }}>
              {t('cd_included')}
            </div>
            {(['cd_inc_1', 'cd_inc_2', 'cd_inc_3', 'cd_inc_4', 'cd_inc_5'] as const).map((key) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text2)', marginBottom: '7px' }}>
                <span style={{ color: 'var(--green)', fontSize: '13px', flexShrink: 0 }}>✓</span>
                {t(key)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Lessons list ── */}
      <div style={{ padding: '0 5% 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-.5px', color: 'var(--text)' }}>
            {t('cd_lessons_hd')}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
            <span style={{ color: 'var(--green)', fontWeight: 700 }}>{t('cd_lessons_sub1')}</span>
            {' '}FREE ·{' '}
            <span style={{ color: 'var(--green)', fontWeight: 700 }}>{t('cd_lessons_sub2')}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {lessons.map((lesson, i) => {
            const isFree   = lesson.isFree;
            const title    = lesson.title;
            const duration = lesson.duration;
            return (
              <div key={i}
                onClick={() => {
                  if (isFree && lesson.videoUrl) setVideoLesson({ title, videoUrl: lesson.videoUrl });
                  else if (!isFree) setPaymentOpen(true);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r)', transition: 'all .2s', cursor: (isFree && lesson.videoUrl) || !isFree ? 'pointer' : 'default', opacity: 1 }}>

                {/* Number bubble */}
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0, background: isFree ? 'rgba(34,197,94,.12)' : 'var(--inp)', border: isFree ? '1px solid rgba(34,197,94,.3)' : '1px solid var(--border)', color: isFree ? 'var(--green)' : 'var(--text2)' }}>
                  {i + 1}
                </div>

                {/* Title + subtitle */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                    {course.name} · Lesson {i + 1}
                  </div>
                </div>

                {/* Duration + badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{duration}</span>
                  {isFree ? (
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '100px', background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.28)', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {lesson.videoUrl ? '▶ Watch' : t('cd_free_badge')}
                    </span>
                  ) : (
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '100px', background: 'rgba(14,165,200,.1)', border: '1px solid rgba(14,165,200,.28)', color: 'var(--teal)', cursor: 'pointer' }}>
                      {t('cd_unlock')} →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── What you learn + Teacher ── */}
      <div style={{ padding: '0 5% 80px' }} className="course-about">
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-.4px', marginBottom: '14px', color: 'var(--text)' }}>
            {t('cd_what_learn')}
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {aboutPoints.map((point, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: 'var(--text2)', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--green)', flexShrink: 0, fontSize: '14px', marginTop: '1px' }}>✓</span>
                {String(point)}
              </li>
            ))}
          </ul>
        </div>

        {teacher && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '20px', transition: 'background .3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, color: '#fff', flexShrink: 0, background: teacher.color ?? 'var(--teal)' }}>
                {teacher.initials}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>{teacher.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--teal)' }}>{teacher.role}</div>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7 }}>{teacher.bio}</div>
          </div>
        )}
      </div>

      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} course={course} />
      {videoLesson && (
        <VideoModal
          title={videoLesson.title}
          videoUrl={videoLesson.videoUrl}
          onClose={() => setVideoLesson(null)}
        />
      )}
    </>
  );
}
