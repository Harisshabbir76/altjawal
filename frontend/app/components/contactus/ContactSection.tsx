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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
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
            <Image src={clipImg} alt="" width={55} height={105} />
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
            <button className="contact-section__btn" type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
}
