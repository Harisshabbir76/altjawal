import Image from 'next/image';
import arabLife from '../../Images/About-us/arab-life.webp';
import '../../styles/About-us/inspiredsection.css';

export default function InspiredSection() {
  return (
    <section className="about-inspired">
      <div className="about-inspired__text">
        <h2 className="about-inspired__heading">
          Inspired by Al Dhafra.<br />
          Rooted in the Heart of the UAE.
        </h2>
        <p className="about-inspired__paragraph">
          Our story begins in Al Dhafra, where the beauty of endless deserts, tranquil coastlines, and
          authentic Emirati traditions continue to inspire everything we create.
        </p>
        <p className="about-inspired__paragraph">
          These landscapes shape our creative vision, influencing the way we design experiences
          that feel timeless, elegant, and deeply connected to the culture of the UAE.
        </p>
      </div>
      <div className="about-inspired__img-wrap">
        <Image
          src={arabLife}
          alt="Al Dhafra desert landscape"
          fill
          className="about-inspired__img"
          sizes="90vw"
        />
      </div>
    </section>
  );
}
