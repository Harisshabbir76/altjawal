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

export default function CmsApplierEventProd() {
  const { lang } = useLang();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blocksMap, setBlocksMap] = useState<Record<string, any>>({});

  useEffect(() => {
    try { if (window !== window.top) return; } catch { return; }
    fetch('/api/cms/events')
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
      'ep-hero-heading':       '.ep-hero__heading',
      'ep-hero-para':          '.ep-hero__paragraph',
      'ep-creativity-heading': '.ep-creativity__heading',
      'ep-creativity-subtext': '.ep-creativity__subtext',
      'ep-creativity-para':    '.ep-creativity__paragraph',
      'ep-pd-heading':         '.ep-pd__card-heading',
      'ep-pd-text':            '.ep-pd__card-text',
      'ep-pd-services-label':  '.ep-pd__services-label',
      'ep-pd-btn':             '.ep-pd__btn',
      'ep-work-heading':       '.ep-work__heading',
      'ep-work-btn':           '.ep-work__btn',
    };
    for (const [key, sel] of Object.entries(single)) {
      const b = blocksMap[key]; if (!b) continue;
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) applyBlock(el, b, lang);
    }

    const multi: { sel: string; prefix: string }[] = [
      { sel: '.ep-pd__services-list li', prefix: 'ep-pd-item' },
      { sel: '.ep-work__step-label',     prefix: 'ep-step-label' },
      { sel: '.ep-work__step-desc',      prefix: 'ep-step-desc' },
    ];
    for (const { sel, prefix } of multi) {
      document.querySelectorAll(sel).forEach((el, i) => {
        const b = blocksMap[`${prefix}-${i + 1}`];
        if (b) applyBlock(el as HTMLElement, b, lang);
      });
    }

    const heroImg = document.querySelector('.ep-hero__img') as HTMLElement | null;
    if (heroImg && blocksMap['ep-hero-img']) applyImage(heroImg, blocksMap['ep-hero-img']);

    document.querySelectorAll('.ep-pd__img').forEach((el, i) => {
      const b = blocksMap[`ep-pd-img-${i + 1}`];
      if (b) applyImage(el as HTMLElement, b);
    });
    document.querySelectorAll('.ep-work__img').forEach((el, i) => {
      const b = blocksMap[`ep-work-img-${i + 1}`];
      if (b) applyImage(el as HTMLElement, b);
    });
  }, [blocksMap, lang]);

  return null;
}
