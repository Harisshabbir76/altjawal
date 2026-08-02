'use client';

import { useState } from 'react';
import Image from 'next/image';
import walkingImg from '../../Images/main-services/walking.jpg';
import '../../styles/main-services/packagesection.css';

const packages = [
  {
    id: '01',
    name: 'BASIC',
    tagline: 'Perfect for intimate gatherings',
    items: [
      'Up to 80 Guests',
      'Basic Theme Design',
      'Event Day Supervision',
      'Post-Event Summary Report',
    ],
  },
  {
    id: '02',
    name: 'STANDARD',
    tagline: 'Ideal for mid-size events',
    items: [
      'Up to 150 Guests',
      'Custom Theme & Décor',
      'Full-Day Coordination',
      'Vendor Management',
      'Photography Coverage',
      'Post-Event Summary Report',
    ],
  },
  {
    id: '03',
    name: 'PREMIUM',
    tagline: 'The complete luxury experience',
    items: [
      'Unlimited Guests',
      'Bespoke Theme & Design',
      'Dedicated Event Manager',
      'Full Vendor Coordination',
      'Luxury Décor Package',
      'Photography & Videography',
      'Post-Event Summary Report',
    ],
  },
];

export default function PackageSection() {
  const [active, setActive] = useState('');

  return (
    <section className="ms-packages">
      <div className="ms-packages__header">
        <h2 className="ms-packages__heading">Packages Designed Around Your Needs</h2>
        <p className="ms-packages__subtext">
          Every event is unique. Our flexible packages provide the perfect foundation, whether you&apos;re planning
          an intimate gathering or a large-scale production.
        </p>
      </div>

      <div className="ms-packages__content">
        {/* ── Accordion ── */}
        <div className="ms-packages__accordion">
          {packages.map((pkg) => (
            <div key={pkg.id} className="ms-packages__item">
              <div className="ms-packages__divider" />
              <button
                className="ms-packages__item-header"
                onClick={() => setActive(active === pkg.id ? '' : pkg.id)}
              >
                <span className="ms-packages__item-label">{pkg.id}. {pkg.name}</span>
              </button>

              {active === pkg.id && (
                <div className="ms-packages__item-body">
                  <p className="ms-packages__item-tagline">{pkg.tagline}</p>
                  <ul className="ms-packages__item-list">
                    {pkg.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  <a href="/book" className="ms-packages__btn">Book Now</a>
                </div>
              )}
            </div>
          ))}
          <div className="ms-packages__divider" />
        </div>

        {/* ── Image ── */}
        <div className="ms-packages__img-wrap">
          <Image
            src={walkingImg}
            alt="Event experience"
            fill
            className="ms-packages__img"
            sizes="50vw"
          />
        </div>
      </div>
    </section>
  );
}
