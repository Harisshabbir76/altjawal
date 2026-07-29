import Image from 'next/image';
import heroImage from '../../Images/homepage/herosection.png';
import '../../styles/homepage/herosection.css';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <Image
        src={heroImage}
        alt="Al Tajwal Hero"
        fill
        className="hero-image"
        priority
        quality={90}
      />

      <div className="hero-content">
        <h1 className="hero-heading">We Build Your Presence</h1>
        <p className="hero-paragraph">
          Creating exceptional events, unforgettable experiences, and meaningful
          moments across the UAE.
        </p>
        <a href="/book" className="hero-button">Book a Consultation</a>
      </div>
    </section>
  );
}
