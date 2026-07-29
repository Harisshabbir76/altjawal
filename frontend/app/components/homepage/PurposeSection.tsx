import Image from 'next/image';
import leaves from '../../Images/homepage/leaves.png';
import topview from '../../Images/homepage/topview.png';
import '../../styles/homepage/purposesection.css';

export default function PurposeSection() {
  return (
    <section className="purpose-section">

      {/* ── Top: Events with Purpose ── */}
      <div className="purpose-top">
        <div className="purpose-image-stack">
          <div className="purpose-image-backing" />
          <div className="purpose-img-wrap">
            <Image
              src={leaves}
              alt="Hand holding a leaf in dappled light"
              fill
              className="purpose-leaves-img"
              sizes="(max-width: 767px) 80vw, 42vw"
            />
          </div>
        </div>

        <div className="purpose-content">
          <h2 className="purpose-heading">Events with Purpose</h2>
          <p className="purpose-paragraph">
            Sustainability is part of every event we create. We prioritize reusable
            structures, recyclable materials, and responsible planning practices
            that reduce waste while supporting the UAE&apos;s vision for a more
            sustainable future.
          </p>
        </div>
      </div>

      {/* ── Bottom: Quote + Topview ── */}
      <div className="purpose-bottom">
        <p className="purpose-quote">
          &ldquo;Every celebration deserves thoughtful planning, meaningful details,
          and an experience your guests will never forget.&rdquo;
        </p>

        <div className="purpose-topview-frame">
          <div className="purpose-topview-wrap">
            <Image
              src={topview}
              alt="Top view of an elegant seating arrangement"
              fill
              className="purpose-topview-img"
              sizes="(max-width: 767px) 80vw, 45vw"
            />
          </div>
        </div>
      </div>

    </section>
  );
}
