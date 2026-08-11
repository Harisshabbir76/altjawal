'use client';

import { useState, useEffect } from 'react';
import ClockPicker from './ClockPicker';
import '../../styles/book/bookingsection.css';
import { useLang } from '../../lib/LanguageContext';

const today = new Date().toISOString().split('T')[0];

type Lang = 'en' | 'ar';

type OffDay = {
  _id: string;
  date: string;
  fullDay: boolean;
  startTime: string;
  endTime: string;
};

const T = {
  heading:        { en: 'Book Your Experience',   ar: 'احجز تجربتك' },
  subheading:     { en: 'Fill in the details below and our team will confirm your booking shortly.', ar: 'أدخل التفاصيل أدناه وسيؤكد فريقنا حجزك قريباً.' },
  labelFirst:     { en: 'First Name',             ar: 'الاسم الأول' },
  labelLast:      { en: 'Last Name',              ar: 'اسم العائلة' },
  labelEmail:     { en: 'Email Address',          ar: 'عنوان البريد الإلكتروني' },
  labelPhone:     { en: 'Contact No.',            ar: 'رقم التواصل' },
  labelService:   { en: 'Service',                ar: 'الخدمة' },
  labelDate:      { en: 'Date',                   ar: 'التاريخ' },
  labelTime:      { en: 'Time',                   ar: 'الوقت' },
  labelNotes:     { en: 'Additional Notes',       ar: 'ملاحظات إضافية' },
  phFirst:        { en: 'Your First Name',        ar: 'اسمك الأول' },
  phLast:         { en: 'Your Last Name',         ar: 'اسم عائلتك' },
  phPhone:        { en: 'Your Phone Number',      ar: 'رقم هاتفك' },
  phService:      { en: 'Select Service',         ar: 'اختر الخدمة' },
  phNotes:        { en: 'Optional — anything we should know', ar: 'اختياري — أي شيء يجب أن نعرفه' },
  svcCorp:        { en: 'Corporate Events',       ar: 'الفعاليات المؤسسية' },
  svcPrivate:     { en: 'Private Celebrations',   ar: 'الاحتفالات الخاصة' },
  svcProd:        { en: 'Production and Design',  ar: 'الإنتاج والتصميم' },
  svcBrand:       { en: 'Branding Services',      ar: 'خدمات العلامة التجارية' },
  bookNow:        { en: 'Book Now',               ar: 'احجز الآن' },
  booking:        { en: 'Booking...',             ar: 'جارٍ الحجز...' },
  timeError:      { en: 'Please select a time.', ar: 'يرجى تحديد الوقت.' },
  close:          { en: 'Close',                  ar: 'إغلاق' },
  successTitle:   { en: 'Booking Confirmed',      ar: 'تم تأكيد الحجز' },
  successText:    { en: 'Thank you for your booking. Our team will reach out to confirm the details shortly.', ar: 'شكراً لحجزك. سيتواصل فريقنا معك لتأكيد التفاصيل قريباً.' },
  errorTitle:     { en: 'Booking Failed',         ar: 'فشل الحجز' },
  errorText:      { en: 'Something went wrong. Please try again.', ar: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.' },
  dateUnavail:    { en: 'Date Unavailable',       ar: 'التاريخ غير متاح' },
  timeUnavail:    { en: 'Time Unavailable',       ar: 'الوقت غير متاح' },
  slotTaken:      { en: 'Slot Already Booked',    ar: 'الموعد محجوز مسبقاً' },
  invalidDate:    { en: 'Invalid Date',           ar: 'تاريخ غير صالح' },
  panelTitle:     { en: 'Unavailable Days',       ar: 'أيام غير متاحة' },
  fullDayOff:     { en: 'Full Day Off',           ar: 'إجازة كاملة' },
};

function fmt12h(t: string): string {
  if (!t) return '';
  const [hs, ms] = t.split(':');
  let h = parseInt(hs, 10);
  const mer = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${ms || '00'} ${mer}`;
}

function formatDay(dateStr: string, lang: Lang): string {
  const [y, mo, d] = dateStr.split('-').map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

function formatShort(dateStr: string, lang: Lang): string {
  const [y, mo, d] = dateStr.split('-').map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

function getMonthName(dateStr: string, lang: Lang): string {
  const [y, mo] = dateStr.split('-').map(Number);
  return new Date(y, mo - 1, 1).toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-US', {
    month: 'long', year: 'numeric',
  });
}

export default function BookingSection() {
  const { lang } = useLang();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    service: '', date: '', hour: '', minute: '', ampm: 'AM', message: '',
  });

  const [status,     setStatus]     = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [timeError,  setTimeError]  = useState(false);
  const [offDays,    setOffDays]    = useState<OffDay[]>([]);
  const [blockModal, setBlockModal] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/off-days/public')
      .then(r => r.ok ? r.json() : [])
      .then((data: OffDay[]) => setOffDays(data))
      .catch(() => {});
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function checkOffDay(): string | null {
    if (!form.date) return null;
    const off = offDays.find(d => d.date === form.date);
    if (!off) return null;
    const dayName = formatDay(form.date, lang);
    if (off.fullDay) return lang === 'ar'
      ? `نعتذر، نحن مغلقون في ${dayName}. يرجى اختيار تاريخ آخر.`
      : `We are closed on ${dayName}. Please choose another date.`;
    if (form.hour && form.minute) {
      let h = parseInt(form.hour, 10) % 12;
      if (form.ampm === 'PM') h += 12;
      const bookMins = h * 60 + parseInt(form.minute, 10);
      const [os, om] = off.startTime.split(':').map(Number);
      const [oe, oem] = off.endTime.split(':').map(Number);
      if (bookMins >= os * 60 + om && bookMins < oe * 60 + oem) {
        return lang === 'ar'
          ? `نعتذر، نحن غير متاحين في ${dayName} من ${fmt12h(off.startTime)} إلى ${fmt12h(off.endTime)}. يرجى اختيار وقت مختلف.`
          : `We are unavailable on ${dayName} from ${fmt12h(off.startTime)} to ${fmt12h(off.endTime)}. Please choose a different time.`;
      }
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.hour || !form.minute) { setTimeError(true); return; }
    setTimeError(false);

    const block = checkOffDay();
    if (block) {
      const isFullDay = offDays.find(d => d.date === form.date)?.fullDay;
      setBlockModal({ title: isFullDay ? T.dateUnavail[lang] : T.timeUnavail[lang], message: block });
      return;
    }

    setStatus('sending');
    const time = `${form.hour}:${form.minute} ${form.ampm}`;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, service: form.service, date: form.date, time, message: form.message }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ firstName: '', lastName: '', email: '', phone: '', service: '', date: '', hour: '', minute: '', ampm: 'AM', message: '' });
      } else if (data.code === 'SLOT_TAKEN') {
        setStatus('idle');
        setBlockModal({
          title: T.slotTaken[lang],
          message: lang === 'ar'
            ? `الموعد ${form.date} في ${form.hour}:${form.minute} ${form.ampm} محجوز. يرجى اختيار وقت مختلف.`
            : `${form.date} at ${form.hour}:${form.minute} ${form.ampm} is already taken. Please choose a different time.`,
        });
      } else if (data.code === 'PAST_DATE') {
        setStatus('idle');
        setBlockModal({
          title: T.invalidDate[lang],
          message: lang === 'ar'
            ? 'لا يمكنك حجز تاريخ في الماضي. يرجى اختيار تاريخ في المستقبل.'
            : 'You cannot book a date in the past. Please select a future date.',
        });
      } else if (data.code === 'OFF_DAY') {
        setStatus('idle');
        setBlockModal({
          title: T.dateUnavail[lang],
          message: lang === 'ar'
            ? 'هذا التاريخ غير متاح للحجز. يرجى اختيار تاريخ آخر.'
            : 'This date is not available for bookings. Please choose another date.',
        });
      } else if (data.code === 'OFF_DAY_TIME') {
        setStatus('idle');
        const s = data.offStart ? fmt12h(data.offStart) : '';
        const end = data.offEnd ? fmt12h(data.offEnd) : '';
        setBlockModal({
          title: T.timeUnavail[lang],
          message: s && end
            ? (lang === 'ar' ? `نعتذر، نحن غير متاحين من ${s} إلى ${end} في هذا التاريخ.` : `We are unavailable from ${s} to ${end} on this date.`)
            : (lang === 'ar' ? 'هذا الوقت غير متاح.' : 'This time is not available.'),
        });
      } else {
        setStatus('error');
      }
    } catch { setStatus('error'); }
  }

  const monthPrefix  = form.date ? form.date.slice(0, 7) : '';
  const monthOffDays = monthPrefix
    ? offDays.filter(d => d.date.startsWith(monthPrefix)).sort((a, b) => a.date.localeCompare(b.date))
    : [];
  const hasSidePanel = monthOffDays.length > 0;

  return (
    <>
      {/* Block modal */}
      {blockModal && (
        <div className="booking-modal__backdrop" onClick={() => setBlockModal(null)}>
          <div className="booking-modal" onClick={e => e.stopPropagation()}>
            <span className="booking-modal__icon booking-modal__icon--error">
              <i className="fa-solid fa-calendar-xmark" style={{ fontSize: '18px' }} />
            </span>
            <h3 className="booking-modal__heading">{blockModal.title}</h3>
            <p className="booking-modal__text">{blockModal.message}</p>
            <button className="booking-modal__btn" onClick={() => setBlockModal(null)}>{T.close[lang]}</button>
          </div>
        </div>
      )}

      {/* Status modal */}
      {(status === 'success' || status === 'error') && (
        <div className="booking-modal__backdrop" onClick={() => setStatus('idle')}>
          <div className="booking-modal" onClick={e => e.stopPropagation()}>
            {status === 'success' ? (
              <>
                <span className="booking-modal__icon">✓</span>
                <h3 className="booking-modal__heading">{T.successTitle[lang]}</h3>
                <p className="booking-modal__text">{T.successText[lang]}</p>
              </>
            ) : (
              <>
                <span className="booking-modal__icon booking-modal__icon--error">✕</span>
                <h3 className="booking-modal__heading">{T.errorTitle[lang]}</h3>
                <p className="booking-modal__text">{T.errorText[lang]}</p>
              </>
            )}
            <button className="booking-modal__btn" onClick={() => setStatus('idle')}>{T.close[lang]}</button>
          </div>
        </div>
      )}

      <section className="booking-section">
        <div className="booking-section__inner">

          {/* ── Heading — always centered above everything ── */}
          <div className="booking-section__header">
            <h1 className="booking-section__heading">{T.heading[lang]}</h1>
            <p className="booking-section__subheading">{T.subheading[lang]}</p>
          </div>

          {/* ── Form card + panel (panel slides in right when date has off-days) ── */}
          <div className={`booking-section__split${hasSidePanel ? ' booking-section__split--on' : ''}`}>

            <div className="booking-section__card-wrap">
              <div className="booking-section__card">
                <form className="booking-section__form" onSubmit={handleSubmit}>
                  <div className="booking-section__row">
                    <div className="booking-section__field">
                      <label className="booking-section__label">{T.labelFirst[lang]}</label>
                      <input className="booking-section__input" type="text" name="firstName" placeholder={T.phFirst[lang]} value={form.firstName} onChange={handleChange} required />
                    </div>
                    <div className="booking-section__field">
                      <label className="booking-section__label">{T.labelLast[lang]}</label>
                      <input className="booking-section__input" type="text" name="lastName" placeholder={T.phLast[lang]} value={form.lastName} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="booking-section__row">
                    <div className="booking-section__field">
                      <label className="booking-section__label">{T.labelEmail[lang]}</label>
                      <input className="booking-section__input" type="email" name="email" placeholder="example@gmail.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="booking-section__field">
                      <label className="booking-section__label">{T.labelPhone[lang]}</label>
                      <input className="booking-section__input" type="tel" name="phone" placeholder={T.phPhone[lang]} value={form.phone} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="booking-section__field">
                    <label className="booking-section__label">{T.labelService[lang]}</label>
                    <select className={`booking-section__select${form.service ? ' booking-section__select--filled' : ''}`} name="service" value={form.service} onChange={handleChange} required>
                      <option value="" disabled>{T.phService[lang]}</option>
                      <option value="Corporate Events">{T.svcCorp[lang]}</option>
                      <option value="Private Celebrations">{T.svcPrivate[lang]}</option>
                      <option value="Production and Design">{T.svcProd[lang]}</option>
                      <option value="Branding Services">{T.svcBrand[lang]}</option>
                    </select>
                  </div>

                  <div className="booking-section__row">
                    <div className="booking-section__field">
                      <label className="booking-section__label">{T.labelDate[lang]}</label>
                      <input
                        className={`booking-section__input booking-section__input--date${form.date ? ' booking-section__input--filled' : ''}`}
                        type="date" name="date" min={today} value={form.date} onChange={handleChange} required
                      />
                    </div>
                    <div className="booking-section__field">
                      <label className="booking-section__label">{T.labelTime[lang]}</label>
                      <ClockPicker
                        hour={form.hour} minute={form.minute} ampm={form.ampm} error={timeError}
                        onChange={(h, m, ap) => { setForm({ ...form, hour: h, minute: m, ampm: ap }); setTimeError(false); }}
                      />
                      {timeError && <span className="booking-section__field-error">{T.timeError[lang]}</span>}
                    </div>
                  </div>

                  <div className="booking-section__field">
                    <label className="booking-section__label">{T.labelNotes[lang]}</label>
                    <textarea className="booking-section__textarea" name="message" placeholder={T.phNotes[lang]} rows={4} value={form.message} onChange={handleChange} />
                  </div>

                  <button className="booking-section__btn" type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? T.booking[lang] : T.bookNow[lang]}
                  </button>
                </form>
              </div>
            </div>

            {/* Unavailable days panel */}
            {hasSidePanel && (
              <div className="booking-unavail-panel">
                <div className="booking-unavail-header">
                  <h3 className="booking-unavail-title">{T.panelTitle[lang]}</h3>
                  <p className="booking-unavail-sub">
                    {lang === 'ar'
                      ? `نحن مغلقون في التواريخ التالية في ${getMonthName(form.date, lang)}.`
                      : `We are closed on the following dates in ${getMonthName(form.date, lang)}.`}
                  </p>
                </div>
                <div className="booking-unavail-list">
                  {monthOffDays.map(off => (
                    <div key={off._id} className="booking-unavail-item">
                      <span className="booking-unavail-date">{formatShort(off.date, lang)}</span>
                      <span className="booking-unavail-status">
                        {off.fullDay ? T.fullDayOff[lang] : `${fmt12h(off.startTime)} – ${fmt12h(off.endTime)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
}
