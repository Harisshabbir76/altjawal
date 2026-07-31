import Image from 'next/image';
import coupleImg from '../../Images/main-services/couple.png';
import '../../styles/main-services/herosection.css';

export default function MainServicesHero() {
  return (
    <section className="ms-hero">
      <div className="ms-hero__text">
        <h1 className="ms-hero__heading">Events That Bring People Together</h1>
        <p className="ms-hero__paragraph">
          From intimate celebrations to large-scale corporate gatherings, we create experiences that
          are thoughtfully planned, beautifully executed, and remembered long after the event ends.
        </p>
      </div>

      <div className="ms-hero__image-wrap">
        <Image
          src={coupleImg}
          alt="Couple at an Al Tajwal event"
          fill
          className="ms-hero__img"
          sizes="100vw"
          priority
        />
      </div>
    </section>
  );
}
