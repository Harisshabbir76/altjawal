'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/dashApi';
import '../../styles/dashboard/dashboard.css';

type QAItem   = { q: string; a: string };
type BlockType = 'text' | 'textarea' | 'image';

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

const FONT_FAMILIES = ['Default', 'DM Sans', 'Geist Sans', 'IvyPresto'];
const FONT_WEIGHTS  = ['Default', '300', '400', '500', '600', '700', '800', '900'];
const TEXT_ALIGNS   = ['Default', 'left', 'center', 'right'];

export default function FaqCmsDashboard() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ── Text block editing ────────────────────────────────────────────────────
  const [blocks, setBlocks]       = useState<Map<string, CmsBlock>>(new Map());
  const [selected, setSelected]   = useState<CmsBlock | null>(null);
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState('');
  const [uploading, setUploading] = useState(false);

  // ── Q&A manager ───────────────────────────────────────────────────────────
  // null = still loading from DB (no flash of wrong data)
  const [qaItems,    setQaItems]    = useState<QAItem[] | null>(null);
  const [qaEditIdx,  setQaEditIdx]  = useState<number | 'new' | null>(null);
  const [editQ,      setEditQ]      = useState('');
  const [editA,      setEditA]      = useState('');
  const [qaSaving,   setQaSaving]   = useState(false);
  const [qaMsg,      setQaMsg]      = useState('');

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
      setSelected(saved ? { ...saved } : emptyBlock('faq', blockKey, label, blockType, defaultContent));
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [blocks]);

  // ── Live preview update ───────────────────────────────────────────────────
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
    setSelected(emptyBlock('faq', selected.blockKey, selected.label, selected.blockType, selected.content));
  }

  // ── Q&A helpers ───────────────────────────────────────────────────────────
  function startEdit(idx: number | 'new') {
    const items = qaItems ?? [];
    if (idx === 'new') { setEditQ(''); setEditA(''); }
    else { setEditQ(stripNum(items[idx].q)); setEditA(items[idx].a); }
    setQaEditIdx(idx);
  }

  async function commitQaEdit() {
    if (!editQ.trim()) return;
    // Store plain text (no number) — persistQaItems renumbers everything
    const updated = [...(qaItems ?? [])];
    if (qaEditIdx === 'new') updated.push({ q: editQ.trim(), a: editA.trim() });
    else if (typeof qaEditIdx === 'number') updated[qaEditIdx] = { q: editQ.trim(), a: editA.trim() };
    setQaEditIdx(null);
    await persistQaItems(updated);
  }

  async function deleteQaItem(idx: number) {
    if (!window.confirm('Remove this question and its answer?')) return;
    await persistQaItems((qaItems ?? []).filter((_, i) => i !== idx));
  }

  async function persistQaItems(items: QAItem[]) {
    // Renumber every question sequentially before saving
    const renumbered = items.map((item, i) => ({
      q: `${i + 1}. ${stripNum(item.q)}`,
      a: item.a,
    }));
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="db-scope cms-page">

      <header className="cms-topbar">
        <div className="cms-topbar-left">
          <Link href="/altjawal/admin-panel/dashboard/bookings" className="cms-back">
            <i className="fa-solid fa-chevron-left" /> Dashboard
          </Link>
          <span className="cms-topbar-divider" />
          <span className="cms-topbar-title">FAQ Page Editor</span>
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

        {/* ── Right panel (always visible) ── */}
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
                      <p className="cms-sec-label">Content</p>
                      <div className="cms-lang-row">
                        <button className="cms-lang cms-lang--on">EN</button>
                        <button className="cms-lang">AR</button>
                      </div>
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

                  {/* New item form */}
                  {qaEditIdx === 'new' && (
                    <div className="cms-qa-form">
                      <p className="cms-sec-label" style={{ marginBottom: 10 }}>New Question</p>
                      <div className="cms-field">
                        <label className="cms-flabel">Question</label>
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
                        <label className="cms-flabel">Answer</label>
                        <textarea
                          className="cms-textarea"
                          placeholder="Enter answer…"
                          rows={4}
                          value={editA}
                          onChange={(e) => setEditA(e.target.value)}
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

                {/* Q&A list */}
                <div className="cms-qa-list">
                  {qaItems === null && (
                    <div className="cms-qa-empty">
                      <p>Loading…</p>
                    </div>
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
                        /* Edit form */
                        <div className="cms-qa-form">
                          <div className="cms-field">
                            <label className="cms-flabel">Question</label>
                            <input
                              className="cms-input"
                              type="text"
                              value={editQ}
                              onChange={(e) => setEditQ(e.target.value)}
                              autoFocus
                            />
                          </div>
                          <div className="cms-field">
                            <label className="cms-flabel">Answer</label>
                            <textarea
                              className="cms-textarea"
                              rows={4}
                              value={editA}
                              onChange={(e) => setEditA(e.target.value)}
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
                        /* Display row */
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
