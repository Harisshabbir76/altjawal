import '../../styles/event-production/marqueesection.css';

const words = [
  'Elegant', 'Bespoke', 'Timeless', 'Refined', 'Creative', 'Memorable',
  'Exceptional', 'Sophisticated', 'Seamless', 'Luxurious', 'Inspiring',
  'Distinctive', 'Authentic', 'Purposeful', 'Innovative', 'Premium',
  'Curated', 'Exclusive', 'Visionary',
];

const dot = <span className="ep-marquee__dot">•</span>;

export default function EPMarqueeSection() {
  return (
    <div className="ep-marquee" aria-hidden="true">
      <div className="ep-marquee__track">
        {[...words, ...words].map((word, i) => (
          <span className="ep-marquee__item" key={i}>
            {word}{dot}
          </span>
        ))}
      </div>
    </div>
  );
}
