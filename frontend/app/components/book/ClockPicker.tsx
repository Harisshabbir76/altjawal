'use client';

import { useRef, useEffect, useState } from 'react';

type Props = {
  hour: string;
  minute: string;
  ampm: string;
  error?: boolean;
  onChange: (hour: string, minute: string, ampm: string) => void;
};

const ITEM_H = 44;
type Col = 'hour' | 'minute' | 'ampm';
const COL_ORDER: Col[] = ['hour', 'minute', 'ampm'];

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const AMPM_LIST = ['AM', 'PM'];

function Column({
  items,
  value,
  onSelect,
  focused,
  onClick,
}: {
  items: string[];
  value: string;
  onSelect: (v: string) => void;
  focused: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const idx = items.indexOf(value);
    if (idx >= 0) ref.current.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' });
  }, [value, items]);

  return (
    <div
      ref={ref}
      className={`drum-col${focused ? ' drum-col--focused' : ''}`}
      onClick={onClick}
    >
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={`drum-item${item === value ? ' drum-item--active' : ''}`}
          onClick={() => onSelect(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default function ClockPicker({ hour, minute, ampm, error, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [focusedCol, setFocusedCol] = useState<Col>('hour');
  const wrapRef = useRef<HTMLDivElement>(null);

  // Keep a ref with latest values so the keydown listener doesn't go stale
  const stateRef = useRef({ focusedCol, hour, minute, ampm, onChange });
  stateRef.current = { focusedCol, hour, minute, ampm, onChange };

  // Global keydown while popup is open
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      const HANDLED = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'Enter', 'Tab'];
      if (!HANDLED.includes(e.key)) return;
      e.preventDefault();

      const { focusedCol, hour, minute, ampm, onChange } = stateRef.current;

      if (e.key === 'Escape' || e.key === 'Enter') {
        setOpen(false);
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'Tab' && e.shiftKey) {
        const idx = COL_ORDER.indexOf(focusedCol);
        if (idx > 0) setFocusedCol(COL_ORDER[idx - 1]);
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'Tab') {
        const idx = COL_ORDER.indexOf(focusedCol);
        if (idx < COL_ORDER.length - 1) setFocusedCol(COL_ORDER[idx + 1]);
        return;
      }

      const dir = e.key === 'ArrowDown' ? 1 : -1;

      if (focusedCol === 'hour') {
        const idx = HOURS.indexOf(hour || '01');
        const next = (idx + dir + HOURS.length) % HOURS.length;
        onChange(HOURS[next], minute || '00', ampm || 'AM');
      } else if (focusedCol === 'minute') {
        const idx = MINUTES.indexOf(minute || '00');
        const next = (idx + dir + MINUTES.length) % MINUTES.length;
        onChange(hour || '01', MINUTES[next], ampm || 'AM');
      } else {
        const idx = AMPM_LIST.indexOf(ampm || 'AM');
        const next = (idx + dir + AMPM_LIST.length) % AMPM_LIST.length;
        onChange(hour || '01', minute || '00', AMPM_LIST[next]);
      }
    }

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Reset focused column when popup opens
  useEffect(() => {
    if (open) setFocusedCol('hour');
  }, [open]);

  const isEmpty = !hour && !minute;

  return (
    <div className="clock-picker" ref={wrapRef}>
      <button
        type="button"
        className={`clock-picker__trigger${isEmpty ? ' clock-picker__trigger--empty' : ''}${error ? ' clock-picker__trigger--error' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{isEmpty ? '--:-- --' : `${hour}:${minute} ${ampm}`}</span>
        <span className="clock-picker__chevron">▾</span>
      </button>

      {open && (
        <div className="clock-picker__popup">
          <Column
            items={HOURS}
            value={hour}
            focused={focusedCol === 'hour'}
            onClick={() => setFocusedCol('hour')}
            onSelect={(h) => onChange(h, minute || '00', ampm || 'AM')}
          />
          <div className="drum-sep">:</div>
          <Column
            items={MINUTES}
            value={minute}
            focused={focusedCol === 'minute'}
            onClick={() => setFocusedCol('minute')}
            onSelect={(m) => onChange(hour || '01', m, ampm || 'AM')}
          />
          <Column
            items={AMPM_LIST}
            value={ampm}
            focused={focusedCol === 'ampm'}
            onClick={() => setFocusedCol('ampm')}
            onSelect={(ap) => onChange(hour || '01', minute || '00', ap)}
          />
        </div>
      )}
    </div>
  );
}
