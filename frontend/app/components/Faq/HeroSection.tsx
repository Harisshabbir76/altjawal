import Image from 'next/image';
import heroImg from '../../Images/Faq/herosection.png';
import frameImg from '../../Images/Faq/frame.png';
import '../../styles/Faq/herosection.css';

export default function FaqHeroSection() {
  return (
    <section className="faq-hero">
      {/* Background — contained so it doesn't overflow */}
      <div className="faq-hero__bg-wrap">
        <Image src={heroImg} alt="FAQ hero background" fill className="faq-hero__bg" sizes="100vw" priority />
        <div className="faq-hero__overlay" />
      </div>

      {/* Frame — 80% in hero, 20% below */}
      <div className="faq-hero__frame-wrap">
        <Image src={frameImg} alt="" fill className="faq-hero__frame-img" sizes="420px" />
        <div className="faq-hero__frame-content">
          <p className="faq-hero__label">Everything You Need to Know</p>
          <h1 className="faq-hero__heading">
            BEFORE WE BEGIN<br />
            SOMETHING<br />
            UNFORGETTABLE.
          </h1>
          <p className="faq-hero__paragraph">
            Every remarkable event begins with a conversation. We&apos;ve gathered the most
            common questions to help you understand our process, what to expect, and how
            AlTjawal transforms ideas into beautifully curated experiences across the UAE.
          </p>
        </div>
      </div>
    </section>
  );
}
