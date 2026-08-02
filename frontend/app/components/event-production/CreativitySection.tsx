import Image from 'next/image';
import leftImg from '../../Images/Event production/left.webp';
import rightImg from '../../Images/Event production/right.webp';
import '../../styles/event-production/creativitysection.css';

export default function CreativitySection() {
  return (
    <>
      {/* ── Intro ── */}
      <section className="ep-creativity">
        <div className="ep-creativity__content">
          <h2 className="ep-creativity__heading">Where Creativity Meets Execution</h2>
          <p className="ep-creativity__subtext">Exceptional events begin with exceptional design.</p>
          <p className="ep-creativity__paragraph">
            Our production team transforms ideas into immersive environments through thoughtful planning,
            innovative concepts, and flawless execution. From the smallest decorative detail to full-scale event
            production, every element is carefully curated.
          </p>
        </div>
      </section>

      {/* ── Production & Design block ── */}
      <div className="ep-pd-block">
        <div className="ep-pd__img-wrap">
          <Image src={leftImg} alt="Event musicians" fill className="ep-pd__img" sizes="30vw" />
        </div>

        <div className="ep-pd__card">
          <h3 className="ep-pd__card-heading">Production &amp; Design</h3>
          <p className="ep-pd__card-text">
            We transform ideas into immersive event experiences through creative design and innovative
            production solutions. From event branding, stage and booth design, exhibition stands, and
            floral concepts to audiovisual solutions, LED screens, interactive experiences, content
            creation, and professional photography and videography, we bring every vision to life
            with precision and creativity.
          </p>
          <p className="ep-pd__services-label">Services:</p>
          <ul className="ep-pd__services-list">
            <li>Event Branding &amp; Themes</li>
            <li>Stage &amp; Booth Design</li>
            <li>Exhibition Stands</li>
            <li>Floral Concepts</li>
            <li>Backdrops &amp; Installations</li>
            <li>Audio Visual Solutions</li>
            <li>LED Screens</li>
            <li>Interactive Experiences</li>
            <li>Event Content Creation</li>
            <li>Event Photography &amp; Videography</li>
          </ul>
          <a href="/book" className="ep-pd__btn">Book Now</a>
        </div>

        <div className="ep-pd__img-wrap">
          <Image src={rightImg} alt="Exhibition stand" fill className="ep-pd__img" sizes="30vw" />
        </div>
      </div>
    </>
  );
}
