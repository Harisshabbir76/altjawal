'use client';

import { useState, useEffect } from 'react';
import ClockPicker from './ClockPicker';
import '../../styles/book/bookingsection.css';

const today = new Date().toISOString().split('T')[0];

type OffDay = {
  _id: string;
  date: string;
  fullDay: boolean;
  startTime: string;
  endTime: string;
};

function fmt12h(t: string): string {
  if (!t) return '';
  const [hs, ms] = t.split(':');
  let h = parseInt(hs, 10);
  const mer = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${ms || '00'} ${mer}`;
}

function formatDay(dateStr: string): string {
  const [y, mo, d] = dateStr.split('-').map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

function formatShort(dateStr: string): string {
  const [y, mo, d] = dateStr.split('-').map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

function getMonthName(dateStr: string): string {
  const [y, mo] = dateStr.split('-').map(Number);
  return new Date(y, mo - 1, 1).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric',
  });
}

export default function BookingSection() {
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
    if (off.fullDay) return `We are closed on ${formatDay(form.date)}. Please choose another date.`;
    if (form.hour && form.minute) {
      let h = parseInt(form.hour, 10) % 12;
      if (form.ampm === 'PM') h += 12;
      const bookMins = h * 60 + parseInt(form.minute, 10);
      const [os, om] = off.startTime.split(':').map(Number);
      const [oe, oem] = off.endTime.split(':').map(Number);
      if (bookMins >= os * 60 + om && bookMins < oe * 60 + oem) {
        return `We are unavailable on ${formatDay(form.date)} from ${fmt12h(off.startTime)} to ${fmt12h(off.endTime)}. Please choose a different time.`;
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
      setBlockModal({ title: isFullDay ? 'Date Unavailable' : 'Time Unavailable', message: block });
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
        setBlockModal({ title: 'Slot Already Booked', message: `${form.date} at ${form.hour}:${form.minute} ${form.ampm} is already taken. Please choose a different time.` });
      } else if (data.code === 'PAST_DATE') {
        setStatus('idle');
        setBlockModal({ title: 'Invalid Date', message: 'You cannot book a date in the past. Please select a future date.' });
      } else if (data.code === 'OFF_DAY') {
        setStatus('idle');
        setBlockModal({ title: 'Date Unavailable', message: 'This date is not available for bookings. Please choose another date.' });
      } else if (data.code === 'OFF_DAY_TIME') {
        setStatus('idle');
        const s = data.offStart ? fmt12h(data.offStart) : '';
        const end = data.offEnd ? fmt12h(data.offEnd) : '';
        setBlockModal({ title: 'Time Unavailable', message: s && end ? `We are unavailable from ${s} to ${end} on this date.` : 'This time is not available.' });
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
            <button className="booking-modal__btn" onClick={() => setBlockModal(null)}>Close</button>
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
                <h3 className="booking-modal__heading">Booking Confirmed</h3>
                <p className="booking-modal__text">Thank you for your booking. Our team will reach out to confirm the details shortly.</p>
              </>
            ) : (
              <>
                <span className="booking-modal__icon booking-modal__icon--error">✕</span>
                <h3 className="booking-modal__heading">Booking Failed</h3>
                <p className="booking-modal__text">Something went wrong. Please try again.</p>
              </>
            )}
            <button className="booking-modal__btn" onClick={() => setStatus('idle')}>Close</button>
          </div>
        </div>
      )}

      <section className="booking-section">
        <div className="booking-section__inner">

          {/* ── Heading — always centered above everything ── */}
          <div className="booking-section__header">
            <h1 className="booking-section__heading">Book Your Experience</h1>
            <p className="booking-section__subheading">
              Fill in the details below and our team will confirm your booking shortly.
            </p>
          </div>

          {/* ── Form card + panel (panel slides in right when date has off-days) ── */}
          <div className={`booking-section__split${hasSidePanel ? ' booking-section__split--on' : ''}`}>

            <div className="booking-section__card-wrap">
              <div className="booking-section__card">
                <form className="booking-section__form" onSubmit={handleSubmit}>
                  <div className="booking-section__row">
                    <div className="booking-section__field">
                      <label className="booking-section__label">First Name</label>
                      <input className="booking-section__input" type="text" name="firstName" placeholder="Your First Name" value={form.firstName} onChange={handleChange} required />
                    </div>
                    <div className="booking-section__field">
                      <label className="booking-section__label">Last Name</label>
                      <input className="booking-section__input" type="text" name="lastName" placeholder="Your Last Name" value={form.lastName} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="booking-section__row">
                    <div className="booking-section__field">
                      <label className="booking-section__label">Email Address</label>
                      <input className="booking-section__input" type="email" name="email" placeholder="example@gmail.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="booking-section__field">
                      <label className="booking-section__label">Contact No.</label>
                      <input className="booking-section__input" type="tel" name="phone" placeholder="Your Phone Number" value={form.phone} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="booking-section__field">
                    <label className="booking-section__label">Service</label>
                    <select className={`booking-section__select${form.service ? ' booking-section__select--filled' : ''}`} name="service" value={form.service} onChange={handleChange} required>
                      <option value="" disabled>Select Service</option>
                      <option value="Corporate Events">Corporate Events</option>
                      <option value="Private Celebrations">Private Celebrations</option>
                      <option value="Production and Design">Production and Design</option>
                      <option value="Branding Services">Branding Services</option>
                    </select>
                  </div>

                  <div className="booking-section__row">
                    <div className="booking-section__field">
                      <label className="booking-section__label">Date</label>
                      <input
                        className={`booking-section__input booking-section__input--date${form.date ? ' booking-section__input--filled' : ''}`}
                        type="date" name="date" min={today} value={form.date} onChange={handleChange} required
                      />
                    </div>
                    <div className="booking-section__field">
                      <label className="booking-section__label">Time</label>
                      <ClockPicker
                        hour={form.hour} minute={form.minute} ampm={form.ampm} error={timeError}
                        onChange={(h, m, ap) => { setForm({ ...form, hour: h, minute: m, ampm: ap }); setTimeError(false); }}
                      />
                      {timeError && <span className="booking-section__field-error">Please select a time.</span>}
                    </div>
                  </div>

                  <div className="booking-section__field">
                    <label className="booking-section__label">Additional Notes</label>
                    <textarea className="booking-section__textarea" name="message" placeholder="Optional — anything we should know" rows={4} value={form.message} onChange={handleChange} />
                  </div>

                  <button className="booking-section__btn" type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Booking...' : 'Book Now'}
                  </button>
                </form>
              </div>
            </div>

            {/* Unavailable days panel */}
            {hasSidePanel && (
              <div className="booking-unavail-panel">
                <div className="booking-unavail-header">
                  <h3 className="booking-unavail-title">Unavailable Days</h3>
                  <p className="booking-unavail-sub">
                    We are closed on the following dates in {getMonthName(form.date)}.
                  </p>
                </div>
                <div className="booking-unavail-list">
                  {monthOffDays.map(off => (
                    <div key={off._id} className="booking-unavail-item">
                      <span className="booking-unavail-date">{formatShort(off.date)}</span>
                      <span className="booking-unavail-status">
                        {off.fullDay ? 'Full Day Off' : `${fmt12h(off.startTime)} – ${fmt12h(off.endTime)}`}
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
