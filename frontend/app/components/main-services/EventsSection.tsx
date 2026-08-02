import Image from 'next/image';
import left1 from '../../Images/main-services/left1.webp';
import left2 from '../../Images/main-services/left2.webp';
import right1 from '../../Images/main-services/right1.webp';
import right2 from '../../Images/main-services/right2.webp';
import '../../styles/main-services/eventssection.css';

export default function EventsSection() {
  return (
    <section className="ms-events">
      {/* ── Intro ── */}
      <div className="ms-events__intro">
        <h2 className="ms-events__heading">Every Event Has A Story.</h2>
        <p className="ms-events__paragraph">
          At AlTjawal, we believe every occasion deserves careful planning and meaningful execution.
          Whether you&apos;re celebrating a personal milestone or hosting a corporate event, our team manages
          every detail with creativity, precision, and authentic Emirati hospitality.
        </p>
        <p className="ms-events__paragraph">
          From concept development to on-site coordination, we ensure every moment unfolds effortlessly.
        </p>
      </div>

      {/* ── Corporate Events ── */}
      <div className="ms-events__block">
        <div className="ms-events__img-wrap">
          <Image src={left1} alt="Corporate event" fill className="ms-events__img" sizes="30vw" />
        </div>

        <div className="ms-events__card">
          <h3 className="ms-events__card-heading">Corporate Events</h3>
          <p className="ms-events__card-text">
            We deliver professional event solutions tailored to businesses and organizations, ensuring
            seamless planning and flawless execution. From conferences, seminars, and product launches
            to corporate gatherings, networking events, and exhibition support, we manage every detail
            to create impactful and memorable experiences.
          </p>
          <p className="ms-events__services-label ms-services-label-1">Services:</p>
          <ul className="ms-events__services-list ms-services-list-1">
            <li>Conferences &amp; Seminars</li>
            <li>Product Launches</li>
            <li>Corporate Gatherings</li>
            <li>Networking Events</li>
            <li>Executive Meetings</li>
            <li>Team Building Activities</li>
            <li>Employee Recognition Events</li>
            <li>Exhibition Support</li>
          </ul>
          <a href="/book" className="ms-events__btn">Book Now</a>
        </div>

        <div className="ms-events__img-wrap">
          <Image src={right1} alt="Corporate event venue" fill className="ms-events__img" sizes="30vw" />
        </div>
      </div>

      {/* ── Private Celebrations ── */}
      <div className="ms-events__block">
        <div className="ms-events__img-wrap">
          <Image src={left2} alt="Private celebration" fill className="ms-events__img" sizes="30vw" />
        </div>

        <div className="ms-events__card">
          <h3 className="ms-events__card-heading">Private Celebrations</h3>
          <p className="ms-events__card-text">
            We create unforgettable celebrations tailored to life&apos;s most special moments. From
            weddings, engagements, and graduation parties to birthdays, family gatherings, proposal
            setups, luxury picnics, and other special occasions, our team ensures every detail is
            thoughtfully planned and beautifully executed.
          </p>
          <p className="ms-events__services-label ms-services-label-2">Services:</p>
          <ul className="ms-events__services-list ms-services-list-2">
            <li>Weddings</li>
            <li>Engagements</li>
            <li>Birthday Celebrations</li>
            <li>Graduation Parties</li>
            <li>Family Gatherings</li>
            <li>Proposal Setups</li>
            <li>Luxury Picnics</li>
            <li>Special Occasions</li>
          </ul>
          <a href="/book" className="ms-events__btn">Book Now</a>
        </div>

        <div className="ms-events__img-wrap">
          <Image src={right2} alt="Private celebration" fill className="ms-events__img" sizes="30vw" />
        </div>
      </div>
    </section>
  );
}
