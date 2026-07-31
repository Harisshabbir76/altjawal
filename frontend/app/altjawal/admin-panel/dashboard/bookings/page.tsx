'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import { apiFetch } from '../../../../lib/dashApi';

type Booking = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
};

type QuickFilter = '' | 'today' | 'yesterday' | 'last3' | 'last7';

const QUICK_CHIPS: { val: QuickFilter; label: string }[] = [
  { val: '',          label: 'All' },
  { val: 'today',     label: 'Today' },
  { val: 'yesterday', label: 'Yesterday' },
  { val: 'last3',     label: 'Last 3 Days' },
  { val: 'last7',     label: 'Last 7 Days' },
];

const STATUS_LABELS: Record<string, string> = {
  pending:   'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [quick, setQuick] = useState<QuickFilter>('');
  const [onDate, setOnDate] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const isFiltered = quick !== '' || !!onDate || !!fromDate || !!toDate;

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (quick) {
      params.set('quick', quick);
    } else if (onDate) {
      params.set('onDate', onDate);
    } else {
      if (fromDate) params.set('from', fromDate);
      if (toDate)   params.set('to', toDate);
    }
    const qs = params.toString();
    const res = await apiFetch(`/api/admin/bookings${qs ? `?${qs}` : ''}`);
    if (res.ok) {
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : (data.bookings ?? []));
    }
    setLoading(false);
  }, [quick, onDate, fromDate, toDate]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  function handleQuick(val: QuickFilter) {
    setQuick(val);
    setOnDate('');
    setFromDate('');
    setToDate('');
  }

  function handleOnDate(val: string) {
    setOnDate(val);
    setQuick('');
    setFromDate('');
    setToDate('');
  }

  function handleRange(field: 'from' | 'to', val: string) {
    setQuick('');
    setOnDate('');
    if (field === 'from') setFromDate(val);
    else setToDate(val);
  }

  function handleClear() {
    setQuick('');
    setOnDate('');
    setFromDate('');
    setToDate('');
  }

  function formatReceived(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }

  return (
    <DashboardLayout activePage="bookings">
      <div className="db-page-header">
        <h2 className="db-page-title">Bookings</h2>
      </div>

      <div className="db-filter-bar">
        {/* Row 1: quick chips + clear */}
        <div className="db-filter-top">
          <div className="db-quick-filters">
            {QUICK_CHIPS.map(({ val, label }) => {
              const active = val === '' ? !isFiltered : quick === val;
              return (
                <button
                  key={val || 'all'}
                  className={`db-filter-chip${active ? ' db-filter-chip--active' : ''}`}
                  onClick={() => handleQuick(val)}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {isFiltered && (
            <button className="db-clear-btn" onClick={handleClear}>
              <i className="fa-solid fa-xmark" /> Clear filter
            </button>
          )}
        </div>

        {/* Row 2: date filters */}
        <div className="db-date-filters">
          <div className="db-date-group">
            <span className="db-date-label">On</span>
            <input
              type="date"
              value={onDate}
              onChange={(e) => handleOnDate(e.target.value)}
              className={`db-date-input${onDate ? ' db-date-input--active' : ''}`}
            />
          </div>
          <span className="db-date-or">or</span>
          <div className="db-date-group">
            <span className="db-date-label">From</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => handleRange('from', e.target.value)}
              className={`db-date-input${(fromDate || toDate) ? ' db-date-input--active' : ''}`}
            />
            <span className="db-date-sep">—</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => handleRange('to', e.target.value)}
              className={`db-date-input${(fromDate || toDate) ? ' db-date-input--active' : ''}`}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p className="db-loading">Loading bookings…</p>
      ) : bookings.length === 0 ? (
        <p className="db-empty">No bookings found.</p>
      ) : (
        <div className="db-table-wrap">
          <table className="db-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Received</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <p className="db-table-name">{b.firstName} {b.lastName}</p>
                    <p className="db-table-sub">{b.email}</p>
                  </td>
                  <td>{b.service}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td>
                    <span className={`db-pill db-pill--${b.status}`}>
                      {STATUS_LABELS[b.status]}
                    </span>
                  </td>
                  <td>{formatReceived(b.createdAt)}</td>
                  <td>
                    <Link href={`/altjawal/admin-panel/dashboard/bookings/${b._id}`} className="db-table-action">
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
