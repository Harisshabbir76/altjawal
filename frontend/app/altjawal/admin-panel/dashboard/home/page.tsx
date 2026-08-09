'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../../lib/dashApi';
import '../../../../styles/dashboard/dashboard.css';

type BlockType = 'text' | 'textarea' | 'image';

type CmsBlock = {
  pageSlug: string;
  blockKey: string;
  label: string;
  blockType: BlockType;
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

const FONT_FAMILIES = ['Default', 'DM Sans', 'Geist Sans', 'IvyPresto'];
const FONT_WEIGHTS  = ['Default', '300', '400', '500', '600', '700', '800', '900'];
const TEXT_ALIGNS   = ['Default', 'left', 'center', 'right'];

export default function HomeCmsPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [blocks, setBlocks]   = useState<Map<string, CmsBlock>>(new Map());
  const [selected, setSelected] = useState<CmsBlock | null>(null);
  const [saving, setSaving]   = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

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
        fontFamily: toStr(b.fontFamily),
        fontSize: toStr(b.fontSize), fontWeight: toStr(b.fontWeight),
        fontStyle: toStr(b.fontStyle), textDecoration: toStr(b.textDecoration),
        textColor: toStr(b.textColor), lineHeight: toStr(b.lineHeight),
        letterSpacing: toStr(b.letterSpacing), textAlign: toStr(b.textAlign),
        marginTop: toStr(b.marginTop), marginRight: toStr(b.marginRight),
        marginBottom: toStr(b.marginBottom), marginLeft: toStr(b.marginLeft),
        paddingTop: toStr(b.paddingTop), paddingRight: toStr(b.paddingRight),
        paddingBottom: toStr(b.paddingBottom), paddingLeft: toStr(b.paddingLeft),
        width: toStr(b.width), minHeight: toStr(b.minHeight),
        maxWidth: toStr(b.maxWidth), maxHeight: toStr(b.maxHeight),
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
      setSelected(
        saved
          ? { ...saved, content: saved.content || defaultContent }
          : emptyBlock(blockKey, label, blockType, defaultContent)
      );
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [blocks]);

  // Send live preview to iframe on every selected change
  useEffect(() => {
    if (!selected || !iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      {
        type: 'CMS_LIVE_UPDATE',
        blockKey: selected.blockKey,
        content: selected.content,
        imageSrc: selected.blockType === 'image' ? selected.image : undefined,
        styles: buildStyles(selected),
      },
      '*'
    );
  }, [selected]);

  function set(key: keyof CmsBlock, val: string) {
    setSelected((p) => p ? { ...p, [key]: val } : p);
  }
  function toggle(key: keyof CmsBlock, onVal: string) {
    setSelected((p) => p ? { ...p, [key]: p[key] === onVal ? '' : onVal } : p);
  }

  const [uploading, setUploading] = useState(false);

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
    setSelected(emptyBlock(selected.blockKey, selected.label, selected.blockType, selected.content));
  }

  return (
    <div className="db-scope cms-page">

      {/* ── Top bar ── */}
      <header className="cms-topbar">
        <div className="cms-topbar-left">
          <Link href="/altjawal/admin-panel/dashboard/bookings" className="cms-back">
            <i className="fa-solid fa-chevron-left" /> Dashboard
          </Link>
          <span className="cms-topbar-divider" />
          <span className="cms-topbar-title">Homepage Editor</span>
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

        {/* Preview iframe — expands to fill all available space */}
        <div className="cms-preview-wrap">
          <iframe
            ref={iframeRef}
            src="/"
            title="Homepage Preview"
            className="cms-iframe"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>

        {/* Edit panel — only rendered when an element is selected */}
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

            <div className="cms-panel-body">

              {selected.blockType === 'image' ? (
                <>
                  {/* IMAGE */}
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

                  {/* IMAGE SIZE */}
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

                  {/* SPACING FOR IMAGES */}
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
                <p className="cms-sec-label">Content</p>
                <textarea
                  className="cms-textarea"
                  value={selected.content}
                  rows={4}
                  onChange={(e) => set('content', e.target.value)}
                />
                <div className="cms-fmts">
                  <button className={`cms-fmt${selected.fontWeight === '700' ? ' on' : ''}`}
                    onClick={() => toggle('fontWeight', '700')}><b>B</b></button>
                  <button className={`cms-fmt${selected.fontStyle === 'italic' ? ' on' : ''}`}
                    onClick={() => toggle('fontStyle', 'italic')}><i>I</i></button>
                  <button className={`cms-fmt${selected.textDecoration === 'underline' ? ' on' : ''}`}
                    onClick={() => toggle('textDecoration', 'underline')}><u>U</u></button>
                </div>
              </div>

              {/* TYPOGRAPHY */}
              <div className="cms-sec">
                <p className="cms-sec-label">Typography</p>
                <div className="cms-field">
                  <label className="cms-flabel">Font Family</label>
                  <select className="cms-select" value={selected.fontFamily}
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
                      value={selected.fontSize} onChange={(e) => set('fontSize', e.target.value)} />
                  </div>
                  <div className="cms-field">
                    <label className="cms-flabel">Weight</label>
                    <select className="cms-select" value={selected.fontWeight}
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
                      value={selected.textColor || '#000000'}
                      onChange={(e) => set('textColor', e.target.value)} />
                    <input className="cms-input" type="text" placeholder="#000000"
                      value={selected.textColor} onChange={(e) => set('textColor', e.target.value)} />
                  </div>
                </div>
                <div className="cms-grid2">
                  <div className="cms-field">
                    <label className="cms-flabel">Letter Spacing</label>
                    <input className="cms-input" type="text" placeholder="2px"
                      value={selected.letterSpacing} onChange={(e) => set('letterSpacing', e.target.value)} />
                  </div>
                  <div className="cms-field">
                    <label className="cms-flabel">Text Align</label>
                    <select className="cms-select" value={selected.textAlign}
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

              {/* PADDING */}
              <div className="cms-sec">
                <p className="cms-sec-label">Padding</p>
                <div className="cms-grid2">
                  {(['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] as const).map((k) => (
                    <div className="cms-field" key={k}>
                      <label className="cms-flabel">{k.replace('padding', '')}</label>
                      <div className="cms-px-wrap">
                        <input className="cms-input cms-input--px" type="text" placeholder="0"
                          value={selected[k]} onChange={(e) => set(k, e.target.value)} />
                        <span className="cms-px">px</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LAYOUT */}
              <div className="cms-sec">
                <p className="cms-sec-label">Layout</p>
                <div className="cms-grid2">
                  <div className="cms-field">
                    <label className="cms-flabel">Line Height</label>
                    <input className="cms-input" type="text" placeholder="1.5"
                      value={selected.lineHeight} onChange={(e) => set('lineHeight', e.target.value)} />
                  </div>
                  <div className="cms-field">
                    <label className="cms-flabel">Width</label>
                    <input className="cms-input" type="text" placeholder="100%"
                      value={selected.width} onChange={(e) => set('width', e.target.value)} />
                  </div>
                  <div className="cms-field">
                    <label className="cms-flabel">Min Height</label>
                    <input className="cms-input" type="text" placeholder="120px"
                      value={selected.minHeight} onChange={(e) => set('minHeight', e.target.value)} />
                  </div>
                  <div className="cms-field">
                    <label className="cms-flabel">Max Width</label>
                    <input className="cms-input" type="text" placeholder="800px"
                      value={selected.maxWidth} onChange={(e) => set('maxWidth', e.target.value)} />
                  </div>
                </div>
                <button className="cms-reset-btn" onClick={resetStyles}>
                  Reset English styles
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
