'use client';

import { useEffect } from 'react';

type TextDef  = { blockKey: string; label: string; blockType: 'text' | 'textarea' };
type MultiDef = { selector: string; keyPrefix: string; labelPrefix: string; blockType: 'text' | 'textarea' };
type ImgDef   = { container: string; img: string; blockKey: string; label: string };
type MultiImgDef = { containerSel: string; imgSel: string; keyPrefix: string; labelPrefix: string };

type PageConfig = {
  singleText:  Record<string, TextDef>;
  multiText:   MultiDef[];
  singleImages: ImgDef[];
  multiImages:  MultiImgDef[];
};

// ── Homepage ─────────────────────────────────────────────────────────────────
const HOME_CONFIG: PageConfig = {
  singleText: {
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
  },
  multiText: [
    { selector: '.tradition-paragraph', keyPrefix: 'tradition-para',  labelPrefix: 'Tradition Paragraph', blockType: 'textarea' },
    { selector: '.chooseus-item',       keyPrefix: 'chooseus-bullet', labelPrefix: 'Choose Us Bullet',    blockType: 'text' },
    { selector: '.experience-value',    keyPrefix: 'exp-value',       labelPrefix: 'Stat Value',          blockType: 'text' },
    { selector: '.experience-label',    keyPrefix: 'exp-label',       labelPrefix: 'Stat Label',          blockType: 'text' },
    { selector: '.service-label',       keyPrefix: 'service-label',   labelPrefix: 'Service Label',       blockType: 'text' },
  ],
  singleImages: [
    { container: '.hero-section',         img: '.hero-image',          blockKey: 'hero-image',          label: 'Hero Image' },
    { container: '.tradition-image-wrap', img: '.tradition-img',       blockKey: 'tradition-img',       label: 'Tradition Image' },
    { container: '.chooseus-left',        img: '.chooseus-left-img',   blockKey: 'chooseus-left-img',   label: 'Choose Us Left Image' },
    { container: '.chooseus-right',       img: '.chooseus-right-img',  blockKey: 'chooseus-right-img',  label: 'Choose Us Right Image' },
    { container: '.purpose-img-wrap',     img: '.purpose-leaves-img',  blockKey: 'purpose-leaves-img',  label: 'Purpose Leaves Image' },
    { container: '.purpose-topview-wrap', img: '.purpose-topview-img', blockKey: 'purpose-topview-img', label: 'Purpose Top View Image' },
    { container: '.services-frame-wrap',  img: '.services-frame-img',  blockKey: 'services-frame-img',  label: 'Services Frame Image' },
  ],
  multiImages: [
    { containerSel: '.vision-img-wrap', imgSel: '.vision-img',  keyPrefix: 'vision-img',  labelPrefix: 'Vision Image' },
    { containerSel: '.service-img-wrap', imgSel: '.service-img', keyPrefix: 'service-img', labelPrefix: 'Service Image' },
  ],
};

// ── Main Services ─────────────────────────────────────────────────────────────
const MAIN_SERVICES_CONFIG: PageConfig = {
  singleText: {
    '.ms-hero__heading':    { blockKey: 'ms-hero-heading',   label: 'Hero Heading',         blockType: 'text' },
    '.ms-hero__paragraph':  { blockKey: 'ms-hero-para',      label: 'Hero Paragraph',       blockType: 'textarea' },
    '.ms-events__heading':  { blockKey: 'ms-events-heading', label: 'Events Heading',       blockType: 'text' },
    '.ms-packages__heading':{ blockKey: 'ms-pkg-heading',    label: 'Packages Heading',     blockType: 'text' },
    '.ms-packages__subtext':{ blockKey: 'ms-pkg-subtext',    label: 'Packages Subtext',     blockType: 'textarea' },
    // Package labels (spans inside accordion buttons)
    '.ms-pkg-label-1':      { blockKey: 'ms-pkg-label-1',   label: 'Basic Label',          blockType: 'text' },
    '.ms-pkg-label-2':      { blockKey: 'ms-pkg-label-2',   label: 'Standard Label',       blockType: 'text' },
    '.ms-pkg-label-3':      { blockKey: 'ms-pkg-label-3',   label: 'Premium Label',        blockType: 'text' },
    // Package taglines
    '.ms-pkg-tagline-1':    { blockKey: 'ms-pkg-tagline-1', label: 'Basic Tagline',        blockType: 'text' },
    '.ms-pkg-tagline-2':    { blockKey: 'ms-pkg-tagline-2', label: 'Standard Tagline',     blockType: 'text' },
    '.ms-pkg-tagline-3':    { blockKey: 'ms-pkg-tagline-3', label: 'Premium Tagline',      blockType: 'text' },
    // Package Book Now buttons
    '.ms-pkg-btn-1':        { blockKey: 'ms-pkg-btn-1',     label: 'Basic Button',         blockType: 'text' },
    '.ms-pkg-btn-2':        { blockKey: 'ms-pkg-btn-2',     label: 'Standard Button',      blockType: 'text' },
    '.ms-pkg-btn-3':        { blockKey: 'ms-pkg-btn-3',     label: 'Premium Button',       blockType: 'text' },
    // Services label headings
    '.ms-services-label-1': { blockKey: 'ms-services-label-1', label: 'Corporate Services Label', blockType: 'text' },
    '.ms-services-label-2': { blockKey: 'ms-services-label-2', label: 'Private Services Label',   blockType: 'text' },
  },
  multiText: [
    { selector: '.ms-events__paragraph',    keyPrefix: 'ms-events-para',    labelPrefix: 'Events Paragraph',   blockType: 'textarea' },
    { selector: '.ms-events__card-heading', keyPrefix: 'ms-card-heading',   labelPrefix: 'Card Heading',       blockType: 'text' },
    { selector: '.ms-events__card-text',    keyPrefix: 'ms-card-text',      labelPrefix: 'Card Text',          blockType: 'textarea' },
    { selector: '.ms-events__btn',          keyPrefix: 'ms-events-btn',     labelPrefix: 'Events Button',      blockType: 'text' },
    // Corporate / Private service list items
    { selector: '.ms-services-list-1 li',   keyPrefix: 'ms-corp-item',      labelPrefix: 'Corporate Item',     blockType: 'text' },
    { selector: '.ms-services-list-2 li',   keyPrefix: 'ms-priv-item',      labelPrefix: 'Private Item',       blockType: 'text' },
    // Package list items per package
    { selector: '.ms-pkg-items-1 li',       keyPrefix: 'ms-pkg-1-item',     labelPrefix: 'Basic Item',         blockType: 'text' },
    { selector: '.ms-pkg-items-2 li',       keyPrefix: 'ms-pkg-2-item',     labelPrefix: 'Standard Item',      blockType: 'text' },
    { selector: '.ms-pkg-items-3 li',       keyPrefix: 'ms-pkg-3-item',     labelPrefix: 'Premium Item',       blockType: 'text' },
  ],
  singleImages: [
    { container: '.ms-hero__image-wrap',     img: '.ms-hero__img',     blockKey: 'ms-hero-img', label: 'Hero Image' },
    { container: '.ms-packages__img-wrap',   img: '.ms-packages__img', blockKey: 'ms-pkg-img',  label: 'Packages Image' },
  ],
  multiImages: [
    { containerSel: '.ms-events__img-wrap', imgSel: '.ms-events__img', keyPrefix: 'ms-events-img', labelPrefix: 'Events Image' },
  ],
};

// ── Event Production ──────────────────────────────────────────────────────────
const EVENT_PROD_CONFIG: PageConfig = {
  singleText: {
    '.ep-hero__heading':        { blockKey: 'ep-hero-heading',       label: 'Hero Heading',         blockType: 'text' },
    '.ep-hero__paragraph':      { blockKey: 'ep-hero-para',          label: 'Hero Paragraph',       blockType: 'textarea' },
    '.ep-creativity__heading':  { blockKey: 'ep-creativity-heading', label: 'Creativity Heading',   blockType: 'text' },
    '.ep-creativity__subtext':  { blockKey: 'ep-creativity-subtext', label: 'Creativity Subtext',   blockType: 'text' },
    '.ep-creativity__paragraph':{ blockKey: 'ep-creativity-para',    label: 'Creativity Paragraph', blockType: 'textarea' },
    '.ep-pd__card-heading':     { blockKey: 'ep-pd-heading',         label: 'Production Heading',   blockType: 'text' },
    '.ep-pd__card-text':        { blockKey: 'ep-pd-text',            label: 'Production Text',      blockType: 'textarea' },
    '.ep-pd__services-label':   { blockKey: 'ep-pd-services-label',  label: 'Services Label',       blockType: 'text' },
    '.ep-pd__btn':              { blockKey: 'ep-pd-btn',             label: 'Production Button',    blockType: 'text' },
    '.ep-work__heading':        { blockKey: 'ep-work-heading',       label: 'How We Work Heading',  blockType: 'text' },
    '.ep-work__btn':            { blockKey: 'ep-work-btn',           label: 'Work Button',          blockType: 'text' },
  },
  multiText: [
    { selector: '.ep-pd__services-list li', keyPrefix: 'ep-pd-item',    labelPrefix: 'Production Item', blockType: 'text' },
    { selector: '.ep-work__step-label',     keyPrefix: 'ep-step-label', labelPrefix: 'Step Label',      blockType: 'text' },
    { selector: '.ep-work__step-desc',      keyPrefix: 'ep-step-desc',  labelPrefix: 'Step Desc',       blockType: 'textarea' },
  ],
  singleImages: [
    { container: '.ep-hero__image-wrap', img: '.ep-hero__img', blockKey: 'ep-hero-img', label: 'Hero Image' },
  ],
  multiImages: [
    { containerSel: '.ep-pd__img-wrap',   imgSel: '.ep-pd__img',   keyPrefix: 'ep-pd-img',   labelPrefix: 'Production Image' },
    { containerSel: '.ep-work__img-wrap', imgSel: '.ep-work__img', keyPrefix: 'ep-work-img', labelPrefix: 'Work Image' },
  ],
};

// ── Branding Services ─────────────────────────────────────────────────────────
const BRANDING_CONFIG: PageConfig = {
  singleText: {
    '.bs-hero__heading':      { blockKey: 'bs-hero-heading',     label: 'Hero Heading',       blockType: 'text' },
    '.bs-hero__paragraph':    { blockKey: 'bs-hero-para',        label: 'Hero Paragraph',     blockType: 'textarea' },
    '.bs-logo__heading':      { blockKey: 'bs-logo-heading',     label: 'Logo Heading',       blockType: 'text' },
    '.bs-logo__subtext':      { blockKey: 'bs-logo-subtext',     label: 'Logo Subtext',       blockType: 'text' },
    '.bs-logo__paragraph':    { blockKey: 'bs-logo-para',        label: 'Logo Paragraph',     blockType: 'textarea' },
    '.bs-branding__heading':  { blockKey: 'bs-branding-heading', label: 'Branding Heading',   blockType: 'text' },
    '.bs-branding__paragraph':{ blockKey: 'bs-branding-para',    label: 'Branding Paragraph', blockType: 'textarea' },
    '.bs-branding__btn':      { blockKey: 'bs-branding-btn',     label: 'Branding Button',    blockType: 'text' },
    // Package labels and buttons
    '.bs-pkg-label-1':        { blockKey: 'bs-pkg-label-1',     label: 'Launch Package Label',   blockType: 'text' },
    '.bs-pkg-label-2':        { blockKey: 'bs-pkg-label-2',     label: 'Makeover Package Label', blockType: 'text' },
    '.bs-pkg-btn-1':          { blockKey: 'bs-pkg-btn-1',       label: 'Launch Button',          blockType: 'text' },
    '.bs-pkg-btn-2':          { blockKey: 'bs-pkg-btn-2',       label: 'Makeover Button',        blockType: 'text' },
  },
  multiText: [
    { selector: '.bs-pkg-items-1 li', keyPrefix: 'bs-pkg-1-item', labelPrefix: 'Launch Item',   blockType: 'text' },
    { selector: '.bs-pkg-items-2 li', keyPrefix: 'bs-pkg-2-item', labelPrefix: 'Makeover Item', blockType: 'text' },
  ],
  singleImages: [
    { container: '.bs-hero__image-wrap',      img: '.bs-hero__img',      blockKey: 'bs-hero-img',    label: 'Hero Image' },
    { container: '.bs-logo__model-wrap',      img: '.bs-logo__model-img',blockKey: 'bs-model-img',   label: 'Logo Model Image' },
    { container: '.bs-branding__girl-wrap',   img: '.bs-branding__img',  blockKey: 'bs-girl-img',    label: 'Branding Girl Image' },
    { container: '.bs-branding__window-wrap', img: '.bs-branding__img',  blockKey: 'bs-window-img',  label: 'Branding Window Image' },
  ],
  multiImages: [],
};

// ── Contact ───────────────────────────────────────────────────────────────────
const CONTACT_CONFIG: PageConfig = {
  singleText: {
    '.contact-section__heading':   { blockKey: 'contact-heading',    label: 'Heading',    blockType: 'text' },
    '.contact-section__subheading':{ blockKey: 'contact-subheading', label: 'Subheading', blockType: 'textarea' },
    '.contact-section__card-intro':{ blockKey: 'contact-card-intro', label: 'Card Intro', blockType: 'textarea' },
  },
  multiText: [],
  singleImages: [
    { container: '.contact-section__bg-wrap',   img: '.contact-section__bg',       blockKey: 'contact-bg-img',   label: 'Background Image' },
    { container: '.contact-section__card-clip', img: '.contact-section__clip-img', blockKey: 'contact-clip-img', label: 'Clip Image' },
  ],
  multiImages: [],
};

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQ_CONFIG: PageConfig = {
  singleText: {
    '.faq-hero__label':       { blockKey: 'faq-hero-label',    label: 'Hero Label',          blockType: 'text' },
    '.faq-hero__heading':     { blockKey: 'faq-hero-heading',  label: 'Hero Heading',        blockType: 'textarea' },
    '.faq-hero__paragraph':   { blockKey: 'faq-hero-para',     label: 'Hero Paragraph',      blockType: 'textarea' },
    '.faq-qa__heading':       { blockKey: 'faq-qa-heading',    label: 'FAQ Section Heading', blockType: 'text' },
    '.faq-qa__subheading':    { blockKey: 'faq-qa-subheading', label: 'FAQ Subheading',      blockType: 'textarea' },
    '.faq-contact__heading':  { blockKey: 'faq-contact-heading',   label: 'Contact Card Heading',    blockType: 'text' },
    '.faq-contact__paragraph':{ blockKey: 'faq-contact-para',      label: 'Contact Card Paragraph',  blockType: 'textarea' },
    '.faq-contact__btn':      { blockKey: 'faq-contact-btn',       label: 'Contact Button',          blockType: 'text' },
  },
  multiText: [],
  singleImages: [
    { container: '.faq-hero__bg-wrap',    img: '.faq-hero__bg',        blockKey: 'faq-hero-bg',    label: 'Hero Background' },
    { container: '.faq-hero__frame-wrap', img: '.faq-hero__frame-img', blockKey: 'faq-frame-img',  label: 'Frame Image' },
    { container: '.faq-contact__card',    img: '.faq-contact__paper-bg', blockKey: 'faq-paper-bg', label: 'Contact Paper BG' },
  ],
  multiImages: [],
};

// ── Legal ─────────────────────────────────────────────────────────────────────
const LEGAL_CONFIG: PageConfig = {
  singleText: {
    '.legal-page__title':    { blockKey: 'legal-title',    label: 'Page Title',    blockType: 'text' },
    '.legal-page__subtitle': { blockKey: 'legal-subtitle', label: 'Page Subtitle', blockType: 'textarea' },
  },
  multiText: [],
  singleImages: [],
  multiImages: [],
};

function getConfig(pathname: string): PageConfig {
  if (pathname.startsWith('/main-services'))    return MAIN_SERVICES_CONFIG;
  if (pathname.startsWith('/event-production')) return EVENT_PROD_CONFIG;
  if (pathname.startsWith('/branding-services'))return BRANDING_CONFIG;
  if (pathname.startsWith('/contact'))          return CONTACT_CONFIG;
  if (pathname.startsWith('/faq'))              return FAQ_CONFIG;
  if (pathname.startsWith('/legal'))            return LEGAL_CONFIG;
  return HOME_CONFIG;
}


export default function CmsModeActivator() {
  useEffect(() => {
    // Only run inside the CMS preview iframe
    try {
      if (window === window.top) return;
    } catch { /* cross-origin: we're in a frame */ }

    const config = getConfig(window.location.pathname);

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

    for (const [sel, def] of Object.entries(config.singleText)) {
      const el = document.querySelector(sel);
      if (el) attachText(el, def.blockKey, def.label, def.blockType);
    }
    for (const { selector, keyPrefix, labelPrefix, blockType } of config.multiText) {
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
      containerEl.classList.add('cms-ed');
      imgEl.setAttribute('data-cms-key', blockKey);
      imgEl.setAttribute('data-cms-label', label);
      imgEl.setAttribute('data-cms-type', 'image');

      const handler = (e: Event) => {
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

    for (const def of config.singleImages) {
      const containerEl = document.querySelector(def.container);
      const imgEl       = document.querySelector(def.img) as HTMLImageElement | null;
      if (containerEl && imgEl) attachImage(containerEl, imgEl, def.blockKey, def.label);
    }

    for (const { containerSel, imgSel, keyPrefix, labelPrefix } of config.multiImages) {
      document.querySelectorAll(containerSel).forEach((containerEl, i) => {
        const imgEl = containerEl.querySelector(imgSel) as HTMLImageElement | null;
        if (imgEl) attachImage(containerEl, imgEl, `${keyPrefix}-${i + 1}`, `${labelPrefix} ${i + 1}`);
      });
    }

    // ── Messages from parent (live preview + deselect) ──────────────
    function onMessage(e: MessageEvent) {
      if (e.data?.type === 'CMS_DESELECT' && active) {
        active.classList.remove('cms-ed--on');
        active = null;
      }

      if (e.data?.type === 'CMS_LIVE_UPDATE') {
        const imgEl = document.querySelector(`img[data-cms-key="${e.data.blockKey}"]`) as HTMLImageElement | null;
        if (imgEl) {
          if (e.data.imageSrc) {
            imgEl.srcset = '';
            imgEl.src = e.data.imageSrc;
          }
          return;
        }

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

