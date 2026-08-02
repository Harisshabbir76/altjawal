import Image from 'next/image';
import magzineImg from '../../Images/branding services/magzine.webp';
import '../../styles/branding-services/herosection.css';

export default function BrandingServicesHero() {
  return (
    <section className="bs-hero">
      <div className="bs-hero__text">
        <h1 className="bs-hero__heading">Building Brands That Stand Out</h1>
        <p className="bs-hero__paragraph">
          Creating thoughtful visual identities that tell your story, strengthen your presence, and
          leave a lasting impression.
        </p>
      </div>

      <div className="bs-hero__image-wrap">
        <Image
          src={magzineImg}
          alt="Branding services"
          fill
          className="bs-hero__img"
          sizes="80vw"
          priority
        />
      </div>
    </section>
  );
}
