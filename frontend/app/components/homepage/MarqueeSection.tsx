import '../../styles/homepage/marqueesection.css';

const words = [
  'Elegant', 'Bespoke', 'Timeless', 'Refined', 'Creative', 'Memorable',
  'Exceptional', 'Sophisticated', 'Seamless', 'Luxurious', 'Inspiring',
  'Distinctive', 'Authentic', 'Purposeful', 'Innovative', 'Premium',
  'Curated', 'Exclusive', 'Visionary',
];

const separator = <span className="marquee-dot">•</span>;

export default function MarqueeSection() {
  return (
    <div className="marquee-section" aria-hidden="true">
      <div className="marquee-track">
        {/* Duplicated for seamless loop */}
        {[...words, ...words].map((word, i) => (
          <span className="marquee-item" key={i}>
            {word}{separator}
          </span>
        ))}
      </div>
    </div>
  );
}
