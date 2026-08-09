'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/dashApi';
import '../../styles/dashboard/dashboard.css';
import { LegalSection, DEFAULT_PRIVACY, DEFAULT_TERMS, DEFAULT_COOKIE } from '../../lib/legalDefaults';

type PolicyKey = 'privacy' | 'terms' | 'cookie';
type BlockType = 'text' | 'textarea' | 'image';

type CmsBlock = {
  pageSlug: string; blockKey: string; label: string; blockType: BlockType;
  content: string; image: string; height: string; fontFamily: string;
  fontSize: string; fontWeight: string; fontStyle: string; textDecoration: string;
  textColor: string; lineHeight: string; letterSpacing: string; textAlign: string;
  marginTop: string; marginRight: string; marginBottom: string; marginLeft: string;
  paddingTop: string; paddingRight: string; paddingBottom: string; paddingLeft: string;
  width: string; minHeight: string; maxWidth: string; maxHeight: string;
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

const FONT_FAMILIES = ['Default', 'DM Sans', 'Geist Sans', 'IvyPresto'];
const FONT_WEIGHTS  = ['Default', '300', '400', '500', '600', '700', '800', '900'];
const TEXT_ALIGNS   = ['Default', 'left', 'center', 'right'];

const POLICY_LABELS: Record<PolicyKey, string> = {
  privacy: 'Privacy Policy',
  terms:   'Terms & Conditions',
  cookie:  'Cookie Policy',
};
const BLOCK_KEYS: Record<PolicyKey, string> = {
  privacy: 'legal-privacy-sections',
  terms:   'legal-terms-sections',
  cookie:  'legal-cookie-sections',
};
const DEFAULTS: Record<PolicyKey, LegalSection[]> = {
  privacy: DEFAULT_PRIVACY,
  terms:   DEFAULT_TERMS,
  cookie:  DEFAULT_COOKIE,
};

export default function LegalCmsDashboard() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ── Text block editing ────────────────────────────────────────────────────
  const [blocks, setBlocks]       = useState<Map<string, CmsBlock>>(new Map());
  const [selected, setSelected]   = useState<CmsBlock | null>(null);
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState('');
  const [uploading, setUploading] = useState(false);

  // ── Section manager ───────────────────────────────────────────────────────
  const [activePolicy, setActivePolicy] = useState<PolicyKey>('privacy');
  const [sections, setSections]         = useState<Record<PolicyKey, LegalSection[] | null>>({
    privacy: null, terms: null, cookie: null,
  });
  const [editIdx,   setEditIdx]   = useState<number | 'new' | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody,  setEditBody]  = useState('');
  const [secSaving, setSecSaving] = useState(false);
  const [secMsg,    setSecMsg]    = useState('');

  // ── Load CMS data ─────────────────────────────────────────────────────────
  useEffect(() => {
    apiFetch('/api/admin/cms/legal').then(async (res) => {
      const data = res.ok ? await res.json() : {};
      const arr: Record<string, unknown>[] = Array.isArray(data) ? data : (data.blocks ?? []);
      const map = new Map<string, CmsBlock>();

      const loaded: Record<PolicyKey, LegalSection[] | null> = { privacy: null, terms: null, cookie: null };

      arr.forEach((b) => {
        const key = toStr(b.blockKey);
        if (key === 'legal-privacy-sections' || key === 'legal-terms-sections' || key === 'legal-cookie-sections') {
          try {
            const parsed: LegalSection[] = JSON.parse(toStr(b.content));
            if (Array.isArray(parsed) && parsed.length > 0) {
              if (key === 'legal-privacy-sections') loaded.privacy = parsed;
              if (key === 'legal-terms-sections')   loaded.terms   = parsed;
              if (key === 'legal-cookie-sections')  loaded.cookie  = parsed;
            }
          } catch { /* malformed JSON — fall through to defaults */ }
        }
        map.set(key, {
          pageSlug: 'legal', blockKey: key, label: toStr(b.label),
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
        });
      });

      setSections({
        privacy: loaded.privacy ?? DEFAULT_PRIVACY,
        terms:   loaded.terms   ?? DEFAULT_TERMS,
        cookie:  loaded.cookie  ?? DEFAULT_COOKIE,
      });
      setBlocks(map);
    }).catch(() => {
      setSections({ privacy: DEFAULT_PRIVACY, terms: DEFAULT_TERMS, cookie: DEFAULT_COOKIE });
    });
  }, []);

  // ── Listen for CMS_SELECT from iframe ────────────────────────────────────
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type !== 'CMS_SELECT') return;
      const { blockKey, label, blockType, defaultContent } = e.data as {
        blockKey: string; label: string; blockType: BlockType; defaultContent: string;
      };
      const saved = blocks.get(blockKey);
      setSelected(saved ? { ...saved } : emptyBlock('legal', blockKey, label, blockType, defaultContent));
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [blocks]);

  // ── Live preview ─────────────────────────────────────────────────────────
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

  // ── Text block helpers ────────────────────────────────────────────────────
  function set(key: keyof CmsBlock, val: string) {
    setSelected((p) => p ? { ...p, [key]: val } : p);
  }
  function toggle(key: keyof CmsBlock, onVal: string) {
    setSelected((p) => p ? { ...p, [key]: p[key] === onVal ? '' : onVal } : p);
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
    if (res.ok) { const d = await res.json(); set('image', d.url); }
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
    setSelected(emptyBlock('legal', selected.blockKey, selected.label, selected.blockType, selected.content));
  }

  // ── Section manager helpers ───────────────────────────────────────────────
  const currentSections = sections[activePolicy] ?? [];

  function startEdit(idx: number | 'new') {
    if (idx === 'new') {
      setEditTitle(''); setEditBody('');
    } else {
      setEditTitle(currentSections[idx].title);
      setEditBody(currentSections[idx].body);
    }
    setEditIdx(idx);
  }

  async function commitEdit() {
    if (!editTitle.trim()) return;
    const updated = [...currentSections];
    const item: LegalSection = { title: editTitle.trim(), body: editBody.trim() };
    if (editIdx === 'new') updated.push(item);
    else if (typeof editIdx === 'number') updated[editIdx] = item;
    setEditIdx(null);
    await persistSections(updated);
  }

  async function deleteSection(idx: number) {
    if (!window.confirm('Remove this section?')) return;
    await persistSections(currentSections.filter((_, i) => i !== idx));
  }

  async function persistSections(items: LegalSection[]) {
    const key   = BLOCK_KEYS[activePolicy];
    const label = POLICY_LABELS[activePolicy] + ' Sections';
    setSecSaving(true);
    const res = await apiFetch('/api/admin/cms/save-block', {
      method: 'POST',
      body: JSON.stringify(emptyBlock('legal', key, label, 'text', JSON.stringify(items))),
    });
    setSecSaving(false);
    if (res.ok) {
      setSections((prev) => ({ ...prev, [activePolicy]: items }));
      setSecMsg('Saved');
      setTimeout(() => setSecMsg(''), 2500);
      if (iframeRef.current) iframeRef.current.src = '/legal';
    } else {
      setSecMsg('Error saving');
      setTimeout(() => setSecMsg(''), 3000);
    }
  }

  function resetToDefaults() {
    if (!window.confirm(`Reset ${POLICY_LABELS[activePolicy]} to default content?`)) return;
    persistSections(DEFAULTS[activePolicy]);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="db-scope cms-page">

      <header className="cms-topbar">
        <div className="cms-topbar-left">
          <Link href="/altjawal/admin-panel/dashboard/bookings" className="cms-back">
            <i className="fa-solid fa-chevron-left" /> Dashboard
          </Link>
          <span className="cms-topbar-divider" />
          <span className="cms-topbar-title">Legal Page Editor</span>
        </div>
        <div className="cms-topbar-right">
          {saveMsg && (
            <span className={`cms-save-msg${saveMsg.startsWith('Failed') ? ' cms-save-msg--err' : ''}`}>
              {saveMsg}
            </span>
          )}
          <a href="/legal" target="_blank" rel="noreferrer" className="cms-btn cms-btn--ghost">
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
            src="/legal"
            title="Legal Editor Preview"
            className="cms-iframe"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>

        {/* ── Right panel ── */}
        <div className="cms-panel">

          {selected ? (
            /* ── Text block editor (title / subtitle clicked in iframe) ── */
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
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                        {uploading ? 'Uploading…' : '+ Upload Image'}
                      </label>
                      <div className="cms-field" style={{ marginTop: 8 }}>
                        <label className="cms-flabel">Or paste URL</label>
                        <input className="cms-input" type="text" placeholder="https://…"
                          value={selected.image} onChange={(e) => set('image', e.target.value)} />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
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
                      </div>
                      <button className="cms-reset-btn" onClick={resetStyles}>
                        Reset English styles
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>

          ) : (
            /* ── Section Manager ── */
            <>
              <div className="cms-panel-head">
                <div>
                  <p className="cms-eyebrow">Legal Manager</p>
                  <h3 className="cms-panel-title">{POLICY_LABELS[activePolicy]}</h3>
                </div>
                {secMsg && (
                  <span className={`cms-save-msg${secMsg.startsWith('Error') ? ' cms-save-msg--err' : ''}`}>
                    {secMsg}
                  </span>
                )}
              </div>

              {/* Policy tab switcher */}
              <div className="cms-policy-tabs">
                {(['privacy', 'terms', 'cookie'] as PolicyKey[]).map((p) => (
                  <button
                    key={p}
                    className={`cms-policy-tab${activePolicy === p ? ' cms-policy-tab--on' : ''}`}
                    onClick={() => { setActivePolicy(p); setEditIdx(null); }}
                  >
                    {p === 'privacy' ? 'Privacy' : p === 'terms' ? 'Terms' : 'Cookies'}
                  </button>
                ))}
              </div>

              <div className="cms-panel-body">
                <div className="cms-qa-top">
                  {editIdx !== 'new' && (
                    <button className="cms-btn cms-btn--primary cms-qa-add-btn" onClick={() => startEdit('new')}>
                      <i className="fa-solid fa-plus" /> Add Section
                    </button>
                  )}

                  {/* New section form */}
                  {editIdx === 'new' && (
                    <div className="cms-qa-form">
                      <p className="cms-sec-label" style={{ marginBottom: 10 }}>New Section</p>
                      <div className="cms-field">
                        <label className="cms-flabel">Section Title</label>
                        <input
                          className="cms-input"
                          type="text"
                          placeholder="e.g. Data Retention"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="cms-field">
                        <label className="cms-flabel">Body</label>
                        <textarea
                          className="cms-textarea"
                          placeholder="Enter content… Start a line with • for a bullet point."
                          rows={6}
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                        />
                      </div>
                      <div className="cms-qa-form-btns">
                        <button
                          className="cms-btn cms-btn--primary"
                          onClick={commitEdit}
                          disabled={secSaving || !editTitle.trim()}
                        >
                          {secSaving ? 'Saving…' : 'Add'}
                        </button>
                        <button className="cms-btn cms-btn--ghost" onClick={() => setEditIdx(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section list */}
                <div className="cms-qa-list cms-section-list">
                  {sections[activePolicy] === null && (
                    <div className="cms-qa-empty"><p>Loading…</p></div>
                  )}

                  {currentSections.map((sec, idx) => (
                    <div key={idx} className="cms-qa-item">
                      {editIdx === idx ? (
                        <div className="cms-qa-form">
                          <div className="cms-field">
                            <label className="cms-flabel">Section Title</label>
                            <input
                              className="cms-input"
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              autoFocus
                            />
                          </div>
                          <div className="cms-field">
                            <label className="cms-flabel">Body</label>
                            <textarea
                              className="cms-textarea"
                              rows={6}
                              value={editBody}
                              onChange={(e) => setEditBody(e.target.value)}
                            />
                          </div>
                          <div className="cms-qa-form-btns">
                            <button
                              className="cms-btn cms-btn--primary"
                              onClick={commitEdit}
                              disabled={secSaving || !editTitle.trim()}
                            >
                              {secSaving ? 'Saving…' : 'Save'}
                            </button>
                            <button className="cms-btn cms-btn--ghost" onClick={() => setEditIdx(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="cms-qa-row">
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p className="cms-qa-q">{sec.title}</p>
                            <p className="cms-section-body-preview">
                              {sec.body.replace(/\n/g, ' ').slice(0, 80)}{sec.body.length > 80 ? '…' : ''}
                            </p>
                          </div>
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
                              onClick={() => deleteSection(idx)}
                            >
                              <i className="fa-solid fa-trash" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="cms-legal-footer">
                  <p className="cms-qa-hint">
                    <i className="fa-solid fa-circle-info" />
                    Start a line with <strong>•&nbsp;</strong> to create a bullet list. Click the page title or subtitle in the preview to edit them.
                  </p>
                  <button className="cms-reset-btn" style={{ margin: '0 16px 12px' }} onClick={resetToDefaults}>
                    Reset to defaults
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
