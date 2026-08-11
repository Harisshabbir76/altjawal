'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/dashApi';
import '../../styles/dashboard/dashboard.css';

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

const FONT_FAMILIES = ['Default', 'DM Sans', 'Geist Sans', 'IvyPresto', 'Tajawal'];
const FONT_WEIGHTS  = ['Default', '300', '400', '500', '600', '700', '800', '900'];
const TEXT_ALIGNS   = ['Default', 'left', 'center', 'right'];

// Arabic default text per page slug, keyed by blockKey
const SLUG_AR_DEFAULTS: Record<string, Record<string, string>> = {
  contact: {
    'contact-heading':    'اتصل بنا',
    'contact-subheading': 'يسعدنا سماع أفكاركم. تواصلوا معنا عبر التفاصيل أدناه، وسنتواصل معكم لمناقشة كيف يمكننا إنشاء تجربة مخصصة لكم.',
    'contact-card-intro': 'شاركونا بعض التفاصيل، وسيتواصل فريقنا معكم لإرشادكم خلال الخطوات التالية.',
  },
  services: {
    'ms-hero-heading':    'فعاليات تجمع الناس',
    'ms-hero-para':       'من الاحتفالات الحميمة إلى التجمعات المؤسسية الكبيرة، نصنع تجارب مخططة بعناية ومنفذة بجمال تظل في الأذهان طويلاً بعد انتهاء الفعالية.',
    'ms-events-heading':  'لكل فعالية قصة.',
    'ms-pkg-heading':     'باقات مصممة وفق احتياجاتك',
    'ms-pkg-subtext':     'كل فعالية فريدة من نوعها. توفر باقاتنا المرنة الأساس المثالي، سواء كنت تخطط لتجمع حميم أو إنتاج فعالية كبرى.',
    'ms-pkg-label-1':    '01. أساسي',
    'ms-pkg-label-2':    '02. قياسي',
    'ms-pkg-label-3':    '03. مميز',
    'ms-pkg-tagline-1':  'مثالي للتجمعات الحميمة',
    'ms-pkg-tagline-2':  'مثالي للفعاليات المتوسطة الحجم',
    'ms-pkg-tagline-3':  'التجربة الفاخرة الشاملة',
    'ms-pkg-btn-1':      'احجز الآن',
    'ms-pkg-btn-2':      'احجز الآن',
    'ms-pkg-btn-3':      'احجز الآن',
    'ms-services-label-1': 'الخدمات:',
    'ms-services-label-2': 'الخدمات:',
    'ms-events-para-1':  'في الجوال، نؤمن بأن كل مناسبة تستحق تخطيطاً دقيقاً وتنفيذاً هادفاً. سواء كنت تحتفل بإنجاز شخصي أو تستضيف فعالية مؤسسية، يدير فريقنا كل تفصيلة بإبداع ودقة وضيافة إماراتية أصيلة.',
    'ms-events-para-2':  'من تطوير المفهوم إلى التنسيق الميداني، نضمن أن تسير كل لحظة بسلاسة تامة.',
    'ms-card-heading-1': 'الفعاليات المؤسسية',
    'ms-card-heading-2': 'الاحتفالات الخاصة',
    'ms-card-text-1':    'نقدم حلولاً احترافية للفعاليات مصممة للشركات والمنظمات، مع ضمان التخطيط السلس والتنفيذ المثالي. من المؤتمرات والندوات وإطلاق المنتجات إلى التجمعات المؤسسية وفعاليات التواصل ودعم المعارض، ندير كل تفصيلة لخلق تجارب مؤثرة ولا تُنسى.',
    'ms-card-text-2':    'نصنع احتفالات لا تُنسى مصممة لأكثر لحظات الحياة خصوصية. من حفلات الأعراس والخطوبة والتخرج إلى أعياد الميلاد والتجمعات العائلية وترتيبات طلب الزواج والنزهات الفاخرة وسائر المناسبات الخاصة، يضمن فريقنا أن تُخطط كل تفصيلة بعناية وتُنفذ بجمال.',
    'ms-events-btn-1':   'احجز الآن',
    'ms-events-btn-2':   'احجز الآن',
    'ms-corp-item-1':    'المؤتمرات والندوات',
    'ms-corp-item-2':    'إطلاق المنتجات',
    'ms-corp-item-3':    'التجمعات المؤسسية',
    'ms-corp-item-4':    'فعاليات التواصل',
    'ms-corp-item-5':    'الاجتماعات التنفيذية',
    'ms-corp-item-6':    'أنشطة بناء الفريق',
    'ms-corp-item-7':    'فعاليات تقدير الموظفين',
    'ms-corp-item-8':    'دعم المعارض',
    'ms-priv-item-1':    'حفلات الأعراس',
    'ms-priv-item-2':    'حفلات الخطوبة',
    'ms-priv-item-3':    'الاحتفالات بأعياد الميلاد',
    'ms-priv-item-4':    'حفلات التخرج',
    'ms-priv-item-5':    'التجمعات العائلية',
    'ms-priv-item-6':    'ترتيبات طلب الزواج',
    'ms-priv-item-7':    'النزهات الفاخرة',
    'ms-priv-item-8':    'المناسبات الخاصة',
    'ms-pkg-1-item-1':   'ما يصل إلى 80 ضيفاً',
    'ms-pkg-1-item-2':   'تصميم موضوع أساسي',
    'ms-pkg-1-item-3':   'إشراف يوم الفعالية',
    'ms-pkg-1-item-4':   'تقرير ملخص ما بعد الفعالية',
    'ms-pkg-2-item-1':   'ما يصل إلى 150 ضيفاً',
    'ms-pkg-2-item-2':   'موضوع وديكور مخصص',
    'ms-pkg-2-item-3':   'تنسيق طوال اليوم',
    'ms-pkg-2-item-4':   'إدارة الموردين',
    'ms-pkg-2-item-5':   'تغطية تصويرية',
    'ms-pkg-2-item-6':   'تقرير ملخص ما بعد الفعالية',
    'ms-pkg-3-item-1':   'ضيوف غير محدودين',
    'ms-pkg-3-item-2':   'موضوع وتصميم بمواصفات خاصة',
    'ms-pkg-3-item-3':   'مدير فعالية مخصص',
    'ms-pkg-3-item-4':   'تنسيق متكامل مع الموردين',
    'ms-pkg-3-item-5':   'باقة ديكور فاخرة',
    'ms-pkg-3-item-6':   'التصوير الفوتوغرافي والمرئي',
    'ms-pkg-3-item-7':   'تقرير ملخص ما بعد الفعالية',
  },
  events: {
    'ep-hero-heading':       'تصميم تجارب تترك انطباعاً دائماً',
    'ep-hero-para':          'إنتاج إبداعي وبيئات غامرة وفضاءات فعاليات مصممة بجمال لإحياء كل رؤية.',
    'ep-creativity-heading': 'حيث يلتقي الإبداع بالتنفيذ',
    'ep-creativity-subtext': 'الفعاليات الاستثنائية تبدأ بتصميم استثنائي.',
    'ep-creativity-para':    'يحوّل فريق الإنتاج لدينا الأفكار إلى بيئات غامرة من خلال التخطيط الدقيق والمفاهيم المبتكرة والتنفيذ المثالي. من أدق تفاصيل الديكور إلى الإنتاج الكامل للفعاليات، يتم اختيار كل عنصر بعناية فائقة.',
    'ep-pd-heading':         'الإنتاج والتصميم',
    'ep-pd-text':            'نحوّل الأفكار إلى تجارب فعاليات غامرة من خلال التصميم الإبداعي وحلول الإنتاج المبتكرة. من هوية الفعالية وتصميم المسرح والأجنحة وأركان المعارض والمفاهيم الزهرية إلى حلول الصوت والصورة وشاشات LED والتجارب التفاعلية وإنشاء المحتوى والتصوير الاحترافي، نحقق كل رؤية بدقة وإبداع.',
    'ep-pd-services-label':  'الخدمات:',
    'ep-pd-btn':             'احجز الآن',
    'ep-work-heading':       'كيف نعمل',
    'ep-work-btn':           'احجز الآن',
    'ep-pd-item-1':          'هوية وموضوعات الفعالية',
    'ep-pd-item-2':          'تصميم المسرح والأجنحة',
    'ep-pd-item-3':          'أركان المعارض',
    'ep-pd-item-4':          'المفاهيم الزهرية',
    'ep-pd-item-5':          'الخلفيات والتركيبات',
    'ep-pd-item-6':          'حلول الصوت والصورة',
    'ep-pd-item-7':          'شاشات LED',
    'ep-pd-item-8':          'التجارب التفاعلية',
    'ep-pd-item-9':          'إنشاء محتوى الفعاليات',
    'ep-pd-item-10':         'التصوير الفوتوغرافي والمرئي للفعاليات',
    'ep-step-label-1':       'اكتشف',
    'ep-step-label-2':       'صمّم',
    'ep-step-label-3':       'أنتج',
    'ep-step-label-4':       'سلّم',
    'ep-step-desc-1':        'فهم رؤيتك وأهدافك.',
    'ep-step-desc-2':        'إنشاء مفاهيم مصممة لفعاليتك.',
    'ep-step-desc-3':        'إدارة كل تفصيلة إنتاجية.',
    'ep-step-desc-4':        'تنفيذ مثالي من البداية إلى النهاية.',
  },
  branding: {
    'bs-hero-heading':     'بناء علامات تجارية تبرز',
    'bs-hero-para':        'إنشاء هويات بصرية مدروسة تحكي قصتك وتعزز حضورك وتترك انطباعاً دائماً.',
    'bs-logo-heading':     'أكثر من مجرد شعار',
    'bs-logo-subtext':     'علامتك التجارية هي الانطباع الأول الذي يتذكره الناس.',
    'bs-logo-para':        'في الجوال، نصنع هويات علامات تجارية متكاملة تعبّر عن قيمك وتتواصل مع جمهورك وتساعد عملك على النمو بثقة.',
    'bs-branding-heading': 'لماذا تهمّ العلامة التجارية؟',
    'bs-branding-para':    'العلامة التجارية القوية تخلق التعرف وتبني الثقة وتشكّل روابط دائمة. من خلال الاستراتيجية المدروسة والتصميم الخالد، نساعد الشركات على التواصل بثقة واتساق في كل نقطة تفاعل.',
    'bs-branding-btn':     'احجز استشارتك الآن',
    'bs-pkg-label-1':      'باقة إطلاق العلامة التجارية',
    'bs-pkg-label-2':      'باقة تجديد العلامة التجارية',
    'bs-pkg-btn-1':        'احجز الآن',
    'bs-pkg-btn-2':        'احجز الآن',
    'bs-pkg-1-item-1':     'استراتيجية العلامة التجارية',
    'bs-pkg-1-item-2':     'الشعار الأساسي',
    'bs-pkg-1-item-3':     'الشعار الثانوي',
    'bs-pkg-1-item-4':     'لوحة الألوان',
    'bs-pkg-1-item-5':     'اختيار الخطوط',
    'bs-pkg-1-item-6':     'إرشادات وسائل التواصل الاجتماعي',
    'bs-pkg-1-item-7':     'وثيقة إرشادات العلامة التجارية',
    'bs-pkg-1-item-8':     'تصميم بطاقة العمل',
    'bs-pkg-2-item-1':     'تدقيق واستراتيجية العلامة التجارية',
    'bs-pkg-2-item-2':     'إعادة تصميم الشعار',
    'bs-pkg-2-item-3':     'لوحة ألوان محدّثة',
    'bs-pkg-2-item-4':     'نظام خطوط جديد',
    'bs-pkg-2-item-5':     'أصول علامة تجارية منقّحة',
    'bs-pkg-2-item-6':     'تحديث إرشادات العلامة التجارية',
  },
};

export default function CmsPageTemplate({
  pageSlug, pageUrl, title,
}: {
  pageSlug: string; pageUrl: string; title: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [blocks, setBlocks]           = useState<Map<string, CmsBlock>>(new Map());
  const [selected, setSelected]       = useState<CmsBlock | null>(null);
  const [saving, setSaving]           = useState(false);
  const [saveMsg, setSaveMsg]         = useState('');
  const [uploading, setUploading]     = useState(false);
  const [editorLang, setEditorLang]   = useState<EditorLang>('en');
  const [previewLang, setPreviewLang] = useState<EditorLang>('en');

  useEffect(() => {
    apiFetch(`/api/admin/cms/${pageSlug}`).then(async (res) => {
      if (!res.ok) return;
      const data = await res.json();
      const arr: Record<string, unknown>[] = Array.isArray(data) ? data : (data.blocks ?? []);
      const map = new Map<string, CmsBlock>();
      arr.forEach((b) => map.set(toStr(b.blockKey), {
        pageSlug,
        blockKey: toStr(b.blockKey), label: toStr(b.label),
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
  }, [pageSlug]);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type !== 'CMS_SELECT') return;
      const { blockKey, label, blockType, defaultContent } = e.data as {
        blockKey: string; label: string; blockType: BlockType; defaultContent: string;
      };
      const saved    = blocks.get(blockKey);
      const arDef    = (SLUG_AR_DEFAULTS[pageSlug] ?? {})[blockKey] ?? '';
      setSelected(
        saved
          ? { ...saved, content: saved.content || defaultContent, contentAr: saved.contentAr || arDef }
          : { ...emptyBlock(pageSlug, blockKey, label, blockType, defaultContent), contentAr: arDef }
      );
      setEditorLang(previewLang);
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [blocks, pageSlug, previewLang]);

  useEffect(() => {
    if (!selected || !iframeRef.current?.contentWindow) return;
    const isAr    = previewLang === 'ar';
    const arDef   = (SLUG_AR_DEFAULTS[pageSlug] ?? {})[selected.blockKey] ?? '';
    const content = isAr
      ? (selected.contentAr || arDef || selected.content)
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
  }, [selected, previewLang, pageSlug]);

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
      setSelected(emptyBlock(pageSlug, selected.blockKey, selected.label, selected.blockType, selected.content));
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
          <span className="cms-topbar-title">{title}</span>
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
          <a href={pageUrl} target="_blank" rel="noreferrer" className="cms-btn cms-btn--ghost">
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
            src={pageUrl}
            title={`${title} Preview`}
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
