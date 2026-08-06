'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../Images/logo.svg';
import blueLogo from '../Images/blue-logo.webp';
import '../styles/navbar.css';

export default function Navbar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [sidebarServicesOpen, setSidebarServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  function closeSidebar() {
    setSidebarOpen(false);
    setSidebarServicesOpen(false);
  }

  return (
    <>
      <nav className={`navbar${pathname === '/contact' || pathname === '/legal' || pathname === '/main-services' || pathname === '/event-production' || pathname === '/branding-services' || pathname === '/book' ? ' navbar--bordered' : ''}${pathname === '/legal' || pathname === '/main-services' || pathname === '/event-production' || pathname === '/branding-services' ? ' navbar--dark' : ''}`}>
        <div className="navbar-inner">
          {/* Mobile: hamburger (left) */}
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <span />
            <span />
            <span />
          </button>

          {/* Desktop left links */}
          <div className="nav-left">
            <Link href="/about" className="nav-link">About</Link>

            <div className="nav-dropdown" ref={dropdownRef}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className="nav-link dropdown-toggle"
                onClick={() => setServicesOpen((prev) => !prev)}
                aria-expanded={servicesOpen}
              >
                Services{' '}
                <span className={`dropdown-arrow${servicesOpen ? ' open' : ''}`}>▾</span>
              </button>

              {servicesOpen && (
                <div className="dropdown-menu" role="menu">
                  <Link href="main-services" className="dropdown-item" onClick={() => setServicesOpen(false)}>Main Services</Link>
                  <Link href="event-production" className="dropdown-item" onClick={() => setServicesOpen(false)}>Event Production</Link>
                  <Link href="branding-services" className="dropdown-item" onClick={() => setServicesOpen(false)}>Branding Services</Link>
                </div>
              )}
            </div>
          </div>

          {/* Center logo */}
          <div className="nav-logo">
            <Link href="/">
              <Image
                src={pathname === '/legal' || pathname === '/main-services' || pathname === '/event-production' || pathname === '/branding-services' ? blueLogo : logo}
                alt="Al Tajwal"
                className="nav-logo-img"
                priority
                unoptimized
              />
            </Link>
          </div>

          {/* Desktop right links */}
          <div className="nav-right">
            <Link href="/contact" className="nav-link">Contact Us</Link>
            <Link href="/book" className="nav-link book-now">Book Now</Link>
          </div>

          {/* Mobile: Book Now (right) */}
          <Link href="/book" className="mobile-book-now">Book Now</Link>
        </div>
      </nav>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <button className="sidebar-close" onClick={closeSidebar} aria-label="Close menu">
              ✕
            </button>

            <nav className="sidebar-nav">
              <Link href="/about" className="sidebar-link" onClick={closeSidebar}>
                About
              </Link>

              <div>
                <button
                  className="sidebar-link"
                  onClick={() => setSidebarServicesOpen((prev) => !prev)}
                  aria-expanded={sidebarServicesOpen}
                >
                  Services{' '}
                  <span className={`dropdown-arrow${sidebarServicesOpen ? ' open' : ''}`}>▾</span>
                </button>

                {sidebarServicesOpen && (
                  <div className="sidebar-dropdown-menu">
                    <Link href="main-services" className="sidebar-dropdown-item" onClick={closeSidebar}>Main Services</Link>
                    <Link href="event-production" className="sidebar-dropdown-item" onClick={closeSidebar}>Event Production</Link>
                    <Link href="branding-services" className="sidebar-dropdown-item" onClick={closeSidebar}>Branding Services</Link>
                  </div>
                )}
              </div>

              <Link href="/contact" className="sidebar-link" onClick={closeSidebar}>
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
