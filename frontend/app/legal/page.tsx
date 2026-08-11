'use client';

import { useState, useEffect } from 'react';
import '../styles/legal/legal.css';
import CmsModeActivator from '../components/CmsModeActivator';
import CmsApplierLegal from '../components/CmsApplierLegal';
import { LegalSection, DEFAULT_PRIVACY, DEFAULT_TERMS, DEFAULT_COOKIE, DEFAULT_PRIVACY_AR, DEFAULT_TERMS_AR, DEFAULT_COOKIE_AR } from '../lib/legalDefaults';
import { useLang } from '../lib/LanguageContext';

const tabs = ['PRIVACY POLICY', 'TERMS & CONDITIONS', 'COOKIE POLICY'] as const;
type Tab = typeof tabs[number];

const TAB_LABELS: Record<Tab, { en: string; ar: string }> = {
  'PRIVACY POLICY':     { en: 'PRIVACY POLICY',     ar: 'سياسة الخصوصية' },
  'TERMS & CONDITIONS': { en: 'TERMS & CONDITIONS', ar: 'الشروط والأحكام' },
  'COOKIE POLICY':      { en: 'COOKIE POLICY',      ar: 'سياسة ملفات تعريف الارتباط' },
};

function renderBody(body: string): React.ReactNode {
  const lines = body.split('\n');
  const nodes: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let key = 0;

  function flushList() {
    if (listBuffer.length > 0) {
      nodes.push(
        <ul key={key++}>
          {listBuffer.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
      listBuffer = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('• ')) {
      listBuffer.push(trimmed.slice(2));
    } else {
      flushList();
      nodes.push(<p key={key++}>{trimmed}</p>);
    }
  }
  flushList();
  return <>{nodes}</>;
}

export default function LegalPage() {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState<Tab>('PRIVACY POLICY');
  const [privacy, setPrivacy] = useState<LegalSection[] | null>(null);
  const [terms, setTerms]     = useState<LegalSection[] | null>(null);
  const [cookie, setCookie]   = useState<LegalSection[] | null>(null);

  useEffect(() => {
    fetch('/api/cms/legal')
      .then((r) => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        const arr = Array.isArray(data) ? data : (data.blocks ?? []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let p: LegalSection[] | null = null, t: LegalSection[] | null = null, c: LegalSection[] | null = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const b of arr as any[]) {
          if (!b.content) continue;
          try {
            const sections: LegalSection[] = JSON.parse(b.content);
            if (!Array.isArray(sections) || sections.length === 0) continue;
            if (b.blockKey === 'legal-privacy-sections') p = sections;
            if (b.blockKey === 'legal-terms-sections')   t = sections;
            if (b.blockKey === 'legal-cookie-sections')  c = sections;
          } catch { /* malformed JSON — keep defaults */ }
        }
        setPrivacy(p ?? DEFAULT_PRIVACY);
        setTerms(t ?? DEFAULT_TERMS);
        setCookie(c ?? DEFAULT_COOKIE);
      })
      .catch(() => {
        setPrivacy(DEFAULT_PRIVACY);
        setTerms(DEFAULT_TERMS);
        setCookie(DEFAULT_COOKIE);
      });
  }, []);

  function toAr(secs: LegalSection[] | null, defaults: LegalSection[]): LegalSection[] | null {
    if (!secs) return null;
    return secs.map((sec, i) => ({
      title: sec.titleAr || defaults[i]?.title || sec.title,
      body:  sec.bodyAr  || defaults[i]?.body  || sec.body,
    }));
  }

  const tabSections: Record<Tab, LegalSection[] | null> = {
    'PRIVACY POLICY':     lang === 'ar' ? toAr(privacy, DEFAULT_PRIVACY_AR) : privacy,
    'TERMS & CONDITIONS': lang === 'ar' ? toAr(terms,   DEFAULT_TERMS_AR)   : terms,
    'COOKIE POLICY':      lang === 'ar' ? toAr(cookie,  DEFAULT_COOKIE_AR)  : cookie,
  };

  const sections = tabSections[activeTab];

  const header = {
    title:    { en: 'Legal',    ar: 'قانوني' },
    subtitle: { en: 'Creating thoughtful visual identities that tell your story, strengthen your presence, and leave a lasting impression.', ar: 'نصنع هويات بصرية مدروسة تحكي قصتك وتعزز حضورك وتترك انطباعاً دائماً.' },
  };

  return (
    <div className="legal-page">
      <CmsModeActivator />
      <CmsApplierLegal />
      <div className="legal-page__header">
        <h1 className="legal-page__title">{header.title[lang]}</h1>
        <p className="legal-page__subtitle">{header.subtitle[lang]}</p>
      </div>

      <div className="legal-page__card">
        <div className="legal-page__tabs">
          {tabs.map((tab, i) => (
            <span key={tab} style={{ display: 'contents' }}>
              <button
                className={`legal-page__tab${activeTab === tab ? ' legal-page__tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {TAB_LABELS[tab][lang]}
              </button>
              {i < tabs.length - 1 && (
                <span className="legal-page__tab-dot">•</span>
              )}
            </span>
          ))}
        </div>

        <div className="legal-page__content">
          {sections === null
            ? null
            : sections.map((section, i) => (
                <div key={i} className="legal-page__section">
                  <h3 className="legal-page__section-title">{section.title}</h3>
                  {renderBody(section.body)}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
