import Image from 'next/image';
import girlImg from '../../Images/branding services/girl.webp';
import windowImg from '../../Images/branding services/window.webp';
import '../../styles/branding-services/brandingsection.css';

export default function BrandingSection() {
  return (
    <section className="bs-branding">
      <div className="bs-branding__inner">
      {/* ── Left: text ── */}
      <div className="bs-branding__text-col">
        <h2 className="bs-branding__heading">Why Branding Matters?</h2>
        <p className="bs-branding__paragraph">
          A strong brand creates recognition, builds trust, and forms lasting connections.
          Through thoughtful strategy and timeless design, we help businesses communicate
          with confidence and consistency across every touchpoint.
        </p>
        <a href="/book" className="bs-branding__btn">Book Your Consultation Now</a>
      </div>

      {/* ── Right: images ── */}
      <div className="bs-branding__images">
        <div className="bs-branding__girl-wrap">
          <Image
            src={girlImg}
            alt="Brand identity"
            fill
            className="bs-branding__img"
            sizes="170px"
          />
        </div>
        <div className="bs-branding__window-wrap">
          <Image
            src={windowImg}
            alt="Branding window"
            fill
            className="bs-branding__img"
            sizes="210px"
          />
        </div>
      </div>
      </div>
    </section>
  );
}
