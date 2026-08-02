import Image from 'next/image';
import vision1 from '../../Images/homepage/vision1.webp';
import vision2 from '../../Images/homepage/vision2.webp';
import '../../styles/homepage/visionsection.css';

export default function VisionSection() {
  return (
    <>
    <section className="vision-section">
      {/* Left: text */}
      <div className="vision-content">
        <h2 className="vision-heading">Designed Around Your Vision</h2>
        <p className="vision-paragraph">
          Every event tells a story. At AlTjawal, we blend authentic Emirati
          hospitality with contemporary event design to create experiences that
          are elegant, seamless, and unforgettable. From concept development to
          flawless execution, every detail is thoughtfully planned with
          creativity, precision, and care.
        </p>
        <a href="/book" className="vision-button">Book Your Consultation Now</a>
      </div>

      {/* Right: images */}
      <div className="vision-images">
        <div className="vision-img-wrap">
          <Image
            src={vision1}
            alt="Event hall"
            fill
            className="vision-img"
            sizes="(max-width: 767px) 50vw, 28vw"
          />
        </div>
        <div className="vision-img-wrap">
          <Image
            src={vision2}
            alt="Traditional attire"
            fill
            className="vision-img"
            sizes="(max-width: 767px) 50vw, 26vw"
          />
        </div>
      </div>
    </section>
    <hr className="vision-divider" />
    </>
  );
}
