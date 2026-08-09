'use client';

import { useEffect } from 'react';

function addPx(v: string): string {
  if (!v) return '';
  return /^-?\d+(\.\d+)?$/.test(v.trim()) ? v + 'px' : v;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyBlock(el: HTMLElement, b: Record<string, any>) {
  if (b.content) el.innerHTML = b.content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
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

export default function CmsApplierEventProd() {
  useEffect(() => {
    try { if (window !== window.top) return; } catch { return; }

    fetch('/api/cms/events')
      .then((r) => r.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arr: Record<string, any>[] = Array.isArray(data) ? data : (data.blocks ?? []);
        const map = Object.fromEntries(arr.map((b) => [b.blockKey, b]));

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
          const b = map[key]; if (!b) continue;
          const el = document.querySelector(sel) as HTMLElement | null;
          if (el) applyBlock(el, b);
        }

        const multi: { sel: string; prefix: string }[] = [
          { sel: '.ep-pd__services-list li', prefix: 'ep-pd-item' },
          { sel: '.ep-work__step-label',     prefix: 'ep-step-label' },
          { sel: '.ep-work__step-desc',      prefix: 'ep-step-desc' },
        ];
        for (const { sel, prefix } of multi) {
          document.querySelectorAll(sel).forEach((el, i) => {
            const b = map[`${prefix}-${i + 1}`];
            if (b) applyBlock(el as HTMLElement, b);
          });
        }

        const heroImg = document.querySelector('.ep-hero__img') as HTMLElement | null;
        if (heroImg && map['ep-hero-img']) applyImage(heroImg, map['ep-hero-img']);

        document.querySelectorAll('.ep-pd__img').forEach((el, i) => {
          const b = map[`ep-pd-img-${i + 1}`];
          if (b) applyImage(el as HTMLElement, b);
        });
        document.querySelectorAll('.ep-work__img').forEach((el, i) => {
          const b = map[`ep-work-img-${i + 1}`];
          if (b) applyImage(el as HTMLElement, b);
        });
      })
      .catch(() => {});
  }, []);

  return null;
}
