import Image from 'next/image';
import founderImg from '../../Images/About-us/founder.webp';
import '../../styles/About-us/foundersection.css';
import '../../styles/homepage/experiencesection.css';

const stats = [
  { value: '10+', label: 'Years of Experience' },
  { value: '27+', label: 'Successful Projects' },
  { value: '5',   label: 'Emirates Served' },
  { value: '19+', label: 'Satisfied Clients' },
];

export default function FounderSection() {
  return (
    <>
    <section className="about-founder">
      <div className="about-founder__inner">
      <div className="about-founder__img-col">
        <div className="about-founder__img-wrap">
          <Image
            src={founderImg}
            alt="Haya Al Mansouri"
            fill
            className="about-founder__img"
            sizes="(max-width: 767px) 80vw, 260px"
          />
        </div>
      </div>

      <div className="about-founder__content">
        <h2 className="about-founder__name">
          Meet Our Founder<br />
          Haya Al Mansouri,<br />
          Founder &amp; Managing Director
        </h2>
        <p className="about-founder__paragraph">
          Born and raised in Al Dhafra, Haya Al Mansouri established AlTjawal with a
          passion for creating experiences that bring people together.
        </p>
        <p className="about-founder__paragraph">
          Driven by creativity, exceptional organization, and a people-first approach,
          she believes every event—regardless of its size—deserves thoughtful
          planning, refined design, and genuine hospitality.
        </p>
        <p className="about-founder__paragraph">
          Today, her vision continues to shape AlTjawal into a trusted partner for
          businesses, families, and organizations seeking exceptional experiences
          across the UAE.
        </p>
      </div>
      </div>
    </section>
    <hr className="about-experience-divider" />
    <section className="experience-section about-founder-stats">
      <h2 className="experience-heading">Creating Experiences That Matter</h2>
      <div className="experience-stats">
        {stats.map((stat, i) => (
          <div className="experience-stat" key={i}>
            <span className="experience-value">{stat.value}</span>
            <span className="experience-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}
