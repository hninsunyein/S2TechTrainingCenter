'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authApi, enrollmentsApi, coursesApi, reviewsApi, blogApi, teachersApi, studentsApi, getImageUrl } from '@/lib/api';
import CourseFormModal from './CourseFormModal';
import ReviewFormModal from './ReviewFormModal';
import BlogFormModal from './BlogFormModal';
import TeacherFormModal from './TeacherFormModal';
import StudentWorkFormModal from './StudentWorkFormModal';
import type { Course, Review, BlogPost, Teacher, Student } from '@/types';

type Tab = 'enrollments' | 'courses' | 'reviews' | 'blog' | 'teachers' | 'students';

interface Enrollment {
  id: string; fullName: string; phoneNumber: string;
  courseName: string; amount: string; paymentMethod: string;
  status: string; createdAt: string;
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'rgba(245,158,11,.15)', verified: 'rgba(34,197,94,.15)', rejected: 'rgba(239,68,68,.15)',
};
const STATUS_TEXT: Record<string, string> = {
  pending: '#f59e0b', verified: '#22c55e', rejected: '#ef4444',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab]               = useState<Tab>('enrollments');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses]       = useState<Course[]>([]);
  const [reviews, setReviews]       = useState<Review[]>([]);
  const [blog, setBlog]             = useState<BlogPost[]>([]);
  const [teachers, setTeachers]     = useState<Teacher[]>([]);
  const [loading, setLoading]       = useState(true);

  const [studentWorks, setStudentWorks] = useState<Student[]>([]);
  const [courseModal, setCourseModal]   = useState<{ open: boolean; course: Course | null }>({ open: false, course: null });
  const [studentModal, setStudentModal] = useState<{ open: boolean; student: Student | null }>({ open: false, student: null });
  const [reviewModal, setReviewModal]   = useState<{ open: boolean; review: Review | null }>({ open: false, review: null });
  const [blogModal, setBlogModal]       = useState<{ open: boolean; post: BlogPost | null }>({ open: false, post: null });
  const [teacherModal, setTeacherModal] = useState<{ open: boolean; teacher: Teacher | null }>({ open: false, teacher: null });

  useEffect(() => {
    const token = Cookies.get('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    authApi.me().catch(() => { router.push('/admin/login'); });
    loadData();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [e, c, r, b, t, sw] = await Promise.all([
        enrollmentsApi.getAll(),
        coursesApi.getAll(),
        reviewsApi.getAll(),
        blogApi.getAll(1, 1000),
        teachersApi.getAll(),
        studentsApi.getAll(),
      ]);
      setEnrollments(e);
      setCourses(c);
      setReviews(r);
      setBlog(b.data ?? b);
      setTeachers(t);
      setStudentWorks(sw);
    } catch {}
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await enrollmentsApi.updateStatus(id, status);
    setEnrollments((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
  };

  const logout = () => { Cookies.remove('admin_token'); router.push('/admin/login'); };

  const cell: React.CSSProperties = { padding: '14px 16px', fontSize: '13px', color: 'var(--text2)', borderBottom: '1px solid var(--border)' };
  const th: React.CSSProperties   = { padding: '10px 16px', fontSize: '11px', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.07em', borderBottom: '1px solid var(--border)', textAlign: 'left' };

  const TAB_DEFS: { key: Tab; label: string; count?: number }[] = [
    { key: 'enrollments', label: 'Enrollments', count: enrollments.length },
    { key: 'courses',     label: 'Courses',     count: courses.length },
    { key: 'reviews',     label: 'Reviews',     count: reviews.length },
    { key: 'blog',        label: 'Blog',        count: blog.length },
    { key: 'teachers',    label: 'Teachers',    count: teachers.length },
    { key: 'students',    label: 'Student Work',count: studentWorks.length },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '0 5%', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px', color: 'var(--teal)' }}>S2</div>
          <span style={{ fontWeight: 700, color: 'var(--text)' }}>Admin Dashboard</span>
        </div>
        <button onClick={logout} style={{ background: 'var(--inp)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>Logout</button>
      </div>

      <div style={{ padding: '32px 5%' }}>
        {/* Stats */}
        <div className="admin-stats">
          {[
            { label: 'Total Enrollments', value: enrollments.length,                                           color: 'var(--teal)' },
            { label: 'Pending Review',    value: enrollments.filter((e) => e.status === 'pending').length,     color: 'var(--gold)' },
            { label: 'Verified',          value: enrollments.filter((e) => e.status === 'verified').length,    color: 'var(--green)' },
          ].map((s) => (
            <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '24px' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: s.color, letterSpacing: '-1px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {TAB_DEFS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: tab === t.key ? '1px solid var(--teal)' : '1px solid var(--border)', background: tab === t.key ? 'rgba(14,165,200,.1)' : 'transparent', color: tab === t.key ? 'var(--teal)' : 'var(--text2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {t.label}
              {t.count !== undefined && <span style={{ fontSize: '11px', fontWeight: 700, background: tab === t.key ? 'var(--teal)' : 'var(--inp)', color: tab === t.key ? '#fff' : 'var(--text3)', borderRadius: '100px', padding: '1px 7px' }}>{t.count}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text2)' }}>Loading…</div>
        ) : (
          <div className="admin-table-wrap" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', overflow: 'hidden' }}>

            {/* ── ENROLLMENTS ── */}
            {tab === 'enrollments' && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Name','Phone','Course','Amount','Method','Date','Status','Actions'].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {enrollments.map((e) => (
                    <tr key={e.id}>
                      <td style={{ ...cell, fontWeight: 600, color: 'var(--text)' }}>{e.fullName}</td>
                      <td style={cell}>{e.phoneNumber}</td>
                      <td style={cell}>{e.courseName}</td>
                      <td style={{ ...cell, color: 'var(--teal)', fontWeight: 700 }}>{e.amount}</td>
                      <td style={cell}>{e.paymentMethod.toUpperCase()}</td>
                      <td style={cell}>{new Date(e.createdAt).toLocaleDateString('en-US')}</td>
                      <td style={cell}>
                        <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, background: STATUS_COLOR[e.status] ?? 'var(--inp)', color: STATUS_TEXT[e.status] ?? 'var(--text2)', textTransform: 'capitalize' }}>{e.status}</span>
                      </td>
                      <td style={cell}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => updateStatus(e.id, 'verified')} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: 'rgba(34,197,94,.15)', color: 'var(--green)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Verify</button>
                          <button onClick={() => updateStatus(e.id, 'rejected')} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: 'rgba(239,68,68,.1)', color: '#ef4444', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {enrollments.length === 0 && <tr><td colSpan={8} style={{ ...cell, textAlign: 'center', padding: '40px' }}>No enrollments yet</td></tr>}
                </tbody>
              </table>
            )}

            {/* ── COURSES ── */}
            {tab === 'courses' && (
              <>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{courses.length} course{courses.length !== 1 ? 's' : ''}</span>
                  <button onClick={() => setCourseModal({ open: true, course: null })} style={{ background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Course</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['','Name','Category','Price','Teacher','Actions'].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {courses.map((c) => (
                      <tr key={c.id}>
                        <td style={{ ...cell, width: '48px' }}>
                          {c.imageUrl
                            ? <img src={getImageUrl(c.imageUrl)!} alt="" style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', display: 'block' }} />
                            : <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: c.thumb, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{c.emoji}</div>
                          }
                        </td>
                        <td style={{ ...cell, fontWeight: 600, color: 'var(--text)' }}>{c.name}<div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>{c.tagline}</div></td>
                        <td style={cell}>{c.category}</td>
                        <td style={{ ...cell, color: 'var(--teal)', fontWeight: 700 }}>{c.priceShort}</td>
                        <td style={cell}>{(c as any).teacher?.name ?? '—'}</td>
                        <td style={cell}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <a href={`/courses/${c.slug}`} target="_blank" style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: 'rgba(14,165,200,.1)', color: 'var(--teal)', textDecoration: 'none', fontWeight: 600 }}>View</a>
                            <button onClick={() => setCourseModal({ open: true, course: c })} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: 'rgba(167,139,250,.1)', color: 'var(--purple)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Edit</button>
                            <button onClick={async () => { if (!confirm(`Delete "${c.name}"?`)) return; await coursesApi.delete(c.id); loadData(); }} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: 'rgba(239,68,68,.1)', color: '#ef4444', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {courses.length === 0 && <tr><td colSpan={6} style={{ ...cell, textAlign: 'center', padding: '40px' }}>No courses yet — click "+ Add Course"</td></tr>}
                  </tbody>
                </table>
              </>
            )}

            {/* ── REVIEWS ── */}
            {tab === 'reviews' && (
              <>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                  <button onClick={() => setReviewModal({ open: true, review: null })} style={{ background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Review</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Author','Stars','Review','Role','Actions'].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {reviews.map((r) => (
                      <tr key={r.id}>
                        <td style={{ ...cell, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: r.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{r.initials}</div>
                            {r.authorName}
                          </div>
                        </td>
                        <td style={{ ...cell, color: 'var(--gold)' }}>{'★'.repeat(r.stars)}</td>
                        <td style={{ ...cell, maxWidth: '280px' }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{r.text}"</div></td>
                        <td style={{ ...cell, fontSize: '11px', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{r.authorRole}</td>
                        <td style={cell}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => setReviewModal({ open: true, review: r })} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: 'rgba(167,139,250,.1)', color: 'var(--purple)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Edit</button>
                            <button onClick={async () => { if (!confirm('Delete this review?')) return; await reviewsApi.delete(r.id); loadData(); }} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: 'rgba(239,68,68,.1)', color: '#ef4444', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {reviews.length === 0 && <tr><td colSpan={5} style={{ ...cell, textAlign: 'center', padding: '40px' }}>No reviews yet — click "+ Add Review"</td></tr>}
                  </tbody>
                </table>
              </>
            )}

            {/* ── BLOG ── */}
            {tab === 'blog' && (
              <>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{blog.length} post{blog.length !== 1 ? 's' : ''}</span>
                  <button onClick={() => setBlogModal({ open: true, post: null })} style={{ background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>+ New Post</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Cover','Title','Category','Author','Date','Actions'].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {blog.map((p) => (
                      <tr key={p.id}>
                        <td style={{ ...cell, width: '52px' }}>
                          {p.imageUrl
                            ? <img src={getImageUrl(p.imageUrl)!} alt="" style={{ width: '42px', height: '32px', borderRadius: '6px', objectFit: 'cover', display: 'block' }} />
                            : <div style={{ width: '42px', height: '32px', borderRadius: '6px', background: p.thumb }} />
                          }
                        </td>
                        <td style={{ ...cell, fontWeight: 600, color: 'var(--text)' }}>
                          {p.title}
                          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '260px' }}>{p.excerpt}</div>
                        </td>
                        <td style={cell}><span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: 'var(--inp)', color: 'var(--text2)' }}>{p.category}</span></td>
                        <td style={{ ...cell, whiteSpace: 'nowrap' }}>{p.authorName}</td>
                        <td style={{ ...cell, whiteSpace: 'nowrap', fontSize: '12px' }}>{p.date}</td>
                        <td style={cell}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => setBlogModal({ open: true, post: p })} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: 'rgba(167,139,250,.1)', color: 'var(--purple)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Edit</button>
                            <button onClick={async () => { if (!confirm(`Delete "${p.title}"?`)) return; await blogApi.delete(p.id); loadData(); }} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: 'rgba(239,68,68,.1)', color: '#ef4444', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {blog.length === 0 && <tr><td colSpan={6} style={{ ...cell, textAlign: 'center', padding: '40px' }}>No posts yet — click "+ New Post"</td></tr>}
                  </tbody>
                </table>
              </>
            )}

            {/* ── TEACHERS ── */}
            {tab === 'teachers' && (
              <>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{teachers.length} teacher{teachers.length !== 1 ? 's' : ''}</span>
                  <button onClick={() => setTeacherModal({ open: true, teacher: null })} style={{ background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Teacher</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Profile','Name','Role','Students','Rating','Actions'].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {teachers.map((t) => (
                      <tr key={t.id}>
                        <td style={{ ...cell, width: '52px' }}>
                          {t.imageUrl
                            ? <img src={getImageUrl(t.imageUrl)!} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                            : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff' }}>{t.initials}</div>
                          }
                        </td>
                        <td style={{ ...cell, fontWeight: 600, color: 'var(--text)' }}>{t.name}</td>
                        <td style={{ ...cell, color: 'var(--text2)', fontSize: '12px' }}>{t.role}</td>
                        <td style={{ ...cell, color: 'var(--teal)', fontWeight: 700 }}>{t.students}</td>
                        <td style={{ ...cell, color: 'var(--gold)', fontWeight: 700 }}>★ {t.rating}</td>
                        <td style={cell}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => setTeacherModal({ open: true, teacher: t })} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: 'rgba(167,139,250,.1)', color: 'var(--purple)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Edit</button>
                            <button onClick={async () => { if (!confirm(`Delete "${t.name}"?`)) return; await teachersApi.delete(t.id); loadData(); }} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: 'rgba(239,68,68,.1)', color: '#ef4444', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {teachers.length === 0 && <tr><td colSpan={6} style={{ ...cell, textAlign: 'center', padding: '40px' }}>No teachers yet — click "+ Add Teacher"</td></tr>}
                  </tbody>
                </table>
              </>
            )}

            {/* ── STUDENT WORK ── */}
            {tab === 'students' && (
              <>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{studentWorks.length} project{studentWorks.length !== 1 ? 's' : ''}</span>
                  <button onClick={() => setStudentModal({ open: true, student: null })} style={{ background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Project</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>{['Image','Project','Type','Student','Class','Actions'].map((h) => <th key={h} style={th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {studentWorks.map((s) => (
                      <tr key={s.id}>
                        <td style={{ ...cell, width: '60px' }}>
                          {s.imageUrl
                            ? <img src={getImageUrl(s.imageUrl)!} alt="" style={{ width: '50px', height: '40px', borderRadius: '8px', objectFit: 'cover', display: 'block' }} />
                            : <div style={{ width: '50px', height: '40px', borderRadius: '8px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{s.emoji}</div>
                          }
                        </td>
                        <td style={{ ...cell, fontWeight: 600, color: 'var(--text)' }}>{s.project}</td>
                        <td style={cell}>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: 'var(--inp)', color: 'var(--text2)', textTransform: 'capitalize' }}>{s.category}</span>
                        </td>
                        <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: s.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{s.initials}</div>
                            {s.name}
                          </div>
                        </td>
                        <td style={{ ...cell, fontSize: '12px', color: 'var(--text3)' }}>{s.className}</td>
                        <td style={cell}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => setStudentModal({ open: true, student: s })} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: 'rgba(167,139,250,.1)', color: 'var(--purple)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Edit</button>
                            <button onClick={async () => { if (!confirm(`Delete "${s.project}"?`)) return; await studentsApi.delete(s.id); loadData(); }} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: 'rgba(239,68,68,.1)', color: '#ef4444', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {studentWorks.length === 0 && <tr><td colSpan={6} style={{ ...cell, textAlign: 'center', padding: '40px' }}>No student projects yet — click "+ Add Project"</td></tr>}
                  </tbody>
                </table>
              </>
            )}

          </div>
        )}
      </div>

      {courseModal.open  && <CourseFormModal  course={courseModal.course}   onClose={() => setCourseModal({ open: false, course: null })}   onSaved={() => { setCourseModal({ open: false, course: null });   loadData(); }} />}
      {reviewModal.open  && <ReviewFormModal  review={reviewModal.review}   onClose={() => setReviewModal({ open: false, review: null })}   onSaved={() => { setReviewModal({ open: false, review: null });   loadData(); }} />}
      {blogModal.open    && <BlogFormModal    post={blogModal.post}         onClose={() => setBlogModal({ open: false, post: null })}       onSaved={() => { setBlogModal({ open: false, post: null });       loadData(); }} />}
      {teacherModal.open  && <TeacherFormModal teacher={teacherModal.teacher} onClose={() => setTeacherModal({ open: false, teacher: null })} onSaved={() => { setTeacherModal({ open: false, teacher: null }); loadData(); }} />}
      {studentModal.open  && <StudentWorkFormModal student={studentModal.student} onClose={() => setStudentModal({ open: false, student: null })} onSaved={() => { setStudentModal({ open: false, student: null }); loadData(); }} />}
    </div>
  );
}
