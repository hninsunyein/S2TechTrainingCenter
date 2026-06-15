'use client';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import type { Course } from '@/types';
import { enrollmentsApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  open: boolean;
  onClose: () => void;
  course: Course | null;
}

type PayMethod = 'kpay' | 'scb';

const RATE_MMK_PER_THB = 140;

function toThb(priceShort: string): string {
  const num = parseInt(priceShort.replace(/[^0-9]/g, ''), 10);
  if (isNaN(num)) return '—';
  return Math.round(num / RATE_MMK_PER_THB).toLocaleString() + ' ฿';
}

export default function PaymentModal({ open, onClose, course }: Props) {
  const { t } = useLanguage();
  const [method, setMethod] = useState<PayMethod>('kpay');
  const [name, setName]     = useState('');
  const [phone, setPhone]   = useState('');
  const [txRef, setTxRef]   = useState('');
  const [file, setFile]     = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const priceMMK  = course?.priceShort ?? '35,000 Ks';
  const priceTHB  = toThb(priceMMK);
  const displayPrice = method === 'scb' ? `${priceTHB} (≈ ${priceMMK})` : priceMMK;

  const handleClose = () => {
    setSuccess(false);
    setName(''); setPhone(''); setTxRef(''); setFile(null);
    setMethod('kpay');
    onClose();
  };

  const handleSubmit = async () => {
    if (!name.trim())  { toast.error('Please enter your full name.'); return; }
    if (!phone.trim()) { toast.error('Please enter your phone number.'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('fullName', name.trim());
      fd.append('phoneNumber', phone.trim());
      fd.append('paymentMethod', method);
      fd.append('courseName', course?.name ?? 'All Courses');
      if (course?.id) fd.append('courseId', course.id);
      fd.append('amount', method === 'scb' ? `${priceTHB} (${priceMMK})` : priceMMK);
      if (txRef.trim()) fd.append('transferRef', txRef.trim());
      if (file) fd.append('screenshot', file);
      await enrollmentsApi.submit(fd);
      setSuccess(true);
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: '100%', background: 'var(--inp)', border: '1px solid var(--border)',
    borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: 'var(--text)',
    fontFamily: 'inherit', outline: 'none',
  };
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text2)',
    textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '6px',
  };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      className="payment-modal-overlay"
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--overlay)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="payment-modal-inner"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--r2)', width: '100%', maxWidth: '460px', maxHeight: '92vh', overflowY: 'auto', transition: 'background .3s', animation: 'fadeUp .25s ease' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 1 }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-.4px', color: 'var(--text)' }}>{t('pay_title')}</div>
            <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>S2 Tech Training Center</div>
          </div>
          <button onClick={handleClose} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--inp)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', color: 'var(--text2)', fontFamily: 'inherit' }}>✕</button>
        </div>

        <div style={{ padding: '20px 24px 24px' }}>
          {success ? (
            /* ── Success state ── */
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>{t('pay_success_t')}</div>
              <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7, maxWidth: '300px', margin: '0 auto 8px' }}>
                {t('pay_success_b')}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '24px' }}>
                Admin မှ စစ်ဆေးပြီး 24 နာရီအတွင်း အကြောင်းပြန်ပါမည်။
              </p>
              <button onClick={handleClose} style={{ background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '12px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{t('pay_close')}</button>
            </div>
          ) : (
            <>
              {/* Order summary */}
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '14px 16px', marginBottom: '20px' }}>
                {[
                  [t('pay_course'), course?.name ?? 'All Courses'],
                  [t('pay_type'),   t('pay_full_acc')],
                  [t('pay_total'),  displayPrice],
                ].map(([k, v], i) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: i < 2 ? '6px' : 0, color: i < 2 ? 'var(--text2)' : 'var(--text)', fontWeight: i === 2 ? 700 : undefined, paddingTop: i === 2 ? '8px' : undefined, borderTop: i === 2 ? '1px solid var(--border)' : undefined }}>
                    <span>{k}</span>
                    <span style={i === 2 ? { color: 'var(--teal)' } : undefined}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Payment method — 2 options */}
              <div style={lbl}>{t('pay_choose_pm')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {([
                  { key: 'kpay' as PayMethod, logo: '/assets/img/kpay%20logo.png', name: 'KBZ Pay', sub: 'KPay QR Code' },
                  { key: 'scb'  as PayMethod, logo: '/assets/img/SCB%20logo.png',  name: 'Thai SCB Bank', sub: 'SCB QR Code' },
                ] as const).map((m) => (
                  <div key={m.key} onClick={() => setMethod(m.key)}
                    style={{ background: method === m.key ? 'rgba(14,165,200,.08)' : 'var(--inp)', border: method === m.key ? '2px solid var(--teal)' : '2px solid var(--border)', borderRadius: 'var(--r)', padding: '16px 12px', cursor: 'pointer', textAlign: 'center', transition: 'all .15s' }}>
                    <img src={m.logo} alt={m.name} style={{ width: '40px', height: '40px', objectFit: 'contain', display: 'block', margin: '0 auto 6px', borderRadius: '6px' }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: method === m.key ? 'var(--text)' : 'var(--text2)', display: 'block', marginBottom: '2px' }}>{m.name}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text3)' }}>{m.sub}</span>
                  </div>
                ))}
              </div>

              {/* KBZ Pay info */}
              {method === 'kpay' && (
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px', textAlign: 'center', marginBottom: '16px' }}>
                  <img src="/assets/img/kpay logo.png" alt="KBZ Pay logo" style={{ height: '32px', objectFit: 'contain', margin: '0 auto 12px', display: 'block' }} />
                  <img src="/assets/img/kpay.jpg" alt="KBZ Pay QR code" style={{ width: '160px', height: '160px', objectFit: 'contain', background: '#fff', borderRadius: '10px', margin: '0 auto 12px', display: 'block', border: '1px solid #eee', padding: '4px' }} />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>Hnin Su Nyein</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '4px' }}>KBZ Pay · 09444416781</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--teal)', marginTop: '8px' }}>{priceMMK}</div>
                </div>
              )}

              {/* SCB Bank info */}
              {method === 'scb' && (
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <img src="/assets/img/SCB logo.png" alt="SCB logo" style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '10px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>ธนาคารไทยพาณิชย์ (SCB)</div>
                      <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Siam Commercial Bank</div>
                    </div>
                  </div>
                  <img src="/assets/img/scb.jpg" alt="SCB QR code" style={{ width: '160px', height: '160px', objectFit: 'contain', background: '#fff', borderRadius: '10px', margin: '0 auto 14px', display: 'block', border: '1px solid #eee', padding: '4px' }} />
                  {[
                    ['Account Name', 'Hnin Su Nyein'],
                    ['Account No.', 'XXX-X-XXXXX-X'],
                    ['Amount (THB)', priceTHB],
                    ['Amount (MMK)', priceMMK],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text2)' }}>{label}</span>
                      <span style={{ fontWeight: 700, color: label.includes('Amount') ? 'var(--teal)' : 'var(--text)', fontFamily: label === 'Account No.' ? 'monospace' : 'inherit' }}>{value}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '8px', padding: '8px', background: 'var(--inp)', borderRadius: '8px' }}>
                    Rate: 1 THB ≈ {RATE_MMK_PER_THB} MMK
                  </div>
                </div>
              )}

              {/* Form fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={lbl}>{t('pay_name_lbl')}</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('pay_name_ph')} style={inp} />
                </div>
                <div>
                  <label style={lbl}>{t('pay_phone_lbl')}</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('pay_phone_ph')} style={inp} />
                </div>
                <div>
                  <label style={lbl}>{t('pay_ref_lbl')}</label>
                  <input value={txRef} onChange={(e) => setTxRef(e.target.value)} placeholder={method === 'scb' ? 'SCB transfer ref / slip number' : t('pay_ref_ph')} style={inp} />
                </div>
              </div>

              {/* Screenshot upload */}
              <div style={{ marginBottom: '16px' }}>
                <label style={lbl}>{t('pay_upload_lbl')}</label>
                <div onClick={() => fileRef.current?.click()}
                  style={{ border: '2px dashed var(--border2)', borderRadius: 'var(--r)', padding: '18px', textAlign: 'center', cursor: 'pointer', background: 'var(--inp)' }}>
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>📸</div>
                  <div style={{ fontSize: '13px', color: 'var(--text2)' }}>{file ? `✓ ${file.name}` : t('pay_upload_txt')}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>{t('pay_upload_sub')}</div>
                  <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </div>
              </div>

              <button onClick={handleSubmit} disabled={loading}
                style={{ width: '100%', background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>
                {loading ? t('pay_submitting') : t('pay_confirm')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
