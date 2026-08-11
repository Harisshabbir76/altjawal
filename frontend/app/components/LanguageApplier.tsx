'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLang, Lang } from '../lib/LanguageContext';
import { SINGLE_TRANS, MULTI_TRANS } from '../lib/translations';

function applyText(el: HTMLElement, text: string) {
  el.innerHTML = text.replace(/\n/g, '<br>');
}

export default function LanguageApplier() {
  const { lang, setLang } = useLang();
  const pathname = usePathname();

  useEffect(() => {
    for (const t of SINGLE_TRANS) {
      const el = document.querySelector(t.selector) as HTMLElement | null;
      if (el) applyText(el, lang === 'ar' ? t.ar : t.en);
    }
    for (const t of MULTI_TRANS) {
      const els = document.querySelectorAll(t.selector);
      t.items.forEach((item, i) => {
        const el = els[i] as HTMLElement | undefined;
        if (el) applyText(el, lang === 'ar' ? item.ar : item.en);
      });
    }
  }, [lang, pathname]);

  // Listen for language switch messages from the CMS parent (admin iframe)
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type === 'CMS_SET_LANG') {
        setLang(e.data.lang as Lang);
      }
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [setLang]);

  return null;
}
