'use client';

import { useEffect, useState } from 'react';
import { useLang } from '../lib/LanguageContext';

function addPx(v: string): string {
  if (!v) return '';
  return /^-?\d+(\.\d+)?$/.test(v.trim()) ? v + 'px' : v;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyImage(el: HTMLElement, b: Record<string, any>) {
  if (b.image && el instanceof HTMLImageElement) {
    el.srcset = '';
    el.src = b.image;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyBlock(el: HTMLElement, b: Record<string, any>, lang: 'en' | 'ar') {
  function f(key: string): string {
    if (lang === 'ar') { const v = b[key + 'Ar']; if (v) return v; }
    return b[key] || '';
  }
  const content = lang === 'ar' ? (b.contentAr || '') : (b.content || '');
  if (content) el.innerHTML = content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  const s = el.style;
  if (f('fontFamily'))     s.fontFamily     = f('fontFamily');
  if (f('fontSize'))       s.fontSize       = f('fontSize');
  if (f('fontWeight'))     s.fontWeight     = f('fontWeight');
  if (f('fontStyle'))      s.fontStyle      = f('fontStyle');
  if (f('textDecoration')) s.textDecoration = f('textDecoration');
  if (f('textColor'))      s.color          = f('textColor');
  if (f('lineHeight'))     s.lineHeight     = f('lineHeight');
  if (f('letterSpacing'))  s.letterSpacing  = f('letterSpacing');
  if (f('textAlign'))      s.textAlign      = f('textAlign');
  if (f('marginTop'))      s.marginTop      = addPx(f('marginTop'));
  if (f('marginRight'))    s.marginRight    = addPx(f('marginRight'));
  if (f('marginBottom'))   s.marginBottom   = addPx(f('marginBottom'));
  if (f('marginLeft'))     s.marginLeft     = addPx(f('marginLeft'));
  if (f('paddingTop'))     s.paddingTop     = addPx(f('paddingTop'));
  if (f('paddingRight'))   s.paddingRight   = addPx(f('paddingRight'));
  if (f('paddingBottom'))  s.paddingBottom  = addPx(f('paddingBottom'));
  if (f('paddingLeft'))    s.paddingLeft    = addPx(f('paddingLeft'));
  if (f('width'))          s.width          = f('width');
  if (f('minHeight'))      s.minHeight      = f('minHeight');
  if (f('maxWidth'))       s.maxWidth       = f('maxWidth');
  if (f('maxHeight'))      s.maxHeight      = f('maxHeight');
}

export default function CmsApplierMainServices() {
  const { lang } = useLang();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blocksMap, setBlocksMap] = useState<Record<string, any>>({});

  useEffect(() => {
    try { if (window !== window.top) return; } catch { return; }
    fetch('/api/cms/services')
      .then((r) => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arr: Record<string, any>[] = Array.isArray(data) ? data : (data.blocks ?? []);
        setBlocksMap(Object.fromEntries(arr.map((b) => [b.blockKey, b])));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (Object.keys(blocksMap).length === 0) return;

    const single: Record<string, string> = {
      'ms-hero-heading':    '.ms-hero__heading',
      'ms-hero-para':       '.ms-hero__paragraph',
      'ms-events-heading':  '.ms-events__heading',
      'ms-pkg-heading':     '.ms-packages__heading',
      'ms-pkg-subtext':     '.ms-packages__subtext',
      'ms-pkg-label-1':     '.ms-pkg-label-1',
      'ms-pkg-label-2':     '.ms-pkg-label-2',
      'ms-pkg-label-3':     '.ms-pkg-label-3',
      'ms-pkg-tagline-1':   '.ms-pkg-tagline-1',
      'ms-pkg-tagline-2':   '.ms-pkg-tagline-2',
      'ms-pkg-tagline-3':   '.ms-pkg-tagline-3',
      'ms-pkg-btn-1':       '.ms-pkg-btn-1',
      'ms-pkg-btn-2':       '.ms-pkg-btn-2',
      'ms-pkg-btn-3':       '.ms-pkg-btn-3',
      'ms-services-label-1':'.ms-services-label-1',
      'ms-services-label-2':'.ms-services-label-2',
    };
    for (const [key, sel] of Object.entries(single)) {
      const b = blocksMap[key]; if (!b) continue;
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) applyBlock(el, b, lang);
    }

    const multi: { sel: string; prefix: string }[] = [
      { sel: '.ms-events__paragraph',    prefix: 'ms-events-para' },
      { sel: '.ms-events__card-heading', prefix: 'ms-card-heading' },
      { sel: '.ms-events__card-text',    prefix: 'ms-card-text' },
      { sel: '.ms-events__btn',          prefix: 'ms-events-btn' },
      { sel: '.ms-services-list-1 li',   prefix: 'ms-corp-item' },
      { sel: '.ms-services-list-2 li',   prefix: 'ms-priv-item' },
      { sel: '.ms-pkg-items-1 li',       prefix: 'ms-pkg-1-item' },
      { sel: '.ms-pkg-items-2 li',       prefix: 'ms-pkg-2-item' },
      { sel: '.ms-pkg-items-3 li',       prefix: 'ms-pkg-3-item' },
    ];
    for (const { sel, prefix } of multi) {
      document.querySelectorAll(sel).forEach((el, i) => {
        const b = blocksMap[`${prefix}-${i + 1}`];
        if (b) applyBlock(el as HTMLElement, b, lang);
      });
    }

    const singleImgs: Record<string, string> = {
      'ms-hero-img': '.ms-hero__img',
      'ms-pkg-img':  '.ms-packages__img',
    };
    for (const [key, sel] of Object.entries(singleImgs)) {
      const b = blocksMap[key]; if (!b) continue;
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) applyImage(el, b);
    }

    document.querySelectorAll('.ms-events__img').forEach((el, i) => {
      const b = blocksMap[`ms-events-img-${i + 1}`];
      if (b) applyImage(el as HTMLElement, b);
    });
  }, [blocksMap, lang]);

  return null;
}
