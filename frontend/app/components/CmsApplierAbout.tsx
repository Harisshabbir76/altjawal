'use client';

import { useEffect } from 'react';

const SINGLE_SELECTORS: Record<string, string> = {
  'page_hero_heading': '.aboutus-hero__heading',
  'page_hero_subtext': '.aboutus-hero__paragraph',
  'story_heading':     '.about-experience__heading',
  'story_body':        '.about-experience__paragraph',
  'mission_heading':   '.about-build__heading',
  'mission_body':      '.about-build__paragraph',
  'vision_heading':    '.about-inspired__heading',
  'vision_body':       '.about-inspired__paragraph',
  'values_heading':    '.about-guide__heading',
  'team_heading':      '.about-founder__name',
};

const SINGLE_IMAGE_SELECTORS: Record<string, string> = {
  'page_hero_background': '.aboutus-hero__bg-img',
  'story_image':          '.about-experience__img',
};

function addPx(v: string): string {
  if (!v) return '';
  return /^-?\d+(\.\d+)?$/.test(v.trim()) ? v + 'px' : v;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyBlock(el: HTMLElement, block: Record<string, any>) {
  if (block.content) el.innerHTML = block.content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  const s = el.style;
  if (block.fontFamily)     s.fontFamily     = block.fontFamily;
  if (block.fontSize)       s.fontSize       = block.fontSize;
  if (block.fontWeight)     s.fontWeight     = block.fontWeight;
  if (block.fontStyle)      s.fontStyle      = block.fontStyle;
  if (block.textDecoration) s.textDecoration = block.textDecoration;
  if (block.textColor)      s.color          = block.textColor;
  if (block.color)          s.color          = block.color;
  if (block.lineHeight)     s.lineHeight     = block.lineHeight;
  if (block.letterSpacing)  s.letterSpacing  = block.letterSpacing;
  if (block.textAlign)      s.textAlign      = block.textAlign;
  if (block.marginTop)      s.marginTop      = addPx(block.marginTop);
  if (block.marginRight)    s.marginRight    = addPx(block.marginRight);
  if (block.marginBottom)   s.marginBottom   = addPx(block.marginBottom);
  if (block.marginLeft)     s.marginLeft     = addPx(block.marginLeft);
  if (block.paddingTop)     s.paddingTop     = addPx(block.paddingTop);
  if (block.paddingRight)   s.paddingRight   = addPx(block.paddingRight);
  if (block.paddingBottom)  s.paddingBottom  = addPx(block.paddingBottom);
  if (block.paddingLeft)    s.paddingLeft    = addPx(block.paddingLeft);
  if (block.width)          s.width          = block.width;
  if (block.minHeight)      s.minHeight      = block.minHeight;
  if (block.maxWidth)       s.maxWidth       = block.maxWidth;
  if (block.maxHeight)      s.maxHeight      = block.maxHeight;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyImageBlock(el: HTMLElement, block: Record<string, any>) {
  if (block.image && el instanceof HTMLImageElement) {
    el.srcset = '';
    el.src = block.image;
  }
}

export default function CmsApplierAbout() {
  useEffect(() => {
    try {
      if (window !== window.top) return;
    } catch { return; }

    fetch('/api/cms/about')
      .then((r) => r.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arr: Record<string, any>[] = Array.isArray(data) ? data : (data.blocks ?? []);
        const map = Object.fromEntries(arr.map((b) => [b.blockKey, b]));

        for (const [blockKey, selector] of Object.entries(SINGLE_SELECTORS)) {
          const block = map[blockKey];
          if (!block) continue;
          const el = document.querySelector(selector) as HTMLElement | null;
          if (el) applyBlock(el, block);
        }

        for (const [blockKey, selector] of Object.entries(SINGLE_IMAGE_SELECTORS)) {
          const block = map[blockKey];
          if (!block) continue;
          const el = document.querySelector(selector) as HTMLElement | null;
          if (el) applyImageBlock(el, block);
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
