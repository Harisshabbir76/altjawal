'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/dashApi';
import { DEFAULT_FAQS_AR } from '../../lib/faqDefaults';
import '../../styles/dashboard/dashboard.css';

type QAItem    = { q: string; a: string; qAr?: string; aAr?: string };
type BlockType  = 'text' | 'textarea' | 'image';
type EditorLang = 'en' | 'ar';

const DEFAULT_FAQS: QAItem[] = [
  { q: '1. What types of events do you organize?',          a: 'We organize a wide range of events including corporate gatherings, private celebrations, weddings, brand activations, and large-scale productions across the UAE.' },
  { q: '2. Do you provide end-to-end event management?',   a: 'Yes. From initial concept and planning to on-the-day coordination and post-event wrap-up, we handle every detail so you can enjoy the experience.' },
  { q: '3. Do you offer customized event packages?',       a: "Absolutely. Every event we create is tailored to your vision, budget, and goals. We don't offer one-size-fits-all packages." },
  { q: '4. How far in advance should I book my event?',    a: 'We recommend booking at least 2–3 months in advance for smaller events and 4–6 months for larger productions to ensure the best vendors and venues are available.' },
  { q: '5. Do you only work within the UAE?',              a: 'Our primary focus is the UAE, but we do take on select international projects. Contact us to discuss your specific needs.' },
  { q: '6. Can you help with venue selection?',            a: 'Yes. We have strong relationships with a curated network of venues across the UAE and can help you find the perfect setting for your event.' },
  { q: '7. Do you handle event design and décor?',         a: 'Yes. Our team manages full event design including florals, lighting, furniture, and styling to create a cohesive and beautiful atmosphere.' },
  { q: '8. What branding services do you offer?',          a: 'We offer event branding including signage, stage design, branded collateral, and digital assets to ensure your brand is consistently represented.' },
  { q: '9. Can you manage vendors on our behalf?',         a: "Yes. We coordinate with all vendors — from caterers to entertainers — and ensure everyone is aligned with your event's vision and timeline." },
  { q: '10. Do you provide photography and videography?',  a: 'We work with trusted photography and videography partners to capture your event beautifully. This can be included in your event package.' },
  { q: '11. Can you organize sustainable events?',         a: 'Yes. We offer eco-conscious event solutions using reusable materials, responsible sourcing, and mindful production methods.' },
  { q: '12. Do you offer corporate event solutions for businesses?', a: 'We specialize in corporate events including conferences, team-building activities, product launches, and client appreciation evenings.' },
  { q: '13. Can you work with a specific budget?',         a: 'Absolutely. We work transparently within your budget and provide clear breakdowns so there are no surprises.' },
  { q: '14. How do we get started?',                       a: "Simply reach out via our contact page or book a consultation directly. We'll set up an introductory call to understand your vision and begin planning." },
  { q: '15. Why choose AlTjawal?',                         a: 'We bring together authentic Emirati hospitality, creative excellence, and meticulous attention to detail — ensuring every event is a meaningful, beautifully crafted experience.' },
];

type CmsBlock = {
  pageSlug: string; blockKey: string; label: string; blockType: BlockType;
  // English
  content: string; image: string; height: string;
  fontFamily: string; fontSize: string; fontWeight: string; fontStyle: string;
  textDecoration: string; textColor: string; lineHeight: string; letterSpacing: string;
  textAlign: string; marginTop: string; marginRight: string; marginBottom: string;
  marginLeft: string; paddingTop: string; paddingRight: string; paddingBottom: string;
  paddingLeft: string; width: string; minHeight: string; maxWidth: string; maxHeight: string;
  // Arabic
  contentAr: string; fontFamilyAr: string; fontSizeAr: string; fontWeightAr: string;
  fontStyleAr: string; textDecorationAr: string; textColorAr: string; lineHeightAr: string;
  letterSpacingAr: string; textAlignAr: string; marginTopAr: string; marginRightAr: string;
  marginBottomAr: string; marginLeftAr: string; paddingTopAr: string; paddingRightAr: string;
  paddingBottomAr: string; paddingLeftAr: string; widthAr: string; heightAr: string;
  minHeightAr: string; maxWidthAr: string; maxHeightAr: string;
};

function emptyBlock(pageSlug: string, blockKey: string, label: string, blockType: BlockType, content: string): CmsBlock {
  return {
    pageSlug, blockKey, label, blockType, content,
    image: '', height: '', fontFamily: '', fontSize: '', fontWeight: '',
    fontStyle: '', textDecoration: '', textColor: '', lineHeight: '',
    letterSpacing: '', textAlign: '', marginTop: '', marginRight: '',
    marginBottom: '', marginLeft: '', paddingTop: '', paddingRight: '',
    paddingBottom: '', paddingLeft: '', width: '', minHeight: '',
    maxWidth: '', maxHeight: '',
    contentAr: '', fontFamilyAr: '', fontSizeAr: '', fontWeightAr: '',
    fontStyleAr: '', textDecorationAr: '', textColorAr: '', lineHeightAr: '',
    letterSpacingAr: '', textAlignAr: '', marginTopAr: '', marginRightAr: '',
    marginBottomAr: '', marginLeftAr: '', paddingTopAr: '', paddingRightAr: '',
    paddingBottomAr: '', paddingLeftAr: '', widthAr: '', heightAr: '',
    minHeightAr: '', maxWidthAr: '', maxHeightAr: '',
  };
}

function toStr(v: unknown): string { return v == null ? '' : String(v); }
function stripNum(s: string): string { return s.replace(/^\d+\.\s*/, '').trim(); }

function addPx(v: string): string {
  if (!v) return '';
  return /^-?\d+(\.\d+)?$/.test(v.trim()) ? v + 'px' : v;
}

function buildStyles(b: CmsBlock): Record<string, string> {
  return {
    fontFamily: b.fontFamily, fontSize: b.fontSize, fontWeight: b.fontWeight,
    fontStyle: b.fontStyle, textDecoration: b.textDecoration, color: b.textColor,
    lineHeight: b.lineHeight, letterSpacing: b.letterSpacing, textAlign: b.textAlign,
    marginTop: addPx(b.marginTop), marginRight: addPx(b.marginRight),
    marginBottom: addPx(b.marginBottom), marginLeft: addPx(b.marginLeft),
    paddingTop: addPx(b.paddingTop), paddingRight: addPx(b.paddingRight),
    paddingBottom: addPx(b.paddingBottom), paddingLeft: addPx(b.paddingLeft),
    width: b.width, height: b.height, minHeight: b.minHeight,
    maxWidth: b.maxWidth, maxHeight: b.maxHeight,
  };
}

function buildArStyles(b: CmsBlock): Record<string, string> {
  const f = (ar: string, en: string) => ar || en;
  return {
    fontFamily: f(b.fontFamilyAr, b.fontFamily), fontSize: f(b.fontSizeAr, b.fontSize),
    fontWeight: f(b.fontWeightAr, b.fontWeight), fontStyle: f(b.fontStyleAr, b.fontStyle),
    textDecoration: f(b.textDecorationAr, b.textDecoration), color: f(b.textColorAr, b.textColor),
    lineHeight: f(b.lineHeightAr, b.lineHeight), letterSpacing: f(b.letterSpacingAr, b.letterSpacing),
    textAlign: f(b.textAlignAr, b.textAlign),
    marginTop: addPx(f(b.marginTopAr, b.marginTop)), marginRight: addPx(f(b.marginRightAr, b.marginRight)),
    marginBottom: addPx(f(b.marginBottomAr, b.marginBottom)), marginLeft: addPx(f(b.marginLeftAr, b.marginLeft)),
    paddingTop: addPx(f(b.paddingTopAr, b.paddingTop)), paddingRight: addPx(f(b.paddingRightAr, b.paddingRight)),
    paddingBottom: addPx(f(b.paddingBottomAr, b.paddingBottom)), paddingLeft: addPx(f(b.paddingLeftAr, b.paddingLeft)),
    width: f(b.widthAr, b.width), height: f(b.heightAr, b.height),
    minHeight: f(b.minHeightAr, b.minHeight), maxWidth: f(b.maxWidthAr, b.maxWidth),
    maxHeight: f(b.maxHeightAr, b.maxHeight),
  };
}

const AR_DEFAULTS: Record<string, string> = {
  'faq-hero-label':      'كل ما تحتاج معرفته',
  'faq-hero-heading':    'قبل أن نبدأ\nشيئاً\nلا يُنسى.',
  'faq-hero-para':       'كل فعالية استثنائية تبدأ بمحادثة. جمعنا أكثر الأسئلة شيوعاً لمساعدتك على فهم أسلوبنا وما يمكن توقعه وكيف يحوّل الجوال الأفكار إلى تجارب منسقة بجمال في أنحاء الإمارات.',
  'faq-qa-heading':      'الأسئلة الشائعة',
  'faq-qa-subheading':   'يجب أن يكون التخطيط لفعالية أمراً مثيراً للاهتمام وليس ساحقاً. إليك إجابات بعض الأسئلة التي يُطرح علينا كثيراً. إذا لم تجد ما تبحث عنه، يسعد فريقنا دائماً بمساعدتك.',
  'faq-contact-heading': 'لا تزال لديك سؤال؟',
  'faq-contact-para':    'فريقنا هنا للمساعدة. تواصل معنا وسيسعدنا إرشادك في كل خطوة من رحلة فعاليتك.',
  'faq-contact-btn':     'اتصل بنا',
};

const FONT_FAMILIES = ['Default', 'DM Sans', 'Geist Sans', 'IvyPresto', 'Tajawal'];
const FONT_WEIGHTS  = ['Default', '300', '400', '500', '600', '700', '800', '900'];
const TEXT_ALIGNS   = ['Default', 'left', 'center', 'right'];

export default function FaqCmsDashboard() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ── Text block editing ────────────────────────────────────────────────────
  const [blocks, setBlocks]           = useState<Map<string, CmsBlock>>(new Map());
  const [selected, setSelected]       = useState<CmsBlock | null>(null);
  const [saving, setSaving]           = useState(false);
  const [saveMsg, setSaveMsg]         = useState('');
  const [uploading, setUploading]     = useState(false);
  const [editorLang, setEditorLang]   = useState<EditorLang>('en');
  const [previewLang, setPreviewLang] = useState<EditorLang>('en');

  // ── Q&A manager ───────────────────────────────────────────────────────────
  const [qaItems,   setQaItems]   = useState<QAItem[] | null>(null);
  const [qaEditIdx, setQaEditIdx] = useState<number | 'new' | null>(null);
  const [editQ,     setEditQ]     = useState('');
  const [editA,     setEditA]     = useState('');
  const [editQAr,   setEditQAr]   = useState('');
  const [editAAr,   setEditAAr]   = useState('');
  const [qaSaving,  setQaSaving]  = useState(false);
  const [qaMsg,     setQaMsg]     = useState('');

  // ── Load existing CMS blocks ──────────────────────────────────────────────
  useEffect(() => {
    apiFetch('/api/admin/cms/faq').then(async (res) => {
      if (!res.ok) { setQaItems(DEFAULT_FAQS); return; }
      const data = await res.json();
      const arr: Record<string, unknown>[] = Array.isArray(data) ? data : (data.blocks ?? []);
      const map = new Map<string, CmsBlock>();

      let qaLoaded = false;
      arr.forEach((b) => {
        const key = toStr(b.blockKey);
        if (key === 'faq-qa-items') {
          try {
            const items = JSON.parse(toStr(b.content));
            if (Array.isArray(items) && items.length > 0) {
              setQaItems(items);
              qaLoaded = true;
            }
          } catch { /* malformed JSON — fall through to defaults */ }
        }
        map.set(key, {
          pageSlug: 'faq', blockKey: key, label: toStr(b.label),
          blockType: (b.blockType as BlockType) ?? 'text', content: toStr(b.content),
          image: toStr(b.image), height: toStr(b.height),
          fontFamily: toStr(b.fontFamily), fontSize: toStr(b.fontSize),
          fontWeight: toStr(b.fontWeight), fontStyle: toStr(b.fontStyle),
          textDecoration: toStr(b.textDecoration), textColor: toStr(b.textColor),
          lineHeight: toStr(b.lineHeight), letterSpacing: toStr(b.letterSpacing),
          textAlign: toStr(b.textAlign),
          marginTop: toStr(b.marginTop), marginRight: toStr(b.marginRight),
          marginBottom: toStr(b.marginBottom), marginLeft: toStr(b.marginLeft),
          paddingTop: toStr(b.paddingTop), paddingRight: toStr(b.paddingRight),
          paddingBottom: toStr(b.paddingBottom), paddingLeft: toStr(b.paddingLeft),
          width: toStr(b.width), minHeight: toStr(b.minHeight),
          maxWidth: toStr(b.maxWidth), maxHeight: toStr(b.maxHeight),
          contentAr: toStr(b.contentAr), fontFamilyAr: toStr(b.fontFamilyAr),
          fontSizeAr: toStr(b.fontSizeAr), fontWeightAr: toStr(b.fontWeightAr),
          fontStyleAr: toStr(b.fontStyleAr), textDecorationAr: toStr(b.textDecorationAr),
          textColorAr: toStr(b.textColorAr), lineHeightAr: toStr(b.lineHeightAr),
          letterSpacingAr: toStr(b.letterSpacingAr), textAlignAr: toStr(b.textAlignAr),
          marginTopAr: toStr(b.marginTopAr), marginRightAr: toStr(b.marginRightAr),
          marginBottomAr: toStr(b.marginBottomAr), marginLeftAr: toStr(b.marginLeftAr),
          paddingTopAr: toStr(b.paddingTopAr), paddingRightAr: toStr(b.paddingRightAr),
          paddingBottomAr: toStr(b.paddingBottomAr), paddingLeftAr: toStr(b.paddingLeftAr),
          widthAr: toStr(b.widthAr), heightAr: toStr(b.heightAr),
          minHeightAr: toStr(b.minHeightAr), maxWidthAr: toStr(b.maxWidthAr),
          maxHeightAr: toStr(b.maxHeightAr),
        });
      });

      if (!qaLoaded) setQaItems(DEFAULT_FAQS);
      setBlocks(map);
    }).catch(() => setQaItems(DEFAULT_FAQS));
  }, []);

  // ── Listen for CMS_SELECT from iframe ────────────────────────────────────
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type !== 'CMS_SELECT') return;
      const { blockKey, label, blockType, defaultContent } = e.data as {
        blockKey: string; label: string; blockType: BlockType; defaultContent: string;
      };
      const saved = blocks.get(blockKey);
      const arDef = AR_DEFAULTS[blockKey] ?? '';
      setSelected(
        saved
          ? { ...saved, content: saved.content || defaultContent, contentAr: saved.contentAr || arDef }
          : { ...emptyBlock('faq', blockKey, label, blockType, defaultContent), contentAr: arDef }
      );
      setEditorLang(previewLang);
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [blocks, previewLang]);

  // ── Live preview update ───────────────────────────────────────────────────
  useEffect(() => {
    if (!selected || !iframeRef.current?.contentWindow) return;
    const isAr   = previewLang === 'ar';
    const content = isAr
      ? (selected.contentAr || AR_DEFAULTS[selected.blockKey] || selected.content)
      : selected.content;
    iframeRef.current.contentWindow.postMessage(
      {
        type: 'CMS_LIVE_UPDATE',
        blockKey: selected.blockKey,
        content,
        imageSrc: selected.blockType === 'image' ? selected.image : undefined,
        styles: isAr ? buildArStyles(selected) : buildStyles(selected),
      },
      '*'
    );
  }, [selected, previewLang]);

  // ── Text block helpers ────────────────────────────────────────────────────
  function cur(key: string): string {
    if (!selected) return '';
    const k = editorLang === 'ar' ? key + 'Ar' : key;
    return (selected as Record<string, string>)[k] ?? '';
  }
  function set(key: string, val: string) {
    const k = editorLang === 'ar' ? key + 'Ar' : key;
    setSelected((p) => p ? { ...p, [k]: val } : p);
  }
  function toggle(key: string, onVal: string) {
    const k = editorLang === 'ar' ? key + 'Ar' : key;
    setSelected((p) => {
      if (!p) return p;
      const v = (p as Record<string, string>)[k] ?? '';
      return { ...p, [k]: v === onVal ? '' : onVal };
    });
  }

  function switchPreviewLang(l: EditorLang) {
    setPreviewLang(l);
    setEditorLang(l);
    iframeRef.current?.contentWindow?.postMessage({ type: 'CMS_SET_LANG', lang: l }, '*');
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selected) return;
    setUploading(true);
    const form = new FormData();
    form.append('image', file);
    const res = await fetch('/api/admin/cms/upload-image', {
      method: 'POST', credentials: 'include', body: form,
    });
    if (res.ok) {
      const data = await res.json();
      set('image', data.url);
    }
    setUploading(false);
    e.target.value = '';
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true); setSaveMsg('');
    const res = await apiFetch('/api/admin/cms/save-block', {
      method: 'POST', body: JSON.stringify(selected),
    });
    if (res.ok) {
      setSaveMsg('Saved');
      setBlocks((p) => new Map(p).set(selected.blockKey, { ...selected }));
      setTimeout(() => setSaveMsg(''), 2500);
    } else {
      setSaveMsg('Failed to save');
    }
    setSaving(false);
  }

  function closePanel() {
    setSelected(null);
    iframeRef.current?.contentWindow?.postMessage({ type: 'CMS_DESELECT' }, '*');
  }

  function resetStyles() {
    if (!selected) return;
    if (editorLang === 'ar') {
      setSelected((p) => p ? {
        ...p,
        fontFamilyAr: '', fontSizeAr: '', fontWeightAr: '', fontStyleAr: '',
        textDecorationAr: '', textColorAr: '', lineHeightAr: '', letterSpacingAr: '',
        textAlignAr: '', marginTopAr: '', marginRightAr: '', marginBottomAr: '',
        marginLeftAr: '', paddingTopAr: '', paddingRightAr: '', paddingBottomAr: '',
        paddingLeftAr: '', widthAr: '', heightAr: '', minHeightAr: '',
        maxWidthAr: '', maxHeightAr: '',
      } : p);
    } else {
      setSelected(emptyBlock('faq', selected.blockKey, selected.label, selected.blockType, selected.content));
    }
  }

  // ── Q&A helpers ───────────────────────────────────────────────────────────
  function startEdit(idx: number | 'new') {
    const items = qaItems ?? [];
    if (idx === 'new') { setEditQ(''); setEditA(''); setEditQAr(''); setEditAAr(''); }
    else {
      const arDef = DEFAULT_FAQS_AR[idx];
      setEditQ(stripNum(items[idx].q));
      setEditA(items[idx].a);
      setEditQAr(items[idx].qAr ?? stripNum(arDef?.q ?? ''));
      setEditAAr(items[idx].aAr ?? arDef?.a ?? '');
    }
    setQaEditIdx(idx);
  }

  async function commitQaEdit() {
    if (!editQ.trim()) return;
    const updated = [...(qaItems ?? [])];
    const item: QAItem = { q: editQ.trim(), a: editA.trim() };
    if (editQAr.trim()) item.qAr = editQAr.trim();
    if (editAAr.trim()) item.aAr = editAAr.trim();
    if (qaEditIdx === 'new') updated.push(item);
    else if (typeof qaEditIdx === 'number') updated[qaEditIdx] = item;
    setQaEditIdx(null);
    await persistQaItems(updated);
  }

  async function deleteQaItem(idx: number) {
    if (!window.confirm('Remove this question and its answer?')) return;
    await persistQaItems((qaItems ?? []).filter((_, i) => i !== idx));
  }

  async function persistQaItems(items: QAItem[]) {
    const renumbered: QAItem[] = items.map((item, i) => {
      const out: QAItem = { q: `${i + 1}. ${stripNum(item.q)}`, a: item.a };
      if (item.qAr) out.qAr = item.qAr;
      if (item.aAr) out.aAr = item.aAr;
      return out;
    });
    setQaSaving(true);
    const res = await apiFetch('/api/admin/cms/save-block', {
      method: 'POST',
      body: JSON.stringify(
        emptyBlock('faq', 'faq-qa-items', 'FAQ Q&A Items', 'text', JSON.stringify(renumbered))
      ),
    });
    setQaSaving(false);
    if (res.ok) {
      setQaItems(renumbered);
      setQaMsg('Saved');
      setTimeout(() => setQaMsg(''), 2500);
      if (iframeRef.current) iframeRef.current.src = '/faq';
    } else {
      setQaMsg('Error saving');
      setTimeout(() => setQaMsg(''), 3000);
    }
  }

  const isAr = editorLang === 'ar';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="db-scope cms-page">

      <header className="cms-topbar" style={{ position: 'relative' }}>
        <div className="cms-topbar-left">
          <Link href="/altjawal/admin-panel/dashboard/bookings" className="cms-back">
            <i className="fa-solid fa-chevron-left" /> Dashboard
          </Link>
          <span className="cms-topbar-divider" />
          <span className="cms-topbar-title">FAQ Page Editor</span>
        </div>

        {/* Preview language toggle */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex' }}>
          <button
            className={`cms-lang${previewLang === 'en' ? ' cms-lang--on' : ''}`}
            onClick={() => switchPreviewLang('en')}
          >EN</button>
          <button
            className={`cms-lang${previewLang === 'ar' ? ' cms-lang--on' : ''}`}
            onClick={() => switchPreviewLang('ar')}
          >AR</button>
        </div>

        <div className="cms-topbar-right">
          {saveMsg && (
            <span className={`cms-save-msg${saveMsg.startsWith('Failed') ? ' cms-save-msg--err' : ''}`}>
              {saveMsg}
            </span>
          )}
          <a href="/faq" target="_blank" rel="noreferrer" className="cms-btn cms-btn--ghost">
            <i className="fa-solid fa-arrow-up-right-from-square" /> View Site
          </a>
          {selected && (
            <button className="cms-btn cms-btn--primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          )}
        </div>
      </header>

      <div className="cms-body">

        {/* ── Preview iframe ── */}
        <div className="cms-preview-wrap">
          <iframe
            ref={iframeRef}
            src="/faq"
            title="FAQ Editor Preview"
            className="cms-iframe"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>

        {/* ── Right panel ── */}
        <div className="cms-panel">

          {selected ? (
            /* ── Text block editor ── */
            <>
              <div className="cms-panel-head">
                <div>
                  <p className="cms-eyebrow">{selected.blockType}</p>
                  <h3 className="cms-panel-title">{selected.label}</h3>
                </div>
                <button className="cms-close" onClick={closePanel}>
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              {/* EN / AR editor tabs */}
              <div className="cms-sec" style={{ paddingBottom: 12 }}>
                <div className="cms-lang-row">
                  <button
                    className={`cms-lang${editorLang === 'en' ? ' cms-lang--on' : ''}`}
                    onClick={() => switchPreviewLang('en')}
                  >English</button>
                  <button
                    className={`cms-lang${editorLang === 'ar' ? ' cms-lang--on' : ''}`}
                    onClick={() => switchPreviewLang('ar')}
                  >العربية</button>
                </div>
              </div>

              <div className="cms-panel-body">
                {selected.blockType === 'image' ? (
                  <>
                    <div className="cms-sec">
                      <p className="cms-sec-label">Image</p>
                      {selected.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={selected.image} alt="" className="cms-img-preview" />
                      )}
                      <label className="cms-upload-zone" style={{ display: 'block', cursor: 'pointer' }}>
                        <input type="file" accept="image/*" style={{ display: 'none' }}
                          onChange={handleImageUpload} />
                        {uploading ? 'Uploading…' : '+ Upload Image'}
                      </label>
                      <div className="cms-field" style={{ marginTop: 8 }}>
                        <label className="cms-flabel">Or paste URL</label>
                        <input className="cms-input" type="text" placeholder="https://…"
                          value={selected.image} onChange={(e) => set('image', e.target.value)} />
                      </div>
                    </div>
                    <div className="cms-sec">
                      <p className="cms-sec-label">Size</p>
                      <div className="cms-grid2">
                        <div className="cms-field">
                          <label className="cms-flabel">Width</label>
                          <input className="cms-input" type="text" placeholder="100%"
                            value={selected.width} onChange={(e) => set('width', e.target.value)} />
                        </div>
                        <div className="cms-field">
                          <label className="cms-flabel">Height</label>
                          <input className="cms-input" type="text" placeholder="400px"
                            value={selected.height} onChange={(e) => set('height', e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <div className="cms-sec">
                      <p className="cms-sec-label">Margin</p>
                      <div className="cms-grid2">
                        {(['marginTop', 'marginRight', 'marginBottom', 'marginLeft'] as const).map((k) => (
                          <div className="cms-field" key={k}>
                            <label className="cms-flabel">{k.replace('margin', '')}</label>
                            <div className="cms-px-wrap">
                              <input className="cms-input cms-input--px" type="text" placeholder="0"
                                value={selected[k]} onChange={(e) => set(k, e.target.value)} />
                              <span className="cms-px">px</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="cms-sec">
                      <p className="cms-sec-label">Content {isAr ? '(Arabic)' : '(English)'}</p>
                      <textarea
                        className="cms-textarea"
                        dir={isAr ? 'rtl' : 'ltr'}
                        value={cur('content')}
                        rows={4}
                        onChange={(e) => set('content', e.target.value)}
                      />
                      <div className="cms-fmts">
                        <button className={`cms-fmt${cur('fontWeight') === '700' ? ' on' : ''}`}
                          onClick={() => toggle('fontWeight', '700')}><b>B</b></button>
                        <button className={`cms-fmt${cur('fontStyle') === 'italic' ? ' on' : ''}`}
                          onClick={() => toggle('fontStyle', 'italic')}><i>I</i></button>
                        <button className={`cms-fmt${cur('textDecoration') === 'underline' ? ' on' : ''}`}
                          onClick={() => toggle('textDecoration', 'underline')}><u>U</u></button>
                      </div>
                    </div>
                    <div className="cms-sec">
                      <p className="cms-sec-label">Typography {isAr ? '(Arabic)' : '(English)'}</p>
                      <div className="cms-field">
                        <label className="cms-flabel">Font Family</label>
                        <select className="cms-select" value={cur('fontFamily')}
                          onChange={(e) => set('fontFamily', e.target.value)}>
                          {FONT_FAMILIES.map((f) => (
                            <option key={f} value={f === 'Default' ? '' : f}>{f}</option>
                          ))}
                        </select>
                      </div>
                      <div className="cms-grid2">
                        <div className="cms-field">
                          <label className="cms-flabel">Font Size</label>
                          <input className="cms-input" type="text" placeholder="30px"
                            value={cur('fontSize')} onChange={(e) => set('fontSize', e.target.value)} />
                        </div>
                        <div className="cms-field">
                          <label className="cms-flabel">Weight</label>
                          <select className="cms-select" value={cur('fontWeight')}
                            onChange={(e) => set('fontWeight', e.target.value)}>
                            {FONT_WEIGHTS.map((w) => (
                              <option key={w} value={w === 'Default' ? '' : w}>{w}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="cms-field">
                        <label className="cms-flabel">Color</label>
                        <div className="cms-color-row">
                          <input type="color" className="cms-swatch"
                            value={cur('textColor') || '#000000'}
                            onChange={(e) => set('textColor', e.target.value)} />
                          <input className="cms-input" type="text" placeholder="#000000"
                            value={cur('textColor')} onChange={(e) => set('textColor', e.target.value)} />
                        </div>
                      </div>
                      <div className="cms-grid2">
                        <div className="cms-field">
                          <label className="cms-flabel">Letter Spacing</label>
                          <input className="cms-input" type="text" placeholder="2px"
                            value={cur('letterSpacing')} onChange={(e) => set('letterSpacing', e.target.value)} />
                        </div>
                        <div className="cms-field">
                          <label className="cms-flabel">Text Align</label>
                          <select className="cms-select" value={cur('textAlign')}
                            onChange={(e) => set('textAlign', e.target.value)}>
                            {TEXT_ALIGNS.map((a) => (
                              <option key={a} value={a === 'Default' ? '' : a}>{a}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="cms-sec">
                      <p className="cms-sec-label">Margin {isAr ? '(Arabic)' : '(English)'}</p>
                      <div className="cms-grid2">
                        {(['marginTop', 'marginRight', 'marginBottom', 'marginLeft'] as const).map((k) => (
                          <div className="cms-field" key={k}>
                            <label className="cms-flabel">{k.replace('margin', '')}</label>
                            <div className="cms-px-wrap">
                              <input className="cms-input cms-input--px" type="text" placeholder="0"
                                value={cur(k)} onChange={(e) => set(k, e.target.value)} />
                              <span className="cms-px">px</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="cms-sec">
                      <p className="cms-sec-label">Padding {isAr ? '(Arabic)' : '(English)'}</p>
                      <div className="cms-grid2">
                        {(['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] as const).map((k) => (
                          <div className="cms-field" key={k}>
                            <label className="cms-flabel">{k.replace('padding', '')}</label>
                            <div className="cms-px-wrap">
                              <input className="cms-input cms-input--px" type="text" placeholder="0"
                                value={cur(k)} onChange={(e) => set(k, e.target.value)} />
                              <span className="cms-px">px</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="cms-sec">
                      <p className="cms-sec-label">Layout {isAr ? '(Arabic)' : '(English)'}</p>
                      <div className="cms-grid2">
                        <div className="cms-field">
                          <label className="cms-flabel">Line Height</label>
                          <input className="cms-input" type="text" placeholder="1.5"
                            value={cur('lineHeight')} onChange={(e) => set('lineHeight', e.target.value)} />
                        </div>
                        <div className="cms-field">
                          <label className="cms-flabel">Width</label>
                          <input className="cms-input" type="text" placeholder="100%"
                            value={cur('width')} onChange={(e) => set('width', e.target.value)} />
                        </div>
                        <div className="cms-field">
                          <label className="cms-flabel">Min Height</label>
                          <input className="cms-input" type="text" placeholder="120px"
                            value={cur('minHeight')} onChange={(e) => set('minHeight', e.target.value)} />
                        </div>
                        <div className="cms-field">
                          <label className="cms-flabel">Max Width</label>
                          <input className="cms-input" type="text" placeholder="800px"
                            value={cur('maxWidth')} onChange={(e) => set('maxWidth', e.target.value)} />
                        </div>
                      </div>
                      <button className="cms-reset-btn" onClick={resetStyles}>
                        Reset {isAr ? 'Arabic' : 'English'} styles
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>

          ) : (
            /* ── Q&A Manager ── */
            <>
              <div className="cms-panel-head">
                <div>
                  <p className="cms-eyebrow">FAQ Manager</p>
                  <h3 className="cms-panel-title">Q&amp;A Items ({qaItems?.length ?? '…'})</h3>
                </div>
                {qaMsg && (
                  <span className={`cms-save-msg${qaMsg.startsWith('Error') ? ' cms-save-msg--err' : ''}`}>
                    {qaMsg}
                  </span>
                )}
              </div>

              <div className="cms-panel-body">
                <div className="cms-qa-top">
                  {qaEditIdx !== 'new' && (
                    <button className="cms-btn cms-btn--primary cms-qa-add-btn" onClick={() => startEdit('new')}>
                      <i className="fa-solid fa-plus" /> Add Question
                    </button>
                  )}

                  {qaEditIdx === 'new' && (
                    <div className="cms-qa-form">
                      <p className="cms-sec-label" style={{ marginBottom: 10 }}>New Question</p>
                      <div className="cms-field">
                        <label className="cms-flabel">Question (English)</label>
                        <input
                          className="cms-input"
                          type="text"
                          placeholder="Enter question…"
                          value={editQ}
                          onChange={(e) => setEditQ(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="cms-field">
                        <label className="cms-flabel">Answer (English)</label>
                        <textarea
                          className="cms-textarea"
                          placeholder="Enter answer…"
                          rows={3}
                          value={editA}
                          onChange={(e) => setEditA(e.target.value)}
                        />
                      </div>
                      <div className="cms-field">
                        <label className="cms-flabel">Question (Arabic)</label>
                        <input
                          className="cms-input"
                          dir="rtl"
                          type="text"
                          placeholder="أدخل السؤال…"
                          value={editQAr}
                          onChange={(e) => setEditQAr(e.target.value)}
                        />
                      </div>
                      <div className="cms-field">
                        <label className="cms-flabel">Answer (Arabic)</label>
                        <textarea
                          className="cms-textarea"
                          dir="rtl"
                          placeholder="أدخل الجواب…"
                          rows={3}
                          value={editAAr}
                          onChange={(e) => setEditAAr(e.target.value)}
                        />
                      </div>
                      <div className="cms-qa-form-btns">
                        <button
                          className="cms-btn cms-btn--primary"
                          onClick={commitQaEdit}
                          disabled={qaSaving || !editQ.trim()}
                        >
                          {qaSaving ? 'Saving…' : 'Add'}
                        </button>
                        <button className="cms-btn cms-btn--ghost" onClick={() => setQaEditIdx(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="cms-qa-list">
                  {qaItems === null && (
                    <div className="cms-qa-empty"><p>Loading…</p></div>
                  )}
                  {qaItems !== null && qaItems.length === 0 && qaEditIdx === null && (
                    <div className="cms-qa-empty">
                      <i className="fa-regular fa-circle-question" />
                      <p>No Q&amp;A items yet.</p>
                      <p>Click &quot;Add Question&quot; to get started.</p>
                    </div>
                  )}
                  {(qaItems ?? []).map((item, idx) => (
                    <div key={idx} className="cms-qa-item">
                      {qaEditIdx === idx ? (
                        <div className="cms-qa-form">
                          <div className="cms-field">
                            <label className="cms-flabel">Question (English)</label>
                            <input
                              className="cms-input"
                              type="text"
                              value={editQ}
                              onChange={(e) => setEditQ(e.target.value)}
                              autoFocus
                            />
                          </div>
                          <div className="cms-field">
                            <label className="cms-flabel">Answer (English)</label>
                            <textarea
                              className="cms-textarea"
                              rows={3}
                              value={editA}
                              onChange={(e) => setEditA(e.target.value)}
                            />
                          </div>
                          <div className="cms-field">
                            <label className="cms-flabel">Question (Arabic)</label>
                            <input
                              className="cms-input"
                              dir="rtl"
                              type="text"
                              placeholder="أدخل السؤال…"
                              value={editQAr}
                              onChange={(e) => setEditQAr(e.target.value)}
                            />
                          </div>
                          <div className="cms-field">
                            <label className="cms-flabel">Answer (Arabic)</label>
                            <textarea
                              className="cms-textarea"
                              dir="rtl"
                              placeholder="أدخل الجواب…"
                              rows={3}
                              value={editAAr}
                              onChange={(e) => setEditAAr(e.target.value)}
                            />
                          </div>
                          <div className="cms-qa-form-btns">
                            <button
                              className="cms-btn cms-btn--primary"
                              onClick={commitQaEdit}
                              disabled={qaSaving || !editQ.trim()}
                            >
                              {qaSaving ? 'Saving…' : 'Save'}
                            </button>
                            <button className="cms-btn cms-btn--ghost" onClick={() => setQaEditIdx(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="cms-qa-row">
                          <p className="cms-qa-q">{item.q}</p>
                          <div className="cms-qa-actions">
                            <button
                              className="cms-qa-icon-btn cms-qa-icon-btn--edit"
                              title="Edit"
                              onClick={() => startEdit(idx)}
                            >
                              <i className="fa-solid fa-pencil" />
                            </button>
                            <button
                              className="cms-qa-icon-btn cms-qa-icon-btn--del"
                              title="Delete"
                              onClick={() => deleteQaItem(idx)}
                            >
                              <i className="fa-solid fa-trash" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="cms-qa-hint">
                  <i className="fa-solid fa-circle-info" /> Click any text on the preview to edit headings and paragraphs.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
