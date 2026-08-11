'use client';

import { useEffect, useState } from 'react';
import { useLang } from '../lib/LanguageContext';

const SINGLE_SELECTORS: Record<string, string> = {
  'hero-heading':      '.hero-heading',
  'hero-paragraph':    '.hero-paragraph',
  'hero-button':       '.hero-button',
  'vision-heading':    '.vision-heading',
  'vision-paragraph':  '.vision-paragraph',
  'vision-button':     '.vision-button',
  'tradition-heading': '.tradition-heading',
  'tradition-button':  '.tradition-button',
  'services-heading':  '.services-heading',
  'services-para':     '.services-paragraph',
  'chooseus-heading':  '.chooseus-heading',
  'exp-heading':       '.experience-heading',
  'purpose-heading':   '.purpose-heading',
  'purpose-para':      '.purpose-paragraph',
  'purpose-quote':     '.purpose-quote',
};

const SINGLE_IMAGE_SELECTORS: Record<string, string> = {
  'hero-image':          '.hero-image',
  'tradition-img':       '.tradition-img',
  'chooseus-left-img':   '.chooseus-left-img',
  'chooseus-right-img':  '.chooseus-right-img',
  'purpose-leaves-img':  '.purpose-leaves-img',
  'purpose-topview-img': '.purpose-topview-img',
  'services-frame-img':  '.services-frame-img',
};

const MULTI_SELECTORS: { selector: string; keyPrefix: string }[] = [
  { selector: '.tradition-paragraph', keyPrefix: 'tradition-para' },
  { selector: '.chooseus-item',       keyPrefix: 'chooseus-bullet' },
  { selector: '.experience-value',    keyPrefix: 'exp-value' },
  { selector: '.experience-label',    keyPrefix: 'exp-label' },
  { selector: '.service-label',       keyPrefix: 'service-label' },
];

const MULTI_IMAGE_SELECTORS: { selector: string; keyPrefix: string }[] = [
  { selector: '.vision-img',  keyPrefix: 'vision-img' },
  { selector: '.service-img', keyPrefix: 'service-img' },
];

function addPx(v: string): string {
  if (!v) return '';
  return /^-?\d+(\.\d+)?$/.test(v.trim()) ? v + 'px' : v;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyImageBlock(el: HTMLElement, block: Record<string, any>) {
  if (block.image && el instanceof HTMLImageElement) {
    el.srcset = '';
    el.src = block.image;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyBlock(el: HTMLElement, block: Record<string, any>, lang: 'en' | 'ar') {
  // For styles: prefer Arabic version if set, fall back to English
  function f(key: string): string {
    if (lang === 'ar') {
      const arVal = block[key + 'Ar'];
      if (arVal) return arVal;
    }
    return block[key] || '';
  }

  // For content: in Arabic mode only apply if contentAr is explicitly saved;
  // otherwise LanguageApplier handles the Arabic text from translations.ts
  const content = lang === 'ar' ? (block.contentAr || '') : (block.content || '');
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

export default function CmsApplier() {
  const { lang } = useLang();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blocksMap, setBlocksMap] = useState<Record<string, any>>({});

  // Fetch blocks once on mount
  useEffect(() => {
    try { if (window !== window.top) return; } catch { return; }

    fetch('/api/cms/home')
      .then((r) => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arr: Record<string, any>[] = Array.isArray(data) ? data : (data.blocks ?? []);
        setBlocksMap(Object.fromEntries(arr.map((b) => [b.blockKey, b])));
      })
      .catch(() => {});
  }, []);

  // Re-apply to DOM whenever blocks or language changes
  useEffect(() => {
    if (Object.keys(blocksMap).length === 0) return;

    for (const [blockKey, selector] of Object.entries(SINGLE_SELECTORS)) {
      const block = blocksMap[blockKey];
      if (!block) continue;
      const el = document.querySelector(selector) as HTMLElement | null;
      if (el) applyBlock(el, block, lang);
    }

    for (const { selector, keyPrefix } of MULTI_SELECTORS) {
      document.querySelectorAll(selector).forEach((el, i) => {
        const block = blocksMap[`${keyPrefix}-${i + 1}`];
        if (block) applyBlock(el as HTMLElement, block, lang);
      });
    }

    for (const [blockKey, selector] of Object.entries(SINGLE_IMAGE_SELECTORS)) {
      const block = blocksMap[blockKey];
      if (!block) continue;
      const el = document.querySelector(selector) as HTMLElement | null;
      if (el) applyImageBlock(el, block);
    }

    for (const { selector, keyPrefix } of MULTI_IMAGE_SELECTORS) {
      document.querySelectorAll(selector).forEach((el, i) => {
        const block = blocksMap[`${keyPrefix}-${i + 1}`];
        if (block) applyImageBlock(el as HTMLElement, block);
      });
    }
  }, [blocksMap, lang]);

  return null;
}
