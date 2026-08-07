'use client';

import { useState } from 'react';
import ClockPicker from './ClockPicker';
import '../../styles/book/bookingsection.css';

const today = new Date().toISOString().split('T')[0];

export default function BookingSection() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    hour: '',
    minute: '',
    ampm: 'AM',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [timeError, setTimeError] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // ClockPicker is a custom widget, not a native input, so `required` can't
    // validate it — check it manually alongside the browser's native checks.
    if (!form.hour || !form.minute) {
      setTimeError(true);
      return;
    }
    setTimeError(false);

    setStatus('sending');
    const time = `${form.hour}:${form.minute} ${form.ampm}`;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          service: form.service,
          date: form.date,
          time,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ firstName: '', lastName: '', email: '', phone: '', service: '', date: '', hour: '', minute: '', ampm: 'AM', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      {/* ── Modal ── */}
      {(status === 'success' || status === 'error') && (
        <div className="booking-modal__backdrop" onClick={() => setStatus('idle')}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            {status === 'success' ? (
              <>
                <span className="booking-modal__icon">✓</span>
                <h3 className="booking-modal__heading">Booking Confirmed</h3>
                <p className="booking-modal__text">
                  Thank you for your booking. Our team will reach out to confirm the details shortly.
                </p>
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
          <h1 className="booking-section__heading">Book Your Experience</h1>
          <p className="booking-section__subheading">
            Fill in the details below and our team will confirm your booking shortly.
          </p>

          <div className="booking-section__card">
            <form className="booking-section__form" onSubmit={handleSubmit}>
              {/* Name */}
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

              {/* Contact */}
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

              {/* Service */}
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

              {/* Date + Time */}
              <div className="booking-section__row">
                <div className="booking-section__field">
                  <label className="booking-section__label">Date</label>
                  <input className={`booking-section__input booking-section__input--date${form.date ? ' booking-section__input--filled' : ''}`} type="date" name="date" min={today} value={form.date} onChange={handleChange} required />
                </div>
                <div className="booking-section__field">
                  <label className="booking-section__label">Time</label>
                  <ClockPicker
                    hour={form.hour}
                    minute={form.minute}
                    ampm={form.ampm}
                    error={timeError}
                    onChange={(h, m, ap) => {
                      setForm({ ...form, hour: h, minute: m, ampm: ap });
                      setTimeError(false);
                    }}
                  />
                  {timeError && <span className="booking-section__field-error">Please select a time.</span>}
                </div>
              </div>

              {/* Notes */}
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
      </section>
    </>
  );
}
