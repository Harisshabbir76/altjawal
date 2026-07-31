'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../../../../components/dashboard/DashboardLayout';
import { apiFetch } from '../../../../../lib/dashApi';

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

const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/api/admin/bookings/${id}`).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        const b = data.booking ?? data;
        setBooking(b);
        setStatus(b.status);
      }
    });
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setError('');
    setSaved(false);
    const res = await apiFetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setError('Failed to save changes.');
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this booking? This cannot be undone.')) return;
    setDeleting(true);
    const res = await apiFetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/altjawal/admin-panel/dashboard/bookings');
    } else {
      setError('Failed to delete booking.');
      setDeleting(false);
    }
  }

  function formatReceived(iso: string) {
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  if (!booking) {
    return (
      <DashboardLayout activePage="bookings">
        <p className="db-loading">Loading booking…</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePage="bookings">
      <div className="db-page-header">
        <button className="db-back-btn" onClick={() => router.push('/altjawal/admin-panel/dashboard/bookings')}>
          <i className="fa-solid fa-arrow-left" /> Bookings
        </button>
        <h2 className="db-page-title">Booking Detail</h2>
        <button className="db-btn db-btn--danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting…' : <><i className="fa-solid fa-trash" /> Delete</>}
        </button>
      </div>

      <div className="db-detail-single">
        <section className="db-card">
          <h3 className="db-card-title">Client</h3>
          <div className="db-info-row"><span>Name</span><strong>{booking.firstName} {booking.lastName}</strong></div>
          <div className="db-info-row"><span>Email</span><strong>{booking.email}</strong></div>
          <div className="db-info-row"><span>Phone</span><strong>{booking.phone || '—'}</strong></div>
        </section>

        <section className="db-card">
          <h3 className="db-card-title">Booking Details</h3>
          <div className="db-info-row"><span>Service</span><strong>{booking.service}</strong></div>
          <div className="db-info-row"><span>Date</span><strong>{booking.date}</strong></div>
          <div className="db-info-row"><span>Time</span><strong>{booking.time}</strong></div>
          <div className="db-info-row"><span>Received</span><strong>{formatReceived(booking.createdAt)}</strong></div>
        </section>

        {booking.message && (
          <section className="db-card">
            <h3 className="db-card-title">Message</h3>
            <p className="db-message-text">{booking.message}</p>
          </section>
        )}

        <section className="db-card">
          <h3 className="db-card-title">Status</h3>
          <div className="db-status-row">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="db-select">
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <button className="db-btn db-btn--primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
          {error && <p className="db-login-error" style={{ marginTop: '0.75rem' }}>{error}</p>}
          {saved && <p className="db-save-success" style={{ marginTop: '0.75rem' }}>Status updated.</p>}
        </section>
      </div>
    </DashboardLayout>
  );
}
