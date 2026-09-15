'use client';

import { useState, useEffect } from 'react';
import '../styles/legal/legal.css';
import CmsModeActivator from '../components/CmsModeActivator';
import CmsApplierLegal from '../components/CmsApplierLegal';
import { LegalSection, DEFAULT_LEGAL_SECTIONS } from '../lib/legalDefaults';
import { useLang } from '../lib/LanguageContext';

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
  const [generalSections, setGeneralSections] = useState<LegalSection[]>(DEFAULT_LEGAL_SECTIONS);

  useEffect(() => {
    fetch('/api/cms/legal')
      .then((r) => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        const arr = Array.isArray(data) ? data : (data.blocks ?? []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const b of arr as any[]) {
          if (b.blockKey === 'legal-general-sections' && b.content) {
            try {
              const parsed: LegalSection[] = JSON.parse(b.content);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setGeneralSections(parsed);
              }
            } catch { /* malformed JSON - keep defaults */ }
          }
        }
      })
      .catch(() => { /* keep defaults */ });
  }, []);

  const header = {
    title:    { en: 'Legal',    ar: 'قانوني' },
    subtitle: {
      en: 'Welcome to the Atjwal Events website. By accessing and using this website, you agree to the terms outlined below.',
      ar: 'مرحباً بكم في موقع فعاليات الجوال. من خلال الوصول إلى هذا الموقع واستخدامه، فإنك توافق على الشروط الموضحة أدناه.',
    },
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
        <div className="legal-page__content">
          {generalSections.map((section, i) => {
            const title = lang === 'ar' ? (section.titleAr || section.title) : section.title;
            const body  = lang === 'ar' ? (section.bodyAr  || section.body)  : section.body;
            return (
              <div key={i} className="legal-page__section">
                <h3 className="legal-page__section-title">{title}</h3>
                {renderBody(body)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}