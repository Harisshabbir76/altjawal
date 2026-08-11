import Image from 'next/image';
import footerBg from '../Images/footer/Footer.webp';
import footerLogo from '../Images/footer/logo-footer.webp';
import '../styles/footer.css';
import LanguageDropdown from './LanguageDropdown';

const services = [
  { label: 'Corporate Events',   href: '/main-services' },
  { label: 'Private Events',     href: '/main-services' },
  { label: 'Event Packages',     href: '/main-services' },
  { label: 'Production & Design', href: '/event-production' },
  { label: 'Branding Services',  href: '/branding-services' },
];
const quickLinks = [
  { label: 'Home',       href: '/' },
  { label: 'About Us',   href: '/about' },
  { label: 'FAQ',        href: '/faq' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Legal',      href: '/legal' },
];

export default function Footer() {
  return (
    <footer>

      {/* ── CTA Banner ── */}
      <section className="footer-cta">
        <div className="footer-cta-content">
          <h2 className="footer-cta-heading">Let&apos;s Create Something Unforgettable</h2>
          <p className="footer-cta-paragraph">
            Whether you&apos;re planning a corporate event, private celebration, or brand experience,
            we&apos;re ready to bring your vision to life.
          </p>
          <a href="/book" className="footer-cta-button">Book a Consultation</a>
        </div>
        <div className="footer-cta-img-wrap">
          <Image src={footerBg} alt="" fill className="footer-cta-img" sizes="45vw" />
        </div>
      </section>

      {/* ── Main Footer ── */}
      <div className="footer-main">

        {/* Logo */}
        <div className="footer-logo-wrap">
          <Image src={footerLogo} alt="Al Tajwal" width={90} height={75} className="footer-logo" />
        </div>

        {/* Three columns */}
        <div className="footer-columns">
          <div className="footer-col">
            <h4 className="footer-col-heading">Our Services</h4>
            <ul className="footer-col-list">
              {services.map((s) => <li key={s.href + s.label}><a href={s.href} className="footer-link">{s.label}</a></li>)}
            </ul>
          </div>

          <div className="footer-col">
            <p className="footer-about">
              AlTjawal is an Emirati event management company dedicated to creating exceptional
              experiences through thoughtful planning, creative design, and seamless execution.
              From corporate gatherings to private celebrations, we transform every vision into
              an unforgettable event.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-heading">Quick Links</h4>
            <ul className="footer-col-list">
              {quickLinks.map((l) => <li key={l.href}><a href={l.href} className="footer-link">{l.label}</a></li>)}
            </ul>
          </div>
        </div>

        {/* Socials + copyright */}
        <div className="footer-bottom">
          <LanguageDropdown />
          <div className="footer-socials">
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Instagram"
            >
              <svg className="footer-social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="WhatsApp"
            >
              <svg className="footer-social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
          </div>
          <p className="footer-copyright">© 2026 Al Tajwal</p>
        </div>

      </div>
    </footer>
  );
}
