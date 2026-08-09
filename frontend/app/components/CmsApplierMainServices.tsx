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

export default function CmsApplierMainServices() {
  useEffect(() => {
    try { if (window !== window.top) return; } catch { return; }

    fetch('/api/cms/services')
      .then((r) => r.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arr: Record<string, any>[] = Array.isArray(data) ? data : (data.blocks ?? []);
        const map = Object.fromEntries(arr.map((b) => [b.blockKey, b]));

        const single: Record<string, string> = {
          'ms-hero-heading':   '.ms-hero__heading',
          'ms-hero-para':      '.ms-hero__paragraph',
          'ms-events-heading': '.ms-events__heading',
          'ms-pkg-heading':    '.ms-packages__heading',
          'ms-pkg-subtext':    '.ms-packages__subtext',
          // Package labels, taglines, buttons (always in DOM)
          'ms-pkg-label-1':   '.ms-pkg-label-1',
          'ms-pkg-label-2':   '.ms-pkg-label-2',
          'ms-pkg-label-3':   '.ms-pkg-label-3',
          'ms-pkg-tagline-1': '.ms-pkg-tagline-1',
          'ms-pkg-tagline-2': '.ms-pkg-tagline-2',
          'ms-pkg-tagline-3': '.ms-pkg-tagline-3',
          'ms-pkg-btn-1':     '.ms-pkg-btn-1',
          'ms-pkg-btn-2':     '.ms-pkg-btn-2',
          'ms-pkg-btn-3':     '.ms-pkg-btn-3',
          // Services section labels
          'ms-services-label-1': '.ms-services-label-1',
          'ms-services-label-2': '.ms-services-label-2',
        };
        for (const [key, sel] of Object.entries(single)) {
          const b = map[key]; if (!b) continue;
          const el = document.querySelector(sel) as HTMLElement | null;
          if (el) applyBlock(el, b);
        }

        const multi: { sel: string; prefix: string }[] = [
          { sel: '.ms-events__paragraph',    prefix: 'ms-events-para' },
          { sel: '.ms-events__card-heading', prefix: 'ms-card-heading' },
          { sel: '.ms-events__card-text',    prefix: 'ms-card-text' },
          { sel: '.ms-events__btn',          prefix: 'ms-events-btn' },
          // Corporate / Private service list items
          { sel: '.ms-services-list-1 li',   prefix: 'ms-corp-item' },
          { sel: '.ms-services-list-2 li',   prefix: 'ms-priv-item' },
          // Package list items — always in DOM now (body renders with display:none when closed)
          { sel: '.ms-pkg-items-1 li',       prefix: 'ms-pkg-1-item' },
          { sel: '.ms-pkg-items-2 li',       prefix: 'ms-pkg-2-item' },
          { sel: '.ms-pkg-items-3 li',       prefix: 'ms-pkg-3-item' },
        ];
        for (const { sel, prefix } of multi) {
          document.querySelectorAll(sel).forEach((el, i) => {
            const b = map[`${prefix}-${i + 1}`];
            if (b) applyBlock(el as HTMLElement, b);
          });
        }

        const singleImgs: Record<string, string> = {
          'ms-hero-img': '.ms-hero__img',
          'ms-pkg-img':  '.ms-packages__img',
        };
        for (const [key, sel] of Object.entries(singleImgs)) {
          const b = map[key]; if (!b) continue;
          const el = document.querySelector(sel) as HTMLElement | null;
          if (el) applyImage(el, b);
        }

        document.querySelectorAll('.ms-events__img').forEach((el, i) => {
          const b = map[`ms-events-img-${i + 1}`];
          if (b) applyImage(el as HTMLElement, b);
        });
      })
      .catch(() => {});
  }, []);

  return null;
}
