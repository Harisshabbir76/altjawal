'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/dashApi';

type Block = {
  blockKey: string;
  label: string;
  blockType: 'text' | 'image' | 'hero' | 'card';
  content: string;
  image: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  textAlign: string;
  paddingTop: string;
  paddingBottom: string;
  paddingLeft: string;
  paddingRight: string;
  marginTop: string;
  marginBottom: string;
  width: string;
  height: string;
  borderRadius: string;
};

const EMPTY_BLOCK: Omit<Block, 'blockKey' | 'label' | 'blockType'> = {
  content: '',
  image: '',
  fontSize: '',
  fontWeight: '',
  color: '',
  textAlign: '',
  paddingTop: '',
  paddingBottom: '',
  paddingLeft: '',
  paddingRight: '',
  marginTop: '',
  marginBottom: '',
  width: '',
  height: '',
  borderRadius: '',
};

export default function CmsEditor({ pageSlug }: { pageSlug: string }) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selected, setSelected] = useState<Block | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    apiFetch(`/api/admin/cms/${pageSlug}`).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        const arr: Block[] = Array.isArray(data) ? data : (data.blocks ?? []);
        setBlocks(arr);
        if (arr.length > 0) setSelected(arr[0]);
      }
    });
  }, [pageSlug]);

  function selectBlock(block: Block) {
    setSelected({ ...block });
    setSaveMsg('');
  }

  function updateField(key: keyof Block, value: string) {
    setSelected((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    setSaveMsg('');
    const res = await apiFetch('/api/admin/cms/save-block', {
      method: 'POST',
      body: JSON.stringify({ pageSlug, ...selected }),
    });
    if (res.ok) {
      setSaveMsg('Saved.');
      setBlocks((prev) => prev.map((b) => b.blockKey === selected.blockKey ? { ...selected } : b));
      setTimeout(() => setSaveMsg(''), 2000);
    } else {
      setSaveMsg('Save failed.');
    }
    setSaving(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0] || !selected) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    const res = await fetch('/api/admin/cms/upload-image', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      updateField('image', data.url);
    }
    setUploading(false);
  }

  const showImage = selected?.blockType === 'image' || selected?.blockType === 'hero' || selected?.blockType === 'card';

  return (
    <div className="db-cms-layout">
      <aside className="db-cms-sidebar">
        <p className="db-cms-sidebar-title">Blocks</p>
        <ul className="db-cms-block-list">
          {blocks.map((block) => (
            <li key={block.blockKey}>
              <button
                className={`db-cms-block-item${selected?.blockKey === block.blockKey ? ' db-cms-block-item--active' : ''}`}
                onClick={() => selectBlock(block)}
              >
                <span className="db-cms-block-label">{block.label}</span>
                <span className="db-cms-block-type">{block.blockType}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="db-cms-editor">
        {!selected ? (
          <p className="db-empty">Select a block to edit.</p>
        ) : (
          <>
            <div className="db-cms-editor-header">
              <h3>{selected.label}</h3>
              <span className="db-cms-block-type">{selected.blockType}</span>
            </div>

            <section className="db-cms-section">
              <h4 className="db-cms-section-title">Content</h4>
              <div className="db-field">
                <label>Text Content</label>
                <textarea
                  value={selected.content}
                  onChange={(e) => updateField('content', e.target.value)}
                  rows={4}
                  className="db-textarea"
                  placeholder="Enter content text…"
                />
              </div>

              {showImage && (
                <div className="db-field">
                  <label>Image</label>
                  {selected.image && (
                    <img src={selected.image} alt="preview" className="db-cms-img-preview" />
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="db-file-input" />
                  {uploading && <span className="db-cms-upload-status">Uploading…</span>}
                  {selected.image && (
                    <input
                      type="text"
                      value={selected.image}
                      onChange={(e) => updateField('image', e.target.value)}
                      className="db-input"
                      placeholder="Or paste image URL"
                    />
                  )}
                </div>
              )}
            </section>

            <section className="db-cms-section">
              <h4 className="db-cms-section-title">Typography</h4>
              <div className="db-cms-grid-2">
                <div className="db-field">
                  <label>Font Size</label>
                  <input type="text" value={selected.fontSize} onChange={(e) => updateField('fontSize', e.target.value)} className="db-input" placeholder="e.g. 2rem" />
                </div>
                <div className="db-field">
                  <label>Font Weight</label>
                  <input type="text" value={selected.fontWeight} onChange={(e) => updateField('fontWeight', e.target.value)} className="db-input" placeholder="e.g. 700" />
                </div>
                <div className="db-field">
                  <label>Color</label>
                  <input type="text" value={selected.color} onChange={(e) => updateField('color', e.target.value)} className="db-input" placeholder="e.g. #1e1e1e" />
                </div>
                <div className="db-field">
                  <label>Text Align</label>
                  <select value={selected.textAlign} onChange={(e) => updateField('textAlign', e.target.value)} className="db-select">
                    <option value="">—</option>
                    <option>left</option>
                    <option>center</option>
                    <option>right</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="db-cms-section">
              <h4 className="db-cms-section-title">Spacing</h4>
              <div className="db-cms-grid-2">
                {(['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'marginTop', 'marginBottom'] as const).map((k) => (
                  <div className="db-field" key={k}>
                    <label>{k.replace(/([A-Z])/g, ' $1').trim()}</label>
                    <input type="text" value={selected[k]} onChange={(e) => updateField(k, e.target.value)} className="db-input" placeholder="e.g. 1rem" />
                  </div>
                ))}
              </div>
            </section>

            <section className="db-cms-section">
              <h4 className="db-cms-section-title">Dimensions</h4>
              <div className="db-cms-grid-2">
                {(['width', 'height', 'borderRadius'] as const).map((k) => (
                  <div className="db-field" key={k}>
                    <label>{k.replace(/([A-Z])/g, ' $1').trim()}</label>
                    <input type="text" value={selected[k]} onChange={(e) => updateField(k, e.target.value)} className="db-input" placeholder="e.g. 100%" />
                  </div>
                ))}
              </div>
            </section>

            <div className="db-cms-save-bar">
              {saveMsg && <span className={saveMsg === 'Saved.' ? 'db-save-success' : 'db-login-error'}>{saveMsg}</span>}
              <button className="db-btn db-btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save Block'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
