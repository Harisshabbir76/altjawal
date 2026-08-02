'use client';

import { useEffect } from 'react';

function addPx(v: string): string {
  if (!v) return '';
  return /^-?\d+(\.\d+)?$/.test(v.trim()) ? v + 'px' : v;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyBlock(el: HTMLElement, b: Record<string, any>) {
  if (b.content) el.textContent = b.content;
  const s = el.style;
  if (b.fontFamily)     s.fontFamily     = b.fontFamily;
  if (b.fontSize)       s.fontSize       = b.fontSize;
  if (b.fontWeight)     s.fontWeight     = b.fontWeight;
  if (b.fontStyle)      s.fontStyle      = b.fontStyle;
  if (b.textDecoration) s.textDecoration = b.textDecoration;
  if (b.textColor)      s.color          = b.textColor;
  if (b.lineHeight)     s.lineHeight     = b.lineHeight;
  if (b.letterSpacing)  s.letterSpacing  = b.letterSpacing;
  if (b.textAlign)      s.textAlign      = b.textAlign;
  if (b.marginTop)      s.marginTop      = addPx(b.marginTop);
  if (b.marginRight)    s.marginRight    = addPx(b.marginRight);
  if (b.marginBottom)   s.marginBottom   = addPx(b.marginBottom);
  if (b.marginLeft)     s.marginLeft     = addPx(b.marginLeft);
  if (b.paddingTop)     s.paddingTop     = addPx(b.paddingTop);
  if (b.paddingRight)   s.paddingRight   = addPx(b.paddingRight);
  if (b.paddingBottom)  s.paddingBottom  = addPx(b.paddingBottom);
  if (b.paddingLeft)    s.paddingLeft    = addPx(b.paddingLeft);
  if (b.width)          s.width          = b.width;
  if (b.minHeight)      s.minHeight      = b.minHeight;
  if (b.maxWidth)       s.maxWidth       = b.maxWidth;
  if (b.maxHeight)      s.maxHeight      = b.maxHeight;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyImage(el: HTMLElement, b: Record<string, any>) {
  if (b.image && el instanceof HTMLImageElement) {
    el.srcset = '';
    el.src = b.image;
  }
}

export default function CmsApplierFaq() {
  useEffect(() => {
    try { if (window !== window.top) return; } catch { return; }

    fetch('/api/cms/faq')
      .then((r) => r.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arr: Record<string, any>[] = Array.isArray(data) ? data : (data.blocks ?? []);
        const map = Object.fromEntries(arr.map((b) => [b.blockKey, b]));

        const single: Record<string, string> = {
          'faq-hero-label':    '.faq-hero__label',
          'faq-hero-heading':  '.faq-hero__heading',
          'faq-hero-para':     '.faq-hero__paragraph',
          'faq-qa-heading':    '.faq-qa__heading',
          'faq-qa-subheading': '.faq-qa__subheading',
          'faq-contact-heading': '.faq-contact__heading',
          'faq-contact-para':    '.faq-contact__paragraph',
          'faq-contact-btn':     '.faq-contact__btn',
        };
        for (const [key, sel] of Object.entries(single)) {
          const b = map[key]; if (!b) continue;
          const el = document.querySelector(sel) as HTMLElement | null;
          if (el) applyBlock(el, b);
        }

        const bgImg = document.querySelector('.faq-hero__bg') as HTMLElement | null;
        if (bgImg && map['faq-hero-bg']) applyImage(bgImg, map['faq-hero-bg']);

        const frameImg = document.querySelector('.faq-hero__frame-img') as HTMLElement | null;
        if (frameImg && map['faq-frame-img']) applyImage(frameImg, map['faq-frame-img']);

        const paperBg = document.querySelector('.faq-contact__paper-bg') as HTMLElement | null;
        if (paperBg && map['faq-paper-bg']) applyImage(paperBg, map['faq-paper-bg']);
      })
      .catch(() => {});
  }, []);

  return null;
}
