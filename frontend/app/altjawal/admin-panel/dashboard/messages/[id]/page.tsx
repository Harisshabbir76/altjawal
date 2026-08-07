'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../../../../components/dashboard/DashboardLayout';
import { apiFetch } from '../../../../../lib/dashApi';

type Message = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

export default function MessageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [msg, setMsg] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/api/admin/messages/${id}`).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setMsg(data.message ?? data);
      }
    });
  }, [id]);

  async function handleDelete() {
    if (!confirm('Delete this message? This cannot be undone.')) return;
    setDeleting(true);
    const res = await apiFetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/altjawal/admin-panel/dashboard/messages');
    } else {
      setError('Failed to delete message.');
      setDeleting(false);
    }
  }

  function formatReceived(iso: string) {
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  if (!msg) {
    return (
      <DashboardLayout activePage="messages">
        <p className="db-loading">Loading message…</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePage="messages">
      <div className="db-page-header">
        <button className="db-back-btn" onClick={() => router.push('/altjawal/admin-panel/dashboard/messages')}>
          <i className="fa-solid fa-arrow-left" /> Messages
        </button>
        <h2 className="db-page-title">Message Detail</h2>
        <button className="db-btn db-btn--danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting…' : <><i className="fa-solid fa-trash" /> Delete</>}
        </button>
      </div>

      <div className="db-detail-single">
        <section className="db-card">
          <h3 className="db-card-title">Sender</h3>
          <div className="db-info-row"><span>Name</span><strong>{msg.firstName} {msg.lastName}</strong></div>
          <div className="db-info-row"><span>Email</span><strong>{msg.email}</strong></div>
          <div className="db-info-row"><span>Phone</span><strong>{msg.phone || '—'}</strong></div>
          <div className="db-info-row"><span>Received</span><strong>{formatReceived(msg.createdAt)}</strong></div>
        </section>

        <section className="db-card">
          <h3 className="db-card-title">Message</h3>
          <p className="db-message-text">{msg.message}</p>
        </section>

        {error && <p className="db-login-error">{error}</p>}
      </div>
    </DashboardLayout>
  );
}
