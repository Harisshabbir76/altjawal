import Image from 'next/image';
import experienceImg from '../../Images/About-us/experince.jpg';
import build1 from '../../Images/About-us/build1.png';
import build2 from '../../Images/About-us/build2.jpg';
import build3 from '../../Images/About-us/build3.jpg';
import '../../styles/About-us/experiencesection.css';

export default function AboutExperienceSection() {
  return (
    <>
    <section className="about-experience">
      {/* Image centred across the hero/experience boundary */}
      <div className="about-experience__img-wrap">
        <Image
          src={experienceImg}
          alt="Terracotta staircase with palm shadow"
          fill
          className="about-experience__img"
          sizes="(max-width: 767px) 80vw, 300px"
        />
      </div>

      <div className="about-experience__content">
        <h2 className="about-experience__heading">
          Every Great Experience Begins With A Meaningful Story.
        </h2>

        <p className="about-experience__paragraph">
          AlTjawal was founded with a simple belief:<br />
          <strong>every gathering, celebration, and milestone deserves to be experienced beautifully.</strong>
        </p>

        <p className="about-experience__paragraph">
          As an Emirati event management company, we create experiences that reflect culture, connection, and
          craftsmanship. Every event is thoughtfully designed to bring people together through creativity,
          precision, and genuine hospitality.
        </p>

        <p className="about-experience__paragraph">
          Whether it&apos;s an intimate family celebration or a large-scale corporate event, we approach every project
          with the same dedication to excellence, ensuring every detail contributes to an unforgettable experience.
        </p>
      </div>
    </section>
    <hr className="about-experience-divider" />

    {/* ── We Build More Than Events ── */}
    <section className="about-build">
      <div className="about-build__images">
        <div className="about-build__img-wrap about-build__img-wrap--tall">
          <Image src={build1} alt="Gala event" fill className="about-build__img" sizes="(max-width: 767px) 45vw, 22vw" />
        </div>
        <div className="about-build__img-wrap">
          <Image src={build2} alt="Light and shadow" fill className="about-build__img" sizes="(max-width: 767px) 45vw, 22vw" />
        </div>
        <div className="about-build__img-wrap">
          <Image src={build3} alt="Nature detail" fill className="about-build__img" sizes="(max-width: 767px) 45vw, 22vw" />
        </div>
      </div>

      <div className="about-build__content">
        <h2 className="about-build__heading">We Build More Than Events</h2>
        <p className="about-build__paragraph">
          We build memories.<br />
          We build relationships.<br />
          We build moments that people remember long after the lights go out. Every celebration tells a story, and our role is to bring that story to life
          through thoughtful planning, elegant design, and flawless execution.
        </p>
        <p className="about-build__paragraph">
          
        </p>
      </div>
    </section>
    </>
  );
}
