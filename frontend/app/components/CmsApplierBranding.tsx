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

export default function CmsApplierBranding() {
  const { lang } = useLang();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blocksMap, setBlocksMap] = useState<Record<string, any>>({});

  useEffect(() => {
    try { if (window !== window.top) return; } catch { return; }
    fetch('/api/cms/branding')
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
      'bs-hero-heading':     '.bs-hero__heading',
      'bs-hero-para':        '.bs-hero__paragraph',
      'bs-logo-heading':     '.bs-logo__heading',
      'bs-logo-subtext':     '.bs-logo__subtext',
      'bs-logo-para':        '.bs-logo__paragraph',
      'bs-branding-heading': '.bs-branding__heading',
      'bs-branding-para':    '.bs-branding__paragraph',
      'bs-branding-btn':     '.bs-branding__btn',
      'bs-pkg-label-1':      '.bs-pkg-label-1',
      'bs-pkg-label-2':      '.bs-pkg-label-2',
      'bs-pkg-btn-1':        '.bs-pkg-btn-1',
      'bs-pkg-btn-2':        '.bs-pkg-btn-2',
    };
    for (const [key, sel] of Object.entries(single)) {
      const b = blocksMap[key]; if (!b) continue;
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) applyBlock(el, b, lang);
    }

    const multi: { sel: string; prefix: string }[] = [
      { sel: '.bs-pkg-items-1 li', prefix: 'bs-pkg-1-item' },
      { sel: '.bs-pkg-items-2 li', prefix: 'bs-pkg-2-item' },
    ];
    for (const { sel, prefix } of multi) {
      document.querySelectorAll(sel).forEach((el, i) => {
        const b = blocksMap[`${prefix}-${i + 1}`];
        if (b) applyBlock(el as HTMLElement, b, lang);
      });
    }

    const singleImgs: { key: string; containerSel: string; imgSel: string }[] = [
      { key: 'bs-hero-img',   containerSel: '.bs-hero__image-wrap',      imgSel: '.bs-hero__img' },
      { key: 'bs-model-img',  containerSel: '.bs-logo__model-wrap',      imgSel: '.bs-logo__model-img' },
      { key: 'bs-girl-img',   containerSel: '.bs-branding__girl-wrap',   imgSel: '.bs-branding__img' },
      { key: 'bs-window-img', containerSel: '.bs-branding__window-wrap', imgSel: '.bs-branding__img' },
    ];
    for (const { key, containerSel, imgSel } of singleImgs) {
      const b = blocksMap[key]; if (!b) continue;
      const container = document.querySelector(containerSel);
      const imgEl = container?.querySelector(imgSel) as HTMLElement | null;
      if (imgEl) applyImage(imgEl, b);
    }
  }, [blocksMap, lang]);

  return null;
}
