import Image from 'next/image';
import islamicImg from '../../Images/Event production/islamic.webp';
import '../../styles/event-production/herosection.css';

export default function EventProductionHero() {
  return (
    <section className="ep-hero">
      <div className="ep-hero__text">
        <h1 className="ep-hero__heading">
          Designing Experiences That Leave A Lasting Impression
        </h1>
        <p className="ep-hero__paragraph">
          Creative production, immersive environments, and beautifully crafted event spaces
          designed to bring every vision to life.
        </p>
      </div>

      <div className="ep-hero__image-wrap">
        <Image
          src={islamicImg}
          alt="Islamic event production"
          fill
          className="ep-hero__img"
          sizes="80vw"
          priority
        />
      </div>
    </section>
  );
}
