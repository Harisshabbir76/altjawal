'use client';

import { useEffect, useState } from 'react';
import { useLang } from '../lib/LanguageContext';

const SINGLE_SELECTORS: Record<string, string> = {
  'page_hero_heading':  '.aboutus-hero__heading',
  'page_hero_subtext':  '.aboutus-hero__paragraph',
  'story_heading':      '.about-experience__heading',
  'mission_heading':    '.about-build__heading',
  'vision_heading':     '.about-inspired__heading',
  'values_heading':     '.about-guide__heading',
  'team_heading':       '.about-founder__name',
  'about-stats-heading':'.about-founder-stats .experience-heading',
};

const SINGLE_IMAGE_SELECTORS: Record<string, string> = {
  'page_hero_background': '.aboutus-hero__bg-img',
  'story_image':          '.about-experience__img',
  'about-inspired-img':   '.about-inspired__img',
  'about-founder-img':    '.about-founder__img',
};

const MULTI_SELECTORS: { selector: string; keyPrefix: string }[] = [
  { selector: '.about-experience__paragraph',           keyPrefix: 'about-exp-para' },
  { selector: '.about-build__paragraph',                keyPrefix: 'about-build-para' },
  { selector: '.about-inspired__paragraph',             keyPrefix: 'about-inspired-para' },
  { selector: '.about-guide__item-title',               keyPrefix: 'about-guide-title' },
  { selector: '.about-guide__item-desc',                keyPrefix: 'about-guide-desc' },
  { selector: '.about-founder__paragraph',              keyPrefix: 'about-founder-para' },
  { selector: '.about-founder-stats .experience-value', keyPrefix: 'about-exp-value' },
  { selector: '.about-founder-stats .experience-label', keyPrefix: 'about-exp-label' },
];

const MULTI_IMAGE_SELECTORS: { selector: string; keyPrefix: string }[] = [
  { selector: '.about-build__img',  keyPrefix: 'about-build-img' },
  { selector: '.about-guide__img',  keyPrefix: 'about-guide-img' },
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
  function f(key: string): string {
    if (lang === 'ar') {
      const arVal = block[key + 'Ar'];
      if (arVal) return arVal;
    }
    return block[key] || '';
  }

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

export default function CmsApplierAbout() {
  const { lang } = useLang();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blocksMap, setBlocksMap] = useState<Record<string, any>>({});

  useEffect(() => {
    try { if (window !== window.top) return; } catch { return; }

    fetch('/api/cms/about')
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
