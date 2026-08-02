'use client';

import { useState } from 'react';
import Image from 'next/image';
import modelImg from '../../Images/branding services/model.jpg';
import '../../styles/branding-services/logosection.css';

const packages = [
  {
    id: 'launch',
    name: 'BRAND LAUNCH PACKAGE',
    items: [
      'Brand Strategy',
      'Primary Logo',
      'Secondary Logo',
      'Color Palette',
      'Typography Selection',
      'Social Media Guidelines',
      'Brand Guidelines Document',
      'Business Card Design',
    ],
  },
  {
    id: 'makeover',
    name: 'BRAND MAKEOVER PACKAGE',
    items: [
      'Brand Audit & Strategy',
      'Logo Redesign',
      'Updated Color Palette',
      'New Typography System',
      'Refreshed Brand Assets',
      'Brand Guidelines Update',
    ],
  },
];

export default function LogoSection() {
  const [active, setActive] = useState('');

  return (
    <section className="bs-logo">
      {/* ── Intro ── */}
      <div className="bs-logo__content">
        <h2 className="bs-logo__heading">More Than A Logo</h2>
        <p className="bs-logo__subtext">Your brand is the first impression people remember.</p>
        <p className="bs-logo__paragraph">
          At AlTjawal, we create cohesive brand identities that communicate your values, connect with your
          audience, and help your business grow with confidence.
        </p>
      </div>

      {/* ── Packages + model image ── */}
      <div className="bs-logo__packages">
        <div className="bs-logo__accordion">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bs-logo__pkg-item">
              <div className="bs-logo__pkg-divider" />
              <button
                className="bs-logo__pkg-header"
                onClick={() => setActive(active === pkg.id ? '' : pkg.id)}
              >
                <span className="bs-logo__pkg-label">{pkg.name}</span>
              </button>

              {active === pkg.id && (
                <div className="bs-logo__pkg-body">
                  <ul className="bs-logo__pkg-list">
                    {pkg.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  <a href="/book" className="bs-logo__pkg-btn">Book Now</a>
                </div>
              )}
            </div>
          ))}
          <div className="bs-logo__pkg-divider" />
        </div>

        <div className="bs-logo__model-wrap">
          <Image
            src={modelImg}
            alt="Brand identity model"
            fill
            className="bs-logo__model-img"
            sizes="40vw"
          />
        </div>
      </div>
    </section>
  );
}
