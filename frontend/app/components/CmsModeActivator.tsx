'use client';

import { useEffect } from 'react';

// ── Text elements ───────────────────────────────────────────────────────────
const SINGLE_TEXT: Record<string, { blockKey: string; label: string; blockType: 'text' | 'textarea' }> = {
  '.hero-heading':       { blockKey: 'hero-heading',      label: 'Hero Heading',       blockType: 'text' },
  '.hero-paragraph':     { blockKey: 'hero-paragraph',    label: 'Hero Paragraph',     blockType: 'textarea' },
  '.hero-button':        { blockKey: 'hero-button',       label: 'Hero Button',        blockType: 'text' },
  '.vision-heading':     { blockKey: 'vision-heading',    label: 'Vision Heading',     blockType: 'text' },
  '.vision-paragraph':   { blockKey: 'vision-paragraph',  label: 'Vision Paragraph',   blockType: 'textarea' },
  '.vision-button':      { blockKey: 'vision-button',     label: 'Vision Button',      blockType: 'text' },
  '.tradition-heading':  { blockKey: 'tradition-heading', label: 'Tradition Heading',  blockType: 'text' },
  '.tradition-button':   { blockKey: 'tradition-button',  label: 'Tradition Button',   blockType: 'text' },
  '.services-heading':   { blockKey: 'services-heading',  label: 'Services Heading',   blockType: 'text' },
  '.services-paragraph': { blockKey: 'services-para',     label: 'Services Paragraph', blockType: 'textarea' },
  '.chooseus-heading':   { blockKey: 'chooseus-heading',  label: 'Choose Us Heading',  blockType: 'text' },
  '.experience-heading': { blockKey: 'exp-heading',       label: 'Experience Heading', blockType: 'text' },
  '.purpose-heading':    { blockKey: 'purpose-heading',   label: 'Purpose Heading',    blockType: 'text' },
  '.purpose-paragraph':  { blockKey: 'purpose-para',      label: 'Purpose Paragraph',  blockType: 'textarea' },
  '.purpose-quote':      { blockKey: 'purpose-quote',     label: 'Purpose Quote',      blockType: 'textarea' },
};

const MULTI_TEXT: { selector: string; keyPrefix: string; labelPrefix: string; blockType: 'text' | 'textarea' }[] = [
  { selector: '.tradition-paragraph', keyPrefix: 'tradition-para',  labelPrefix: 'Tradition Paragraph', blockType: 'textarea' },
  { selector: '.chooseus-item',       keyPrefix: 'chooseus-bullet', labelPrefix: 'Choose Us Bullet',    blockType: 'text' },
  { selector: '.experience-value',    keyPrefix: 'exp-value',       labelPrefix: 'Stat Value',          blockType: 'text' },
  { selector: '.experience-label',    keyPrefix: 'exp-label',       labelPrefix: 'Stat Label',          blockType: 'text' },
  { selector: '.service-label',       keyPrefix: 'service-label',   labelPrefix: 'Service Label',       blockType: 'text' },
];

// ── Image defs: container selector + img selector ───────────────────────────
// Click handler goes on the CONTAINER (a plain div — reliably receives clicks).
// The <img> only gets data-cms-key for CMS_LIVE_UPDATE src swaps.
// Hero image is special: the whole .hero-section is the container, but we guard
// against clicks that land on a child text element (those have data-cms-type="text").
const SINGLE_IMAGES: { container: string; img: string; blockKey: string; label: string }[] = [
  { container: '.hero-section',         img: '.hero-image',          blockKey: 'hero-image',          label: 'Hero Image' },
  { container: '.tradition-image-wrap', img: '.tradition-img',       blockKey: 'tradition-img',       label: 'Tradition Image' },
  { container: '.chooseus-left',        img: '.chooseus-left-img',   blockKey: 'chooseus-left-img',   label: 'Choose Us Left Image' },
  { container: '.chooseus-right',       img: '.chooseus-right-img',  blockKey: 'chooseus-right-img',  label: 'Choose Us Right Image' },
  { container: '.purpose-img-wrap',     img: '.purpose-leaves-img',  blockKey: 'purpose-leaves-img',  label: 'Purpose Leaves Image' },
  { container: '.purpose-topview-wrap', img: '.purpose-topview-img', blockKey: 'purpose-topview-img', label: 'Purpose Top View Image' },
  { container: '.services-frame-wrap',  img: '.services-frame-img',  blockKey: 'services-frame-img',  label: 'Services Frame Image' },
];

export default function CmsModeActivator() {
  useEffect(() => {
    // Only run inside the CMS preview iframe
    try {
      if (window === window.top) return;
    } catch { /* cross-origin: we're in a frame */ }

    // Inject hover / selected outline styles
    const style = document.createElement('style');
    style.id = '__cms_overlay__';
    style.textContent = `
      .cms-ed {
        outline: 2px dashed transparent;
        outline-offset: 3px;
        cursor: pointer !important;
        transition: outline-color 0.15s;
      }
      .cms-ed:hover   { outline-color: rgba(77,95,255,0.45); }
      .cms-ed.cms-ed--on { outline: 2px solid #4D5FFF !important; outline-offset: 3px; }
    `;
    document.head.appendChild(style);

    let active: Element | null = null;
    const cleanups: (() => void)[] = [];

    // ── Text click handling ─────────────────────────────────────────
    function attachText(el: Element, blockKey: string, label: string, blockType: 'text' | 'textarea') {
      el.classList.add('cms-ed');
      el.setAttribute('data-cms-key', blockKey);
      el.setAttribute('data-cms-type', 'text');
      const handler = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        if (active) active.classList.remove('cms-ed--on');
        active = el;
        el.classList.add('cms-ed--on');
        window.parent.postMessage(
          { type: 'CMS_SELECT', blockKey, label, blockType, defaultContent: el.textContent?.trim() ?? '', defaultSrc: '' },
          '*'
        );
      };
      el.addEventListener('click', handler);
      cleanups.push(() => el.removeEventListener('click', handler));
    }

    for (const [sel, def] of Object.entries(SINGLE_TEXT)) {
      const el = document.querySelector(sel);
      if (el) attachText(el, def.blockKey, def.label, def.blockType);
    }
    for (const { selector, keyPrefix, labelPrefix, blockType } of MULTI_TEXT) {
      document.querySelectorAll(selector).forEach((el, i) => {
        attachText(el, `${keyPrefix}-${i + 1}`, `${labelPrefix} ${i + 1}`, blockType);
      });
    }

    // ── Image click handling ────────────────────────────────────────
    // Attach click handler on the CONTAINER div (not the <img>).
    // Fill <img> elements are position:absolute;inset:0 and may not receive direct
    // clicks reliably due to stacking / pointer-events interactions — their parent
    // containers always do.
    function attachImage(containerEl: Element, imgEl: HTMLImageElement, blockKey: string, label: string) {
      // Outline on the container so it's visible and matches the image boundary
      containerEl.classList.add('cms-ed');
      // Tag the <img> so CMS_LIVE_UPDATE can swap the src
      imgEl.setAttribute('data-cms-key', blockKey);
      imgEl.setAttribute('data-cms-label', label);
      imgEl.setAttribute('data-cms-type', 'image');

      const handler = (e: MouseEvent) => {
        // Guard: if the actual click target is a text CMS element (e.g. hero text buttons
        // which are children of .hero-section), let their own handler run instead.
        if ((e.target as Element).closest('[data-cms-type="text"]')) return;
        e.preventDefault();
        e.stopPropagation();
        if (active) active.classList.remove('cms-ed--on');
        active = containerEl;
        containerEl.classList.add('cms-ed--on');
        window.parent.postMessage(
          { type: 'CMS_SELECT', blockKey, label, blockType: 'image', defaultContent: '', defaultSrc: imgEl.src ?? '' },
          '*'
        );
      };
      containerEl.addEventListener('click', handler);
      cleanups.push(() => containerEl.removeEventListener('click', handler));
    }

    for (const def of SINGLE_IMAGES) {
      const containerEl = document.querySelector(def.container);
      const imgEl       = document.querySelector(def.img) as HTMLImageElement | null;
      if (containerEl && imgEl) attachImage(containerEl, imgEl, def.blockKey, def.label);
    }

    // Vision images — two side-by-side images sharing .vision-img-wrap
    document.querySelectorAll('.vision-img-wrap').forEach((containerEl, i) => {
      const imgEl = containerEl.querySelector('.vision-img') as HTMLImageElement | null;
      if (imgEl) attachImage(containerEl, imgEl, `vision-img-${i + 1}`, `Vision Image ${i + 1}`);
    });

    // Service images — multiple cards, each has its own .service-img-wrap container
    document.querySelectorAll('.service-img-wrap').forEach((containerEl, i) => {
      const imgEl = containerEl.querySelector('.service-img') as HTMLImageElement | null;
      if (imgEl) attachImage(containerEl, imgEl, `service-img-${i + 1}`, `Service Image ${i + 1}`);
    });

    // ── Messages from parent (live preview + deselect) ──────────────
    function onMessage(e: MessageEvent) {
      if (e.data?.type === 'CMS_DESELECT' && active) {
        active.classList.remove('cms-ed--on');
        active = null;
      }

      if (e.data?.type === 'CMS_LIVE_UPDATE') {
        // Image update: find by img[data-cms-key] — only update src, never dimensions
        const imgEl = document.querySelector(`img[data-cms-key="${e.data.blockKey}"]`) as HTMLImageElement | null;
        if (imgEl) {
          if (e.data.imageSrc) {
            imgEl.srcset = '';
            imgEl.src = e.data.imageSrc;
          }
          return;
        }

        // Text update: find text element by data-cms-key
        const textEl = document.querySelector(`[data-cms-key="${e.data.blockKey}"]`) as HTMLElement | null;
        if (!textEl) return;
        if (typeof e.data.content === 'string') textEl.textContent = e.data.content;
        if (e.data.styles) {
          for (const [prop, val] of Object.entries(e.data.styles as Record<string, string>)) {
            (textEl.style as unknown as Record<string, string>)[prop] = val;
          }
        }
      }
    }
    window.addEventListener('message', onMessage);
    cleanups.push(() => window.removeEventListener('message', onMessage));

    return () => {
      cleanups.forEach((fn) => fn());
      document.getElementById('__cms_overlay__')?.remove();
    };
  }, []);

  return null;
}
