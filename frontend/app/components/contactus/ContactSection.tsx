'use client';

import { useState } from 'react';
import Image from 'next/image';
import heroImg from '../../Images/contactus/herosection.png';
import clipImg from '../../Images/contactus/clip.png';
import '../../styles/contactus/contactsection.css';

export default function ContactSection() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ firstName: '', lastName: '', email: '', phone: '', message: '' });
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
        <div className="contact-modal__backdrop" onClick={() => setStatus('idle')}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            {status === 'success' ? (
              <>
                <span className="contact-modal__icon">✓</span>
                <h3 className="contact-modal__heading">Message Received</h3>
                <p className="contact-modal__text">
                  Thank you for reaching out. Our team will be in touch with you shortly.
                </p>
              </>
            ) : (
              <>
                <span className="contact-modal__icon contact-modal__icon--error">✕</span>
                <h3 className="contact-modal__heading">Failed to Send</h3>
                <p className="contact-modal__text">Something went wrong. Please try again.</p>
              </>
            )}
            <button className="contact-modal__btn" onClick={() => setStatus('idle')}>
              Close
            </button>
          </div>
        </div>
      )}

      <section className="contact-section">
        <div className="contact-section__bg-wrap">
          <Image src={heroImg} alt="" fill className="contact-section__bg" />
          <div className="contact-section__overlay" />
        </div>

        <div className="contact-section__inner">
          <h1 className="contact-section__heading">Contact Us</h1>
          <p className="contact-section__subheading">
            We&apos;d love to hear about your ideas. Reach out to us using the details below, and we&apos;ll be
            in touch to discuss how we can create an experience tailored to you.
          </p>

          <div className="contact-section__card">
            <div className="contact-section__card-clip">
              <Image src={clipImg} alt="" width={180} height={180} className="contact-section__clip-img" />
            </div>

            <p className="contact-section__card-intro">
              Share a few details with us, and our team will be in touch to guide you through the next steps.
            </p>

            <form className="contact-section__form" onSubmit={handleSubmit}>
              <div className="contact-section__row">
                <input
                  className="contact-section__input"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                />
                <input
                  className="contact-section__input"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="contact-section__row">
                <input
                  className="contact-section__input"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                />
                <input
                  className="contact-section__input"
                  type="tel"
                  name="phone"
                  placeholder="Contact No."
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <textarea
                className="contact-section__textarea"
                name="message"
                placeholder="Message"
                rows={5}
                value={form.message}
                onChange={handleChange}
              />
              <button className="contact-section__btn" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
