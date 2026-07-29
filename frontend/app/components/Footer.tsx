import Image from 'next/image';
import footerBg from '../Images/footer/Footer.png';
import footerLogo from '../Images/footer/logo-footer.png';
import instaIcon from '../Images/insta.png';
import whatsappIcon from '../Images/whatsapp.png';
import '../styles/footer.css';

const services = ['Corporate Events', 'Private Events', 'Event Packages', 'Production & Design', 'Branding Services'];
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
              {services.map((s) => <li key={s}><a href="#" className="footer-link">{s}</a></li>)}
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
          <div className="footer-socials">
            <a href="#" className="footer-social-link" aria-label="Instagram">
              <Image src={instaIcon} alt="Instagram" width={24} height={24} className="footer-social-icon" />
            </a>
            <a href="#" className="footer-social-link" aria-label="WhatsApp">
              <Image src={whatsappIcon} alt="WhatsApp" width={24} height={24} className="footer-social-icon" />
            </a>
          </div>
          <p className="footer-copyright">© 2026 Al Tajwal</p>
        </div>

      </div>
    </footer>
  );
}
