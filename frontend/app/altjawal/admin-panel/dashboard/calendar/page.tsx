'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import { apiFetch } from '../../../../lib/dashApi';

type Item = {
  _id?: string;
  date: string;
  fullDay: boolean;
  startTime: string;
  endTime: string;
  _server?: { fullDay: boolean; startTime: string; endTime: string };
};

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const WEEKDAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function pad(n: number) { return String(n).padStart(2, '0'); }

function dateKey(y: number, m0: number, d: number) {
  return `${y}-${pad(m0 + 1)}-${pad(d)}`;
}

function buildGrid(y: number, m0: number): (number | null)[] {
  const first = new Date(y, m0, 1).getDay();
  const days  = new Date(y, m0 + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function fmt12h(t: string): string {
  if (!t) return '';
  const [hs, ms] = t.split(':');
  let h = parseInt(hs, 10);
  const mer = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${ms || '00'} ${mer}`;
}

function formatLong(dateStr: string): string {
  const [y, mo, d] = dateStr.split('-').map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

function isDirty(item: Item): boolean {
  if (!item._id || !item._server) return true;
  return (
    item.fullDay    !== item._server.fullDay    ||
    item.startTime  !== item._server.startTime  ||
    item.endTime    !== item._server.endTime
  );
}

function TimePicker({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  const [hs, ms] = (value || '09:00').split(':');
  const h24 = parseInt(hs, 10) || 9;
  const min  = parseInt(ms,  10) || 0;
  const mer  = h24 >= 12 ? 'PM' : 'AM';
  const h12  = h24 % 12 || 12;

  function update(newH12: number, newMin: number, newMer: string) {
    let h = newH12 % 12;
    if (newMer === 'PM') h += 12;
    onChange(`${pad(h)}:${pad(newMin)}`);
  }

  return (
    <div className="db-cal-time-group">
      <span className="db-cal-time-label">{label}</span>
      <div className="db-cal-time-selects">
        <select
          className="db-cal-time-select"
          value={h12}
          onChange={e => update(+e.target.value, min, mer)}
        >
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        <span className="db-cal-time-sep">:</span>
        <select
          className="db-cal-time-select"
          value={min}
          onChange={e => update(h12, +e.target.value, mer)}
        >
          {Array.from({ length: 60 }, (_, i) => i).map(m => (
            <option key={m} value={m}>{pad(m)}</option>
          ))}
        </select>
        <select
          className="db-cal-time-select"
          value={mer}
          onChange={e => update(h12, min, e.target.value)}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const now = new Date();
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [items,    setItems]    = useState<Item[]>([]);
  const [saving,   setSaving]   = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<Set<string>>(new Set());

  const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());

  useEffect(() => {
    apiFetch('/api/admin/off-days').then(async (r) => {
      if (r.ok) {
        const data: Item[] = await r.json();
        setItems(data.map(d => ({
          ...d,
          _server: { fullDay: d.fullDay, startTime: d.startTime, endTime: d.endTime },
        })));
      }
    });
  }, []);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const prefix  = `${viewYear}-${pad(viewMonth + 1)}`;
  const grid    = buildGrid(viewYear, viewMonth);
  const visible = items
    .filter(i => i.date.startsWith(prefix))
    .sort((a, b) => {
      if (a._id && !b._id) return -1;
      if (!a._id && b._id) return  1;
      return a.date.localeCompare(b.date);
    });

  function handleDayClick(day: number) {
    const key      = dateKey(viewYear, viewMonth, day);
    const existing = items.find(i => i.date === key);
    if (existing?._id) return;
    if (existing) {
      setItems(prev => prev.filter(i => i.date !== key));
    } else {
      setItems(prev => [
        ...prev,
        { date: key, fullDay: true, startTime: '09:00', endTime: '17:00' },
      ]);
    }
  }

  function updateItem(date: string, patch: Partial<Item>) {
    setItems(prev => prev.map(i => i.date === date ? { ...i, ...patch } : i));
  }

  async function handleSave(item: Item) {
    setSaving(prev => new Set(prev).add(item.date));
    try {
      const r = await apiFetch('/api/admin/off-days', {
        method: 'POST',
        body: JSON.stringify({
          date: item.date,
          fullDay: item.fullDay,
          startTime: item.startTime,
          endTime: item.endTime,
        }),
      });
      if (r.ok) {
        const saved: Item = await r.json();
        setItems(prev => prev.map(i =>
          i.date === item.date
            ? { ...saved, _server: { fullDay: saved.fullDay, startTime: saved.startTime, endTime: saved.endTime } }
            : i
        ));
      }
    } finally {
      setSaving(prev => { const s = new Set(prev); s.delete(item.date); return s; });
    }
  }

  async function handleDelete(item: Item) {
    if (!item._id) return;
    setDeleting(prev => new Set(prev).add(item._id!));
    try {
      const r = await apiFetch(`/api/admin/off-days/${item._id}`, { method: 'DELETE' });
      if (r.ok) setItems(prev => prev.filter(i => i._id !== item._id));
    } finally {
      setDeleting(prev => { const s = new Set(prev); s.delete(item._id!); return s; });
    }
  }

  function handleDiscard(item: Item) {
    if (!item._id) {
      setItems(prev => prev.filter(i => i.date !== item.date));
    } else if (item._server) {
      setItems(prev => prev.map(i =>
        i.date === item.date ? { ...i, ...item._server! } : i
      ));
    }
  }

  return (
    <DashboardLayout activePage="calendar">
      <div className="db-page-header">
        <h2 className="db-page-title">Off-Day Calendar</h2>
      </div>

      <div className="db-cal-layout">

        {/* ── Left: month grid ── */}
        <div className="db-cal-left">
          <div className="db-cal-nav">
            <button className="db-cal-nav-btn" onClick={prevMonth}>
              <i className="fa-solid fa-chevron-left" />
            </button>
            <span className="db-cal-month-label">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button className="db-cal-nav-btn" onClick={nextMonth}>
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>

          <div className="db-cal-grid">
            {WEEKDAYS.map(d => (
              <div key={d} className="db-cal-weekday">{d}</div>
            ))}
            {grid.map((day, idx) => {
              if (!day) return <div key={`e-${idx}`} className="db-cal-cell db-cal-cell--empty" />;
              const key  = dateKey(viewYear, viewMonth, day);
              const item = items.find(it => it.date === key);
              let cls = 'db-cal-cell';
              if (item?._id) cls += ' db-cal-cell--saved';
              else if (item) cls += ' db-cal-cell--draft';
              if (key === todayKey) cls += ' db-cal-cell--today';
              return (
                <button key={key} className={cls} onClick={() => handleDayClick(day)}>
                  {day}
                </button>
              );
            })}
          </div>

          <div className="db-cal-legend">
            <span className="db-cal-legend-item">
              <span className="db-cal-legend-dot db-cal-legend-dot--saved" />
              Saved off day
            </span>
            <span className="db-cal-legend-item">
              <span className="db-cal-legend-dot db-cal-legend-dot--draft" />
              Unsaved selection
            </span>
          </div>
          <p className="db-cal-hint">Click a date to mark it as an off day. Click again to deselect unsaved drafts.</p>
        </div>

        {/* ── Right: panel ── */}
        <div className="db-cal-right">
          <p className="db-cal-panel-heading">
            {MONTH_NAMES[viewMonth]} {viewYear} — Off Days
          </p>

          {visible.length === 0 ? (
            <p className="db-cal-empty">
              No off days this month. Click a date on the calendar to add one.
            </p>
          ) : (
            <div className="db-cal-list">
              {visible.map(item => {
                const dirty = isDirty(item);
                const isSav = saving.has(item.date);
                const isDel = item._id ? deleting.has(item._id) : false;

                return (
                  <div key={item.date} className="db-cal-row">
                    <div className="db-cal-row-head">
                      <span className="db-cal-row-date">{formatLong(item.date)}</span>
                      {!item._id && <span className="db-cal-badge">New</span>}
                    </div>

                    <label className="db-cal-check-label">
                      <input
                        type="checkbox"
                        checked={item.fullDay}
                        onChange={e => updateItem(item.date, {
                          fullDay:   e.target.checked,
                          startTime: e.target.checked ? '' : (item.startTime || '09:00'),
                          endTime:   e.target.checked ? '' : (item.endTime   || '17:00'),
                        })}
                      />
                      Full day off
                    </label>

                    {!item.fullDay && (
                      <div className="db-cal-time-row">
                        <TimePicker
                          label="From"
                          value={item.startTime || '09:00'}
                          onChange={t => updateItem(item.date, { startTime: t })}
                        />
                        <TimePicker
                          label="To"
                          value={item.endTime || '17:00'}
                          onChange={t => updateItem(item.date, { endTime: t })}
                        />
                      </div>
                    )}

                    {item._id && !dirty && (
                      <p className="db-cal-summary">
                        {item.fullDay
                          ? 'Closed all day'
                          : `Closed ${fmt12h(item.startTime)} – ${fmt12h(item.endTime)}`}
                      </p>
                    )}

                    <div className="db-cal-row-actions">
                      {dirty && (
                        <>
                          <button
                            className="db-cal-action-btn db-cal-action-btn--save"
                            onClick={() => handleSave(item)}
                            disabled={isSav}
                            title="Save"
                          >
                            {isSav
                              ? <i className="fa-solid fa-spinner fa-spin" />
                              : <i className="fa-solid fa-check" />}
                          </button>
                          <button
                            className="db-cal-action-btn db-cal-action-btn--discard"
                            onClick={() => handleDiscard(item)}
                            disabled={isSav}
                            title="Discard"
                          >
                            <i className="fa-solid fa-xmark" />
                          </button>
                        </>
                      )}
                      {item._id && (
                        <button
                          className="db-cal-action-btn db-cal-action-btn--delete"
                          onClick={() => handleDelete(item)}
                          disabled={isDel}
                          title="Delete"
                        >
                          {isDel
                            ? <i className="fa-solid fa-spinner fa-spin" />
                            : <i className="fa-solid fa-trash" />}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
