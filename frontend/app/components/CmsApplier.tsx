'use client';

import { useEffect } from 'react';

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
  // All homepage images use Next.js fill — only update src, never touch dimensions
  // Clear srcset so browser loads the new src instead of the Next.js-generated srcset
  if (block.image && el instanceof HTMLImageElement) {
    el.srcset = '';
    el.src = block.image;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyBlock(el: HTMLElement, block: Record<string, any>) {
  if (block.content) el.textContent = block.content;
  const s = el.style;
  if (block.fontFamily)     s.fontFamily     = block.fontFamily;
  if (block.fontSize)       s.fontSize       = block.fontSize;
  if (block.fontWeight)     s.fontWeight     = block.fontWeight;
  if (block.fontStyle)      s.fontStyle      = block.fontStyle;
  if (block.textDecoration) s.textDecoration = block.textDecoration;
  if (block.textColor)      s.color          = block.textColor;
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

export default function CmsApplier() {
  useEffect(() => {
    // Only run on the real page, not inside the CMS preview iframe
    try {
      if (window !== window.top) return;
    } catch { return; }

    fetch('/api/cms/home')
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

        for (const { selector, keyPrefix } of MULTI_SELECTORS) {
          document.querySelectorAll(selector).forEach((el, i) => {
            const block = map[`${keyPrefix}-${i + 1}`];
            if (block) applyBlock(el as HTMLElement, block);
          });
        }

        for (const [blockKey, selector] of Object.entries(SINGLE_IMAGE_SELECTORS)) {
          const block = map[blockKey];
          if (!block) continue;
          const el = document.querySelector(selector) as HTMLElement | null;
          if (el) applyImageBlock(el, block);
        }

        for (const { selector, keyPrefix } of MULTI_IMAGE_SELECTORS) {
          document.querySelectorAll(selector).forEach((el, i) => {
            const block = map[`${keyPrefix}-${i + 1}`];
            if (block) applyImageBlock(el as HTMLElement, block);
          });
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
