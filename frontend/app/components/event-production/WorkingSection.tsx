import Image from 'next/image';
import papersImg from '../../Images/Event production/papers.webp';
import girlsImg from '../../Images/Event production/girls.webp';
import '../../styles/event-production/workingsection.css';

const steps = [
  { label: 'Discover', desc: 'Understanding your vision and objectives.' },
  { label: 'Design',   desc: 'Creating concepts tailored to your event.' },
  { label: 'Produce',  desc: 'Managing every production detail.' },
  { label: 'Deliver',  desc: 'Executing flawlessly from start to finish.' },
];

export default function WorkingSection() {
  return (
    <section className="ep-work">
      <div className="ep-work__grid">

        {/* ── Left image (papers) ── */}
        <div className="ep-work__side ep-work__side--left">
          <div className="ep-work__img-wrap">
            <Image src={papersImg} alt="Design papers" fill className="ep-work__img" sizes="220px" />
          </div>
        </div>

        {/* ── Center content ── */}
        <div className="ep-work__content">
          <h2 className="ep-work__heading">How We Work</h2>

          {steps.map((step) => (
            <div key={step.label} className="ep-work__step-group">
              <div className="ep-work__step">
                <span className="ep-work__step-label">{step.label}</span>
                <p className="ep-work__step-desc">{step.desc}</p>
              </div>
              <span className="ep-work__arrow">↓</span>
            </div>
          ))}

          <a href="/book" className="ep-work__btn">Book Now</a>
        </div>

        {/* ── Right image (girls) ── */}
        <div className="ep-work__side ep-work__side--right">
          <div className="ep-work__img-wrap">
            <Image src={girlsImg} alt="Team at work" fill className="ep-work__img" sizes="220px" />
          </div>
        </div>

      </div>
    </section>
  );
}
