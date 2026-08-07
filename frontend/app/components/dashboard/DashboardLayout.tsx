'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/dashApi';
import '../../styles/dashboard/dashboard.css';

const PAGE_KEYS = ['home', 'about', 'services', 'branding', 'events', 'contact', 'faq', 'legal'];

const PAGE_ITEMS = [
  { href: '/altjawal/admin-panel/dashboard/home',      icon: 'fa-house',           label: 'Home',              key: 'home'      },
  { href: '/altjawal/admin-panel/dashboard/about',     icon: 'fa-circle-info',     label: 'About Us',          key: 'about'     },
  { href: '/altjawal/admin-panel/dashboard/services',  icon: 'fa-concierge-bell',  label: 'Main Services',     key: 'services'  },
  { href: '/altjawal/admin-panel/dashboard/branding',  icon: 'fa-palette',         label: 'Branding Services', key: 'branding'  },
  { href: '/altjawal/admin-panel/dashboard/events',    icon: 'fa-film',            label: 'Event Production',  key: 'events'    },
  { href: '/altjawal/admin-panel/dashboard/contact',   icon: 'fa-envelope',        label: 'Contact Page',      key: 'contact'   },
  { href: '/altjawal/admin-panel/dashboard/faq',       icon: 'fa-circle-question', label: 'FAQ Page',          key: 'faq'       },
  { href: '/altjawal/admin-panel/dashboard/legal',     icon: 'fa-scale-balanced',  label: 'Legal',             key: 'legal'     },
];

export default function DashboardLayout({
  children,
  activePage,
}: {
  children: React.ReactNode;
  activePage: string;
}) {
  const [pagesOpen, setPagesOpen] = useState(() => PAGE_KEYS.includes(activePage));

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

    fetch('/api/admin/verify', {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => {
        clearTimeout(timeout);
        if (res.status === 401) window.location.href = '/altjawal/admin-panel/dashboard';
      })
      .catch(() => {
        clearTimeout(timeout);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  async function handleLogout() {
    await apiFetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/altjawal/admin-panel/dashboard';
  }

  return (
    <div className="db-scope db-layout">
      <aside className="db-sidebar">
        <div className="db-sidebar-brand">
          <p className="db-sidebar-brand-name">Al Tajwal</p>
          <p className="db-sidebar-title">Dashboard</p>
        </div>

        <nav className="db-nav">
          <Link
            href="/altjawal/admin-panel/dashboard/bookings"
            className={activePage === 'bookings' ? 'db-nav-active' : ''}
          >
            <i className="fa-solid fa-calendar-check" />
            Bookings
          </Link>

          <Link
            href="/altjawal/admin-panel/dashboard/messages"
            className={activePage === 'messages' ? 'db-nav-active' : ''}
          >
            <i className="fa-solid fa-inbox" />
            Messages
          </Link>

          <Link
            href="/altjawal/admin-panel/dashboard/calendar"
            className={activePage === 'calendar' ? 'db-nav-active' : ''}
          >
            <i className="fa-solid fa-calendar-days" />
            Calendar
          </Link>

          {/* Pages dropdown */}
          <div className="db-nav-group">
            <button
              className={`db-nav-group-toggle${PAGE_KEYS.includes(activePage) ? ' db-nav-group-toggle--active' : ''}`}
              onClick={() => setPagesOpen((o) => !o)}
            >
              <span className="db-nav-group-toggle-left">
                <i className="fa-solid fa-file" />
                Pages
              </span>
              <i className={`fa-solid fa-chevron-down db-nav-group-arrow${pagesOpen ? ' db-nav-group-arrow--open' : ''}`} />
            </button>

            {pagesOpen && (
              <div className="db-nav-group-items">
                {PAGE_ITEMS.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`db-nav-group-item${activePage === item.key ? ' db-nav-active' : ''}`}
                  >
                    <i className={`fa-solid ${item.icon}`} />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="db-sidebar-footer">
          <button className="db-logout" onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket" />
            Logout
          </button>
        </div>
      </aside>

      <main className="db-main">{children}</main>
    </div>
  );
}
