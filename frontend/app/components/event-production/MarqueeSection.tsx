'use client';

import '../../styles/event-production/marqueesection.css';
import { useLang } from '../../lib/LanguageContext';

const WORDS: { en: string; ar: string }[] = [
  { en: 'Elegant',       ar: 'أنيق' },
  { en: 'Bespoke',       ar: 'مخصص' },
  { en: 'Timeless',      ar: 'خالد' },
  { en: 'Refined',       ar: 'راقٍ' },
  { en: 'Creative',      ar: 'إبداعي' },
  { en: 'Memorable',     ar: 'لا يُنسى' },
  { en: 'Exceptional',   ar: 'استثنائي' },
  { en: 'Sophisticated', ar: 'متطور' },
  { en: 'Seamless',      ar: 'سلس' },
  { en: 'Luxurious',     ar: 'فاخر' },
  { en: 'Inspiring',     ar: 'ملهم' },
  { en: 'Distinctive',   ar: 'مميز' },
  { en: 'Authentic',     ar: 'أصيل' },
  { en: 'Purposeful',    ar: 'هادف' },
  { en: 'Innovative',    ar: 'مبتكر' },
  { en: 'Premium',       ar: 'متميز' },
  { en: 'Curated',       ar: 'منتقى' },
  { en: 'Exclusive',     ar: 'حصري' },
  { en: 'Visionary',     ar: 'رؤيوي' },
];

const dot = <span className="ep-marquee__dot">•</span>;

export default function EPMarqueeSection() {
  const { lang } = useLang();
  const words = WORDS.map((w) => lang === 'ar' ? w.ar : w.en);

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
