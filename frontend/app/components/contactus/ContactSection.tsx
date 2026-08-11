'use client';

import { useState } from 'react';
import Image from 'next/image';
import heroImg from '../../Images/contactus/herosection.webp';
import clipImg from '../../Images/contactus/clip.webp';
import '../../styles/contactus/contactsection.css';
import { useLang } from '../../lib/LanguageContext';

const T = {
  heading:       { en: 'Contact Us', ar: 'اتصل بنا' },
  subheading:    { en: "We'd love to hear about your ideas. Reach out to us using the details below, and we'll be in touch to discuss how we can create an experience tailored to you.", ar: 'يسعدنا سماع أفكاركم. تواصلوا معنا عبر التفاصيل أدناه، وسنتواصل معكم لمناقشة كيف يمكننا إنشاء تجربة مخصصة لكم.' },
  cardIntro:     { en: 'Share a few details with us, and our team will be in touch to guide you through the next steps.', ar: 'شاركونا بعض التفاصيل، وسيتواصل فريقنا معكم لإرشادكم خلال الخطوات التالية.' },
  firstName:     { en: 'First Name',      ar: 'الاسم الأول' },
  lastName:      { en: 'Last Name',       ar: 'اسم العائلة' },
  email:         { en: 'Email Address',   ar: 'عنوان البريد الإلكتروني' },
  phone:         { en: 'Contact No.',     ar: 'رقم التواصل' },
  message:       { en: 'Message',         ar: 'الرسالة' },
  send:          { en: 'Send Message',    ar: 'إرسال الرسالة' },
  sending:       { en: 'Sending...',      ar: 'جارٍ الإرسال...' },
  successTitle:  { en: 'Message Sent',    ar: 'تم إرسال الرسالة' },
  successText:   { en: 'Thank you for reaching out. Our team will be in touch with you shortly.', ar: 'شكراً لتواصلكم معنا. سيتواصل فريقنا معكم قريباً.' },
  errorTitle:    { en: 'Failed to Send',  ar: 'فشل الإرسال' },
  errorText:     { en: 'Something went wrong. Please try again.', ar: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.' },
  close:         { en: 'Close',           ar: 'إغلاق' },
};

export default function ContactSection() {
  const { lang } = useLang();
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
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
                <h3 className="contact-modal__heading">{T.successTitle[lang]}</h3>
                <p className="contact-modal__text">{T.successText[lang]}</p>
              </>
            ) : (
              <>
                <span className="contact-modal__icon contact-modal__icon--error">✕</span>
                <h3 className="contact-modal__heading">{T.errorTitle[lang]}</h3>
                <p className="contact-modal__text">{T.errorText[lang]}</p>
              </>
            )}
            <button className="contact-modal__btn" onClick={() => setStatus('idle')}>
              {T.close[lang]}
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
          <h1 className="contact-section__heading">{T.heading[lang]}</h1>
          <p className="contact-section__subheading">{T.subheading[lang]}</p>

          <div className="contact-section__card">
            <div className="contact-section__card-clip">
              <Image src={clipImg} alt="" width={180} height={180} className="contact-section__clip-img" />
            </div>

            <p className="contact-section__card-intro">{T.cardIntro[lang]}</p>

            <form className="contact-section__form" onSubmit={handleSubmit}>
              <div className="contact-section__row">
                <input
                  className="contact-section__input"
                  type="text"
                  name="firstName"
                  required
                  placeholder={T.firstName[lang]}
                  value={form.firstName}
                  onChange={handleChange}
                />
                <input
                  className="contact-section__input"
                  type="text"
                  name="lastName"
                  required
                  placeholder={T.lastName[lang]}
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="contact-section__row">
                <input
                  className="contact-section__input"
                  type="email"
                  name="email"
                  required
                  placeholder={T.email[lang]}
                  value={form.email}
                  onChange={handleChange}
                />
                <input
                  className="contact-section__input"
                  type="tel"
                  name="phone"
                  required
                  placeholder={T.phone[lang]}
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <textarea
                className="contact-section__textarea"
                name="message"
                placeholder={T.message[lang]}
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
              />
              <button className="contact-section__btn" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? T.sending[lang] : T.send[lang]}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
