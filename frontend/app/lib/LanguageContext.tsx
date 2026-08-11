'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'en' | 'ar';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangCtx>({ lang: 'en', setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = (localStorage.getItem('lang') as Lang) ?? 'en';
    applyLang(stored);
    setLangState(stored);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('lang', l);
    applyLang(l);
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

function applyLang(l: Lang) {
  document.documentElement.lang = l;
}

export function useLang() { return useContext(LangContext); }
