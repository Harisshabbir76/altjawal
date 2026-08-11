'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../../lib/dashApi';
import '../../../../styles/dashboard/dashboard.css';

type BlockType  = 'text' | 'textarea' | 'image';
type EditorLang = 'en' | 'ar';

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

function emptyBlock(blockKey: string, label: string, blockType: BlockType, content: string): CmsBlock {
  return {
    pageSlug: 'about', blockKey, label, blockType, content,
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
  // Hero
  'page_hero_heading': 'مستوحى من التراث.\nمصمم لتجارب استثنائية.',
  'page_hero_subtext': 'نمزج الضيافة الإماراتية الأصيلة مع الإبداع المعاصر لخلق فعاليات ذات معنى في أنحاء الإمارات.',
  // Story (Experience section)
  'story_heading':       'كل تجربة عظيمة تبدأ بقصة ذات معنى.',
  'about-exp-para-1':    'تأسس الجوال بإيمان بسيط:\nكل تجمع واحتفال ومحطة تستحق أن تُعاش بجمال.',
  'about-exp-para-2':    'بوصفنا شركة إماراتية لإدارة الفعاليات، نصنع تجارب تعكس الثقافة والتواصل والحرفية. كل فعالية مصممة بعناية لجمع الناس من خلال الإبداع والدقة والضيافة الحقيقية.',
  'about-exp-para-3':    'سواء كان الأمر احتفالاً عائلياً حميمياً أو فعالية مؤسسية كبيرة، نتعامل مع كل مشروع بنفس الالتزام بالتميز، لضمان أن تُسهم كل تفصيلة في تجربة لا تُنسى.',
  // Build section
  'mission_heading':     'نبني أكثر من مجرد فعاليات',
  'about-build-para-1':  'نبني ذكريات.\nنبني علاقات.\nنبني لحظات يتذكرها الناس طويلاً بعد انتهاء الاحتفال. كل مناسبة تحكي قصة، ودورنا هو إحياؤها من خلال التخطيط الدقيق والتصميم الأنيق والتنفيذ المثالي.',
  // Inspired section
  'vision_heading':          'مستوحى من الظفرة.\nمتجذر في قلب الإمارات.',
  'about-inspired-para-1':   'تبدأ قصتنا في الظفرة، حيث يواصل جمال الصحاري اللانهائية والسواحل الهادئة والتقاليد الإماراتية الأصيلة إلهام كل ما نصنع.',
  'about-inspired-para-2':   'تُشكّل هذه المناظر رؤيتنا الإبداعية وتؤثر في الطريقة التي نصمم بها تجارب تبدو خالدة وأنيقة ومرتبطة ارتباطاً عميقاً بثقافة الإمارات.',
  // Values / Guide section
  'values_heading':          'ما يوجّه كل ما نفعله',
  'about-guide-title-1':     'الإبداع',
  'about-guide-title-2':     'التميز',
  'about-guide-title-3':     'الضيافة',
  'about-guide-title-4':     'الاستدامة',
  'about-guide-desc-1':      'كل فعالية تبدأ بفكرة أصيلة مصممة خصيصاً لك.',
  'about-guide-desc-2':      'نؤمن أن التجارب الاستثنائية تُبنى من خلال التخطيط الدقيق والاهتمام بالتفاصيل.',
  'about-guide-desc-3':      'مستوحاةً من التقاليد الإماراتية الأصيلة، نصنع تجارب ترحيبية يشعر فيها كل ضيف بالتقدير.',
  'about-guide-desc-4':      'نتبنى ممارسات الفعاليات المسؤولة بإعطاء الأولوية للمواد القابلة لإعادة الاستخدام وأساليب الإنتاج المدروسة والحلول الصديقة للبيئة الداعمة لرؤية الإمارات نحو مستقبل أكثر استدامة.',
  // Founder section
  'team_heading':            'تعرّف على مؤسستنا\nهيا المنصوري،\nالمؤسسة والمديرة التنفيذية',
  'about-founder-para-1':    'وُلدت هيا المنصوري وترعرعت في الظفرة، وأسست الجوال بشغف لخلق تجارب تجمع الناس بعضهم ببعض.',
  'about-founder-para-2':    'مدفوعةً بالإبداع والتنظيم الاستثنائي وأسلوب يضع الإنسان في المقام الأول، تؤمن بأن كل فعالية—بصرف النظر عن حجمها—تستحق تخطيطاً متأنياً وتصميماً راقياً وضيافة حقيقية.',
  'about-founder-para-3':    'اليوم، تواصل رؤيتها تشكيل الجوال ليكون شريكاً موثوقاً للشركات والعائلات والمنظمات الساعية إلى تجارب استثنائية في أنحاء الإمارات.',
  // Stats section
  'about-stats-heading':     'نصنع تجارب تترك أثراً',
  'about-exp-value-1':       '10+',
  'about-exp-value-2':       '27+',
  'about-exp-value-3':       '5',
  'about-exp-value-4':       '19+',
  'about-exp-label-1':       'سنوات من الخبرة',
  'about-exp-label-2':       'مشروع ناجح',
  'about-exp-label-3':       'إمارات نخدمها',
  'about-exp-label-4':       'عميل راضٍ',
};

const FONT_FAMILIES = ['Default', 'DM Sans', 'Geist Sans', 'IvyPresto', 'Tajawal'];
const FONT_WEIGHTS  = ['Default', '300', '400', '500', '600', '700', '800', '900'];
const TEXT_ALIGNS   = ['Default', 'left', 'center', 'right'];

export default function AboutCmsPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [blocks, setBlocks]           = useState<Map<string, CmsBlock>>(new Map());
  const [selected, setSelected]       = useState<CmsBlock | null>(null);
  const [saving, setSaving]           = useState(false);
  const [saveMsg, setSaveMsg]         = useState('');
  const [uploading, setUploading]     = useState(false);
  const [editorLang, setEditorLang]   = useState<EditorLang>('en');
  const [previewLang, setPreviewLang] = useState<EditorLang>('en');

  useEffect(() => {
    apiFetch('/api/admin/cms/about').then(async (res) => {
      if (!res.ok) return;
      const data = await res.json();
      const arr: Record<string, unknown>[] = Array.isArray(data) ? data : (data.blocks ?? []);
      const map = new Map<string, CmsBlock>();
      arr.forEach((b) => map.set(toStr(b.blockKey), {
        pageSlug: 'about', blockKey: toStr(b.blockKey), label: toStr(b.label),
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
      const saved  = blocks.get(blockKey);
      const arDef  = AR_DEFAULTS[blockKey] ?? '';
      setSelected(
        saved
          ? { ...saved, content: saved.content || defaultContent, contentAr: saved.contentAr || arDef }
          : { ...emptyBlock(blockKey, label, blockType, defaultContent), contentAr: arDef }
      );
      setEditorLang(previewLang);
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [blocks, previewLang]);

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
      setSelected(emptyBlock(selected.blockKey, selected.label, selected.blockType, selected.content));
    }
  }

  const isAr = editorLang === 'ar';

  return (
    <div className="db-scope cms-page">

      <header className="cms-topbar" style={{ position: 'relative' }}>
        <div className="cms-topbar-left">
          <Link href="/altjawal/admin-panel/dashboard/bookings" className="cms-back">
            <i className="fa-solid fa-chevron-left" /> Dashboard
          </Link>
          <span className="cms-topbar-divider" />
          <span className="cms-topbar-title">About Us Editor</span>
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
          <a href="/about" target="_blank" rel="noreferrer" className="cms-btn cms-btn--ghost">
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

        <div className="cms-preview-wrap">
          <iframe
            ref={iframeRef}
            src="/about"
            title="About Us Preview"
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
          </div>
        )}
      </div>
    </div>
  );
}
