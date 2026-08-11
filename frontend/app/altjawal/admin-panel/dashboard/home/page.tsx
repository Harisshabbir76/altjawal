'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../../lib/dashApi';
import '../../../../styles/dashboard/dashboard.css';

type BlockType = 'text' | 'textarea' | 'image';
type EditorLang = 'en' | 'ar';

type CmsBlock = {
  pageSlug: string;
  blockKey: string;
  label: string;
  blockType: BlockType;
  // English
  content: string;
  image: string;
  height: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  textColor: string;
  lineHeight: string;
  letterSpacing: string;
  textAlign: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  width: string;
  minHeight: string;
  maxWidth: string;
  maxHeight: string;
  // Arabic
  contentAr: string;
  fontFamilyAr: string;
  fontSizeAr: string;
  fontWeightAr: string;
  fontStyleAr: string;
  textDecorationAr: string;
  textColorAr: string;
  lineHeightAr: string;
  letterSpacingAr: string;
  textAlignAr: string;
  marginTopAr: string;
  marginRightAr: string;
  marginBottomAr: string;
  marginLeftAr: string;
  paddingTopAr: string;
  paddingRightAr: string;
  paddingBottomAr: string;
  paddingLeftAr: string;
  widthAr: string;
  heightAr: string;
  minHeightAr: string;
  maxWidthAr: string;
  maxHeightAr: string;
};

function emptyBlock(blockKey: string, label: string, blockType: BlockType, content: string): CmsBlock {
  return {
    pageSlug: 'home', blockKey, label, blockType, content,
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

function addPx(v: string): string {
  if (!v) return '';
  return /^-?\d+(\.\d+)?$/.test(v.trim()) ? v + 'px' : v;
}

function buildStyles(b: CmsBlock): Record<string, string> {
  return {
    fontFamily:      b.fontFamily,
    fontSize:        b.fontSize,
    fontWeight:      b.fontWeight,
    fontStyle:       b.fontStyle,
    textDecoration:  b.textDecoration,
    color:           b.textColor,
    lineHeight:      b.lineHeight,
    letterSpacing:   b.letterSpacing,
    textAlign:       b.textAlign,
    marginTop:       addPx(b.marginTop),
    marginRight:     addPx(b.marginRight),
    marginBottom:    addPx(b.marginBottom),
    marginLeft:      addPx(b.marginLeft),
    paddingTop:      addPx(b.paddingTop),
    paddingRight:    addPx(b.paddingRight),
    paddingBottom:   addPx(b.paddingBottom),
    paddingLeft:     addPx(b.paddingLeft),
    width:           b.width,
    height:          b.height,
    minHeight:       b.minHeight,
    maxWidth:        b.maxWidth,
    maxHeight:       b.maxHeight,
  };
}

function buildArStyles(b: CmsBlock): Record<string, string> {
  const f = (ar: string, en: string) => ar || en;
  return {
    fontFamily:      f(b.fontFamilyAr, b.fontFamily),
    fontSize:        f(b.fontSizeAr, b.fontSize),
    fontWeight:      f(b.fontWeightAr, b.fontWeight),
    fontStyle:       f(b.fontStyleAr, b.fontStyle),
    textDecoration:  f(b.textDecorationAr, b.textDecoration),
    color:           f(b.textColorAr, b.textColor),
    lineHeight:      f(b.lineHeightAr, b.lineHeight),
    letterSpacing:   f(b.letterSpacingAr, b.letterSpacing),
    textAlign:       f(b.textAlignAr, b.textAlign),
    marginTop:       addPx(f(b.marginTopAr, b.marginTop)),
    marginRight:     addPx(f(b.marginRightAr, b.marginRight)),
    marginBottom:    addPx(f(b.marginBottomAr, b.marginBottom)),
    marginLeft:      addPx(f(b.marginLeftAr, b.marginLeft)),
    paddingTop:      addPx(f(b.paddingTopAr, b.paddingTop)),
    paddingRight:    addPx(f(b.paddingRightAr, b.paddingRight)),
    paddingBottom:   addPx(f(b.paddingBottomAr, b.paddingBottom)),
    paddingLeft:     addPx(f(b.paddingLeftAr, b.paddingLeft)),
    width:           f(b.widthAr, b.width),
    height:          f(b.heightAr, b.height),
    minHeight:       f(b.minHeightAr, b.minHeight),
    maxWidth:        f(b.maxWidthAr, b.maxWidth),
    maxHeight:       f(b.maxHeightAr, b.maxHeight),
  };
}

// Arabic default text for each block key (used to pre-fill the Arabic tab)
const AR_DEFAULTS: Record<string, string> = {
  // Single elements
  'hero-heading':      'نبني حضورك',
  'hero-paragraph':    'نصنع فعاليات استثنائية وتجارب لا تُنسى ولحظات ذات معنى في أنحاء الإمارات.',
  'hero-button':       'احجز استشارة',
  'vision-heading':    'مصمم حول رؤيتك',
  'vision-paragraph':  'كل فعالية تحكي قصة. في الجوال، نمزج الضيافة الإماراتية الأصيلة مع تصميم الفعاليات المعاصر لخلق تجارب أنيقة وسلسة ولا تُنسى. من تطوير المفهوم إلى التنفيذ المثالي، يتم التخطيط لكل تفصيلة بإبداع ودقة وعناية.',
  'vision-button':     'احجز استشارتك الآن',
  'tradition-heading': 'مستوحى من التراث. مصنوع لليوم.',
  'tradition-button':  'اكتشف قصتنا',
  'services-heading':  'خدماتنا',
  'services-para':     'ولدنا في الظفرة ونخدم بفخر عملاءنا في جميع الإمارات السبع، يجمع الجوال بين التراث المحلي والإبداع الحديث لتقديم فعاليات تعكس رؤيتك حقاً.',
  'chooseus-heading':  'لماذا يختارنا عملاؤنا',
  'exp-heading':       'نصنع تجارب تترك أثراً',
  'purpose-heading':   'فعاليات هادفة',
  'purpose-para':      'الاستدامة جزء من كل فعالية ننظمها. نولي الأولوية للهياكل القابلة لإعادة الاستخدام والمواد القابلة للتدوير وممارسات التخطيط المسؤول التي تقلل النفايات وتدعم رؤية الإمارات لمستقبل أكثر استدامة.',
  'purpose-quote':     '"كل احتفال يستحق تخطيطاً متأنياً وتفاصيل ذات معنى وتجربة لن ينساها ضيوفك أبداً."',
  // Multi: tradition paragraphs
  'tradition-para-1':  'ولدنا في الظفرة ونخدم بفخر عملاءنا في جميع الإمارات السبع، يجمع الجوال بين التراث المحلي والإبداع الحديث لتقديم فعاليات تعكس رؤيتك حقاً.',
  'tradition-para-2':  'سواء كنت تخطط لتجمع مؤسسي أو إطلاق منتج أو حفل زفاف أو احتفال خاص، يضمن فريقنا أن تكون كل تجربة سلسة من البداية إلى النهاية.',
  // Multi: chooseus bullets
  'chooseus-bullet-1': 'تخطيط احترافي للفعاليات من الفكرة إلى التنفيذ',
  'chooseus-bullet-2': 'الضيافة الإماراتية الأصيلة بأسلوب معاصر',
  'chooseus-bullet-3': 'تصاميم إبداعية مخصصة لكل مناسبة',
  'chooseus-bullet-4': 'إدارة موثوقة للموردين والإنتاج',
  'chooseus-bullet-5': 'حلول فعاليات مستدامة باستخدام مواد قابلة لإعادة الاستخدام',
  'chooseus-bullet-6': 'خدمة شخصية مع اهتمام دقيق بالتفاصيل',
  // Multi: experience labels
  'exp-label-1': 'سنوات من الخبرة',
  'exp-label-2': 'مشروع ناجح',
  'exp-label-3': 'إمارات نخدمها',
  'exp-label-4': 'عميل راضٍ',
  // Multi: service labels
  'service-label-1': 'الفعاليات المؤسسية',
  'service-label-2': 'الاحتفالات الخاصة',
  'service-label-3': 'إنتاج الفعاليات',
  'service-label-4': 'خدمات العلامة التجارية',
};

const FONT_FAMILIES = ['Default', 'DM Sans', 'Geist Sans', 'IvyPresto', 'Tajawal'];
const FONT_WEIGHTS  = ['Default', '300', '400', '500', '600', '700', '800', '900'];
const TEXT_ALIGNS   = ['Default', 'left', 'center', 'right'];

export default function HomeCmsPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [blocks, setBlocks]     = useState<Map<string, CmsBlock>>(new Map());
  const [selected, setSelected] = useState<CmsBlock | null>(null);
  const [saving, setSaving]     = useState(false);
  const [saveMsg, setSaveMsg]   = useState('');
  const [editorLang, setEditorLang] = useState<EditorLang>('en');
  const [previewLang, setPreviewLang] = useState<EditorLang>('en');
  const [uploading, setUploading]   = useState(false);

  useEffect(() => {
    apiFetch('/api/admin/cms/home').then(async (res) => {
      if (!res.ok) return;
      const data = await res.json();
      const arr: Record<string, unknown>[] = Array.isArray(data) ? data : (data.blocks ?? []);
      const map = new Map<string, CmsBlock>();
      arr.forEach((b) => map.set(toStr(b.blockKey), {
        pageSlug: 'home', blockKey: toStr(b.blockKey), label: toStr(b.label),
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
        // Arabic
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
      }));
      setBlocks(map);
    });
  }, []);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type !== 'CMS_SELECT') return;
      const { blockKey, label, blockType, defaultContent } = e.data as {
        blockKey: string; label: string; blockType: BlockType; defaultContent: string;
      };
      const saved = blocks.get(blockKey);
      const arDefault = AR_DEFAULTS[blockKey] || '';
      setSelected(
        saved
          ? {
              ...saved,
              content:   saved.content   || defaultContent,
              contentAr: saved.contentAr || arDefault,
            }
          : { ...emptyBlock(blockKey, label, blockType, defaultContent), contentAr: arDefault }
      );
      setEditorLang(previewLang);
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [blocks, previewLang]);

  useEffect(() => {
    if (!selected || !iframeRef.current?.contentWindow) return;
    const isAr = previewLang === 'ar';
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

  // Set a field value — automatically uses the Ar-suffixed key when editorLang === 'ar'
  function set(key: string, val: string) {
    const actualKey = editorLang === 'ar' ? key + 'Ar' : key;
    setSelected((p) => p ? { ...p, [actualKey]: val } : p);
  }
  function toggle(key: string, onVal: string) {
    const actualKey = editorLang === 'ar' ? key + 'Ar' : key;
    setSelected((p) => {
      if (!p) return p;
      const cur = (p as Record<string, string>)[actualKey] ?? '';
      return { ...p, [actualKey]: cur === onVal ? '' : onVal };
    });
  }

  // Get the value for the current language's field
  function cur(key: string): string {
    if (!selected) return '';
    const actualKey = editorLang === 'ar' ? key + 'Ar' : key;
    return (selected as Record<string, string>)[actualKey] ?? '';
  }

  function switchPreviewLang(l: EditorLang) {
    setPreviewLang(l);
    iframeRef.current?.contentWindow?.postMessage({ type: 'CMS_SET_LANG', lang: l }, '*');
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selected) return;
    setUploading(true);
    const form = new FormData();
    form.append('image', file);
    const res = await fetch('/api/admin/cms/upload-image', {
      method: 'POST',
      credentials: 'include',
      body: form,
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
      setSelected(emptyBlock(selected.blockKey, selected.label, selected.blockType, selected.content));
    }
  }

  return (
    <div className="db-scope cms-page">

      {/* ── Top bar ── */}
      <header className="cms-topbar" style={{ position: 'relative' }}>
        <div className="cms-topbar-left">
          <Link href="/altjawal/admin-panel/dashboard/bookings" className="cms-back">
            <i className="fa-solid fa-chevron-left" /> Dashboard
          </Link>
          <span className="cms-topbar-divider" />
          <span className="cms-topbar-title">Homepage Editor</span>
        </div>

        {/* ── Preview language toggle ── */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex' }}>
          <button
            className={`cms-lang${previewLang === 'en' ? ' cms-lang--on' : ''}`}
            onClick={() => switchPreviewLang('en')}
          >
            EN
          </button>
          <button
            className={`cms-lang${previewLang === 'ar' ? ' cms-lang--on' : ''}`}
            onClick={() => switchPreviewLang('ar')}
          >
            AR
          </button>
        </div>

        <div className="cms-topbar-right">
          {saveMsg && (
            <span className={`cms-save-msg${saveMsg.startsWith('Failed') ? ' cms-save-msg--err' : ''}`}>
              {saveMsg}
            </span>
          )}
          <a href="/" target="_blank" rel="noreferrer" className="cms-btn cms-btn--ghost">
            <i className="fa-solid fa-arrow-up-right-from-square" /> View Site
          </a>
          {selected && (
            <button className="cms-btn cms-btn--primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="cms-body">

        <div className="cms-preview-wrap">
          <iframe
            ref={iframeRef}
            src="/"
            title="Homepage Preview"
            className="cms-iframe"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>

        {selected && (
          <div className="cms-panel">
            <div className="cms-panel-head">
              <div>
                <p className="cms-eyebrow">{selected.blockType}</p>
                <h3 className="cms-panel-title">{selected.label}</h3>
              </div>
              <button className="cms-close" onClick={closePanel}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* ── EN / AR language tabs ── */}
            <div className="cms-sec" style={{ paddingBottom: 12 }}>
              <div className="cms-lang-row">
                <button
                  className={`cms-lang${editorLang === 'en' ? ' cms-lang--on' : ''}`}
                  onClick={() => setEditorLang('en')}
                >
                  English
                </button>
                <button
                  className={`cms-lang${editorLang === 'ar' ? ' cms-lang--on' : ''}`}
                  onClick={() => setEditorLang('ar')}
                >
                  العربية
                </button>
              </div>
            </div>

            <div className="cms-panel-body">

              {selected.blockType === 'image' ? (
                <>
                  {/* IMAGE — only English (images don't change by language) */}
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

              {/* CONTENT */}
              <div className="cms-sec">
                <p className="cms-sec-label">
                  Content{editorLang === 'ar' ? ' (Arabic)' : ' (English)'}
                </p>
                <textarea
                  className="cms-textarea"
                  value={cur('content')}
                  rows={4}
                  dir={editorLang === 'ar' ? 'rtl' : 'ltr'}
                  onChange={(e) => set('content', e.target.value)}
                />
                <div className="cms-fmts">
                  <button
                    className={`cms-fmt${cur('fontWeight') === '700' ? ' on' : ''}`}
                    onClick={() => toggle('fontWeight', '700')}><b>B</b>
                  </button>
                  <button
                    className={`cms-fmt${cur('fontStyle') === 'italic' ? ' on' : ''}`}
                    onClick={() => toggle('fontStyle', 'italic')}><i>I</i>
                  </button>
                  <button
                    className={`cms-fmt${cur('textDecoration') === 'underline' ? ' on' : ''}`}
                    onClick={() => toggle('textDecoration', 'underline')}><u>U</u>
                  </button>
                </div>
              </div>

              {/* TYPOGRAPHY */}
              <div className="cms-sec">
                <p className="cms-sec-label">
                  Typography{editorLang === 'ar' ? ' (Arabic)' : ''}
                </p>
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

              {/* MARGIN */}
              <div className="cms-sec">
                <p className="cms-sec-label">Margin{editorLang === 'ar' ? ' (Arabic)' : ''}</p>
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

              {/* PADDING */}
              <div className="cms-sec">
                <p className="cms-sec-label">Padding{editorLang === 'ar' ? ' (Arabic)' : ''}</p>
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

              {/* LAYOUT */}
              <div className="cms-sec">
                <p className="cms-sec-label">Layout{editorLang === 'ar' ? ' (Arabic)' : ''}</p>
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
                  Reset {editorLang === 'ar' ? 'Arabic' : 'English'} styles
                </button>
              </div>

              </>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
