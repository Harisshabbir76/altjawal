import Image from 'next/image';
import s1 from '../../Images/homepage/s1.webp';
import s2 from '../../Images/homepage/s2.webp';
import s3 from '../../Images/homepage/s3.webp';
import s4 from '../../Images/homepage/s4.webp';
import frame from '../../Images/homepage/frame.webp';
import '../../styles/homepage/servicessection.css';

const services = [
  { src: s1, alt: 'Corporate event gathering', label: 'Corporate Events' },
  { src: s2, alt: 'Private celebration setting', label: 'Private Celebrations' },
  { src: s3, alt: 'Event production setup', label: 'Event Production' },
  { src: s4, alt: 'Branding services', label: 'Branding Services' },
];

export default function ServicesSection() {
  return (
    <section className="services-section">
      <h2 className="services-heading">Our Services</h2>
      <p className="services-paragraph">
        Born in Al Dhafra and proudly serving clients across all seven Emirates, AlTjawal brings together
        local heritage and modern creativity to deliver events that truly reflect your vision.
      </p>

      <div className="services-cards">
        {services.map((service, i) => (
          <div className="service-card" key={i} data-index={i}>
            <div className="service-polaroid">
              <div className="service-img-wrap">
                <Image
                  src={service.src}
                  alt={service.alt}
                  fill
                  className="service-img"
                  sizes="(max-width: 767px) 40vw, 18vw"
                />
              </div>
            </div>
            <span className="service-label">{service.label}</span>
          </div>
        ))}
      </div>

      <div className="services-frame-wrap">
        <Image
          src={frame}
          alt="Decorative frame"
          fill
          className="services-frame-img"
          sizes="300px"
        />
      </div>
    </section>
  );
}
