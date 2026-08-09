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

export default function CmsApplierBranding() {
  useEffect(() => {
    try { if (window !== window.top) return; } catch { return; }

    fetch('/api/cms/branding')
      .then((r) => r.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arr: Record<string, any>[] = Array.isArray(data) ? data : (data.blocks ?? []);
        const map = Object.fromEntries(arr.map((b) => [b.blockKey, b]));

        const single: Record<string, string> = {
          'bs-hero-heading':     '.bs-hero__heading',
          'bs-hero-para':        '.bs-hero__paragraph',
          'bs-logo-heading':     '.bs-logo__heading',
          'bs-logo-subtext':     '.bs-logo__subtext',
          'bs-logo-para':        '.bs-logo__paragraph',
          'bs-branding-heading': '.bs-branding__heading',
          'bs-branding-para':    '.bs-branding__paragraph',
          'bs-branding-btn':     '.bs-branding__btn',
          // Package labels and buttons (always in DOM)
          'bs-pkg-label-1':      '.bs-pkg-label-1',
          'bs-pkg-label-2':      '.bs-pkg-label-2',
          'bs-pkg-btn-1':        '.bs-pkg-btn-1',
          'bs-pkg-btn-2':        '.bs-pkg-btn-2',
        };
        for (const [key, sel] of Object.entries(single)) {
          const b = map[key]; if (!b) continue;
          const el = document.querySelector(sel) as HTMLElement | null;
          if (el) applyBlock(el, b);
        }

        const multi: { sel: string; prefix: string }[] = [
          { sel: '.bs-pkg-items-1 li', prefix: 'bs-pkg-1-item' },
          { sel: '.bs-pkg-items-2 li', prefix: 'bs-pkg-2-item' },
        ];
        for (const { sel, prefix } of multi) {
          document.querySelectorAll(sel).forEach((el, i) => {
            const b = map[`${prefix}-${i + 1}`];
            if (b) applyBlock(el as HTMLElement, b);
          });
        }

        const singleImgs: { key: string; containerSel: string; imgSel: string }[] = [
          { key: 'bs-hero-img',    containerSel: '.bs-hero__image-wrap',      imgSel: '.bs-hero__img' },
          { key: 'bs-model-img',   containerSel: '.bs-logo__model-wrap',      imgSel: '.bs-logo__model-img' },
          { key: 'bs-girl-img',    containerSel: '.bs-branding__girl-wrap',   imgSel: '.bs-branding__img' },
          { key: 'bs-window-img',  containerSel: '.bs-branding__window-wrap', imgSel: '.bs-branding__img' },
        ];
        for (const { key, containerSel, imgSel } of singleImgs) {
          const b = map[key]; if (!b) continue;
          const container = document.querySelector(containerSel);
          const imgEl = container?.querySelector(imgSel) as HTMLElement | null;
          if (imgEl) applyImage(imgEl, b);
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
