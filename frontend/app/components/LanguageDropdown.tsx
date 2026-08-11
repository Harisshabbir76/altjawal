'use client';

import { useState, useRef, useEffect } from 'react';
import { useLang, type Lang } from '../lib/LanguageContext';

const LANGUAGES: { code: Lang; native: string }[] = [
  { code: 'en', native: 'English' },
  { code: 'ar', native: 'العربية' },
];

export default function LanguageDropdown() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function select(code: Lang) {
    setLang(code);
    setOpen(false);
  }

  return (
    <div className="lang-drop" ref={ref}>
      <button
        className="lang-drop__trigger"
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg className="lang-drop__globe" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5"/>
          <ellipse cx="10" cy="10" rx="3.25" ry="8.25" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M3.5 6.5h13M3.5 13.5h13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 1.5"/>
        </svg>
        <span className="lang-drop__label">{lang.toUpperCase()}</span>
        <svg className={`lang-drop__chevron${open ? ' lang-drop__chevron--up' : ''}`} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <ul className="lang-drop__menu" role="listbox">
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                className={`lang-drop__option${lang === l.code ? ' lang-drop__option--active' : ''}`}
                role="option"
                aria-selected={lang === l.code}
                onClick={() => select(l.code)}
              >
                <span>{l.native}</span>
                {lang === l.code && (
                  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
