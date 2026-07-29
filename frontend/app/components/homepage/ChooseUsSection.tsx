import Image from 'next/image';
import chooseus1 from '../../Images/homepage/chooseus1.png';
import chooseus2 from '../../Images/homepage/chooseus2.jpg';
import '../../styles/homepage/chooseussection.css';

const bullets = [
  'Professional event planning from concept to completion',
  'Authentic Emirati hospitality with a contemporary approach',
  'Creative designs tailored to every occasion',
  'Reliable vendor and production management',
  'Sustainable event solutions using reusable materials',
  'Personalized service with meticulous attention to detail',
];

export default function ChooseUsSection() {
  return (
    <>
    <section className="chooseus-section">
      {/* Left image */}
      <div className="chooseus-left">
        <Image
          src={chooseus1}
          alt="Outdoor event with lights"
          fill
          className="chooseus-left-img"
          sizes="(max-width: 767px) 40vw, 22vw"
        />
      </div>

      {/* Center content */}
      <div className="chooseus-content">
        <h2 className="chooseus-heading">Why Clients Choose Us</h2>
        <ul className="chooseus-list">
          {bullets.map((item, i) => (
            <li key={i} className="chooseus-item">{item}</li>
          ))}
        </ul>
      </div>

      {/* Right image */}
      <div className="chooseus-right">
        <Image
          src={chooseus2}
          alt="Swans on water"
          fill
          className="chooseus-right-img"
          sizes="(max-width: 767px) 40vw, 20vw"
        />
      </div>
    </section>
    <hr className="vision-divider" />
    </>
  );
}
