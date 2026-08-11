'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import LanguageApplier from './LanguageApplier';
import { LanguageProvider } from '../lib/LanguageContext';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [inFrame, setInFrame] = useState(false);

  useEffect(() => {
    try {
      setInFrame(window.self !== window.top);
    } catch {
      setInFrame(true);
    }
  }, []);

  const isDashboard = pathname.startsWith('/altjawal/admin-panel/dashboard');

  if (isDashboard) return <>{children}</>;

  if (inFrame) {
    return (
      <LanguageProvider>
        <LanguageApplier />
        {children}
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <Navbar />
      <LanguageApplier />
      {children}
      <Footer />
    </LanguageProvider>
  );
}
