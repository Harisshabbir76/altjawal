import Image from 'next/image';
import heroImg from '../../Images/About-us/herosection.png';
import '../../styles/About-us/herosection.css';

export default function AboutHeroSection() {
  return (
    <section className="aboutus-hero">
      <Image
        src={heroImg}
        alt="About Al Tajwal"
        fill
        className="aboutus-hero__bg-img"
        sizes="100vw"
        priority
      />
      <div className="aboutus-hero__content">
        <h1 className="aboutus-hero__heading">
          Inspired by Heritage.<br />
          Designed for Extraordinary Experiences.
        </h1>
        <p className="aboutus-hero__paragraph">
          Blending authentic Emirati hospitality with contemporary creativity to create
          meaningful events across the UAE.
        </p>
      </div>
    </section>
  );
}
