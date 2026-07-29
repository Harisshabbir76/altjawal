import Image from 'next/image';
import camels from '../../Images/homepage/camels.png';
import '../../styles/homepage/traditionsection.css';

export default function TraditionSection() {
  return (
    <section className="tradition-section">
      <div className="tradition-text">
        <h2 className="tradition-heading">Inspired by Tradition. Crafted for Today.</h2>
        <p className="tradition-paragraph">
          Born in Al Dhafra and proudly serving clients across all seven Emirates, AlTjawal brings together
          local heritage and modern creativity to deliver events that truly reflect your vision.
        </p>
        <p className="tradition-paragraph">
          Whether you're planning a corporate gathering, product launch, wedding, or private celebration, our
          team ensures every experience feels effortless from beginning to end.
        </p>
        <a href="/about" className="tradition-button">Discover Our Story</a>
      </div>

      <div className="tradition-image-wrap">
        <Image
          src={camels}
          alt="Camels crossing desert dunes at golden hour"
          fill
          className="tradition-img"
          sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1023px) calc(100vw - 6rem), calc(100vw - 10rem)"
        />
      </div>
    </section>
  );
}
