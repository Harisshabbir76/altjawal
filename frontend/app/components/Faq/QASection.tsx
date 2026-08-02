'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import paperImg from '../../Images/Faq/paper.webp';
import '../../styles/Faq/qasection.css';

type QAItem = { q: string; a: string };

const DEFAULT_FAQS: QAItem[] = [
  { q: '1. What types of events do you organize?', a: 'We organize a wide range of events including corporate gatherings, private celebrations, weddings, brand activations, and large-scale productions across the UAE.' },
  { q: '2. Do you provide end-to-end event management?', a: 'Yes. From initial concept and planning to on-the-day coordination and post-event wrap-up, we handle every detail so you can enjoy the experience.' },
  { q: '3. Do you offer customized event packages?', a: "Absolutely. Every event we create is tailored to your vision, budget, and goals. We don't offer one-size-fits-all packages." },
  { q: '4. How far in advance should I book my event?', a: 'We recommend booking at least 2–3 months in advance for smaller events and 4–6 months for larger productions to ensure the best vendors and venues are available.' },
  { q: '5. Do you only work within the UAE?', a: 'Our primary focus is the UAE, but we do take on select international projects. Contact us to discuss your specific needs.' },
  { q: '6. Can you help with venue selection?', a: 'Yes. We have strong relationships with a curated network of venues across the UAE and can help you find the perfect setting for your event.' },
  { q: '7. Do you handle event design and décor?', a: 'Yes. Our team manages full event design including florals, lighting, furniture, and styling to create a cohesive and beautiful atmosphere.' },
  { q: '8. What branding services do you offer?', a: 'We offer event branding including signage, stage design, branded collateral, and digital assets to ensure your brand is consistently represented.' },
  { q: '9. Can you manage vendors on our behalf?', a: "Yes. We coordinate with all vendors — from caterers to entertainers — and ensure everyone is aligned with your event's vision and timeline." },
  { q: '10. Do you provide photography and videography?', a: 'We work with trusted photography and videography partners to capture your event beautifully. This can be included in your event package.' },
  { q: '11. Can you organize sustainable events?', a: 'Yes. We offer eco-conscious event solutions using reusable materials, responsible sourcing, and mindful production methods.' },
  { q: '12. Do you offer corporate event solutions for businesses?', a: 'We specialize in corporate events including conferences, team-building activities, product launches, and client appreciation evenings.' },
  { q: '13. Can you work with a specific budget?', a: 'Absolutely. We work transparently within your budget and provide clear breakdowns so there are no surprises.' },
  { q: '14. How do we get started?', a: "Simply reach out via our contact page or book a consultation directly. We'll set up an introductory call to understand your vision and begin planning." },
  { q: '15. Why choose AlTjawal?', a: 'We bring together authentic Emirati hospitality, creative excellence, and meticulous attention to detail — ensuring every event is a meaningful, beautifully crafted experience.' },
];

export default function FaqQASection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<QAItem[]>(DEFAULT_FAQS);

  useEffect(() => {
    fetch('/api/cms/faq')
      .then((r) => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        const arr = Array.isArray(data) ? data : (data.blocks ?? []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const qaBlock = arr.find((b: any) => b.blockKey === 'faq-qa-items');
        if (qaBlock?.content) {
          try {
            const items: QAItem[] = JSON.parse(qaBlock.content);
            if (Array.isArray(items) && items.length > 0) setFaqs(items);
          } catch { /* malformed JSON — keep defaults */ }
        }
      })
      .catch(() => {});
  }, []);

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i);
  }

  return (
    <>
      {/* ── Accordion ── */}
      <section className="faq-qa">
        <h2 className="faq-qa__heading">Frequently Asked Questions</h2>
        <p className="faq-qa__subheading">
          Planning an event should feel exciting—not overwhelming. Here are answers to some of the questions
          we&apos;re most often asked. If you can&apos;t find what you&apos;re looking for, our team is always happy to assist.
        </p>

        <div className="faq-qa__list">
          {faqs.map((item, i) => (
            <div key={i} className={`faq-qa__item${openIndex === i ? ' faq-qa__item--open' : ''}`}>
              <button className="faq-qa__question" onClick={() => toggle(i)}>
                <span>{item.q}</span>
                <span className="faq-qa__arrow">{openIndex === i ? '▲' : '▼'}</span>
              </button>
              {openIndex === i && (
                <p className="faq-qa__answer">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact card ── */}
      <section className="faq-contact">
        <div className="faq-contact__card">
          <Image src={paperImg} alt="" fill className="faq-contact__paper-bg" />
          <h3 className="faq-contact__heading">Still have a question?</h3>
          <p className="faq-contact__paragraph">
            Our team is here to help. Get in touch with us, and we&apos;ll be happy to
            guide you through every step of your event journey.
          </p>
          <a href="/contact" className="faq-contact__btn">CONTACT US</a>
        </div>
      </section>
    </>
  );
}
