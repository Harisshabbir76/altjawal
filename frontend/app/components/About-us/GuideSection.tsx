import Image from 'next/image';
import horseImg from '../../Images/About-us/horse.webp';
import streetImg from '../../Images/About-us/street.webp';
import '../../styles/About-us/guidesection.css';

const values = [
  {
    title: 'Creativity',
    description: 'Every event begins with an original idea designed specifically for you.',
  },
  {
    title: 'Excellence',
    description:
      'We believe exceptional experiences are built through meticulous planning and attention to detail.',
  },
  {
    title: 'Hospitality',
    description:
      'Inspired by authentic Emirati traditions, we create welcoming experiences where every guest feels valued.',
  },
  {
    title: 'Sustainability',
    description:
      'We embrace responsible event practices by prioritizing reusable materials, thoughtful production methods, and environmentally conscious solutions that support the UAE\'s vision for a more sustainable future.',
  },
];

export default function GuideSection() {
  return (
    <section className="about-guide">
      <h2 className="about-guide__heading">What Guides Everything We Do</h2>

      <div className="about-guide__body">
        <ul className="about-guide__list">
          {values.map((v) => (
            <li key={v.title} className="about-guide__item">
              <span className="about-guide__item-title">{v.title}</span>
              <p className="about-guide__item-desc">{v.description}</p>
            </li>
          ))}
        </ul>

        <div className="about-guide__images">
          <div className="about-guide__img-wrap">
            <Image src={horseImg} alt="White horse" fill className="about-guide__img" sizes="25vw" />
          </div>
          <div className="about-guide__img-wrap">
            <Image src={streetImg} alt="Emirati street" fill className="about-guide__img" sizes="25vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
