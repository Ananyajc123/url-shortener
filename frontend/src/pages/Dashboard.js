import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shortenUrl, getUserUrls, deleteUrl } from '../services/api';

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);
  const [form, setForm] = useState({ originalUrl: '', customAlias: '', expiryDays: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => { fetchUrls(); }, []);

  const fetchUrls = async () => {
    try {
      const res = await getUserUrls();
      setUrls(res.data);
    } catch (err) { console.error(err); }
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await shortenUrl({
        originalUrl: form.originalUrl,
        customAlias: form.customAlias || null,
        expiryDays: form.expiryDays ? parseInt(form.expiryDays) : null,
      });
      setForm({ originalUrl: '', customAlias: '', expiryDays: '' });
      fetchUrls();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.originalUrl || 'Failed to shorten URL');
    } finally { setLoading(false); }
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(shortUrl);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleDelete = async (shortCode) => {
    if (!window.confirm('Delete this URL?')) return;
    try {
      await deleteUrl(shortCode);
      fetchUrls();
    } catch (err) { alert('Failed to delete'); }
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.navLogo}>⚡ ShortLink</h2>
        <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
      </nav>

      <div style={styles.container}>
        {/* Shorten Form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Shorten a URL</h3>
          <form onSubmit={handleShorten} style={styles.form}>
            <input style={styles.input} placeholder="https://your-long-url.com"
              value={form.originalUrl}
              onChange={e => setForm({...form, originalUrl: e.target.value})} required />
            <div style={styles.row}>
              <input style={{...styles.input, flex: 1}} placeholder="Custom alias (optional)"
                value={form.customAlias}
                onChange={e => setForm({...form, customAlias: e.target.value})} />
              <input style={{...styles.input, width: 140}} placeholder="Expiry days"
                type="number" min="1" value={form.expiryDays}
                onChange={e => setForm({...form, expiryDays: e.target.value})} />
              <button style={styles.btn} type="submit" disabled={loading}>
                {loading ? '...' : 'Shorten'}
              </button>
            </div>
            {error && <p style={styles.error}>{error}</p>}
          </form>
        </div>

        {/* URL List */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Your Links ({urls.length})</h3>
          {urls.length === 0
            ? <p style={styles.empty}>No links yet. Create your first one above!</p>
            : urls.map(url => (
              <div key={url.shortCode} style={styles.urlRow}>
                <div style={styles.urlInfo}>
                  <a href={url.shortUrl} target="_blank" rel="noreferrer"
                    style={styles.shortUrl}>{url.shortUrl}</a>
                  <p style={styles.originalUrl}>{url.originalUrl.substring(0, 60)}
                    {url.originalUrl.length > 60 ? '...' : ''}</p>
                  {url.expiresAt && (
                    <p style={styles.expiry}>Expires: {new Date(url.expiresAt).toLocaleDateString()}</p>
                  )}
                </div>
                <div style={styles.actions}>
                  <button style={styles.iconBtn}
                    onClick={() => handleCopy(url.shortUrl)}>
                    {copied === url.shortUrl ? '✅' : '📋'}
                  </button>
                  <button style={styles.iconBtn}
                    onClick={() => navigate(`/stats/${url.shortCode}`)}>📊</button>
                  <button style={{...styles.iconBtn, color: '#e53e3e'}}
                    onClick={() => handleDelete(url.shortCode)}>🗑️</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f0f4ff' },
  nav: { background: 'white', padding: '16px 32px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  navLogo: { margin: 0, fontSize: 20 },
  logoutBtn: { background: 'none', border: '1px solid #e0e0e0', borderRadius: 8,
    padding: '6px 16px', cursor: 'pointer', fontSize: 13 },
  container: { maxWidth: 800, margin: '32px auto', padding: '0 16px' },
  card: { background: 'white', borderRadius: 16, padding: 28, marginBottom: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  cardTitle: { margin: '0 0 20px', fontSize: 18, fontWeight: 600 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  row: { display: 'flex', gap: 10, alignItems: 'center' },
  input: { padding: '10px 14px', borderRadius: 8, border: '1px solid #e0e0e0',
    fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' },
  btn: { padding: '10px 20px', borderRadius: 8, background: '#4f46e5',
    color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600,
    whiteSpace: 'nowrap', fontSize: 14 },
  error: { color: '#e53e3e', fontSize: 13, margin: 0 },
  empty: { color: '#888', textAlign: 'center', padding: '20px 0' },
  urlRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 0', borderBottom: '1px solid #f0f0f0' },
  urlInfo: { flex: 1, minWidth: 0 },
  shortUrl: { color: '#4f46e5', fontWeight: 600, fontSize: 15, textDecoration: 'none' },
  originalUrl: { color: '#888', fontSize: 13, margin: '4px 0 0',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  expiry: { color: '#f59e0b', fontSize: 12, margin: '2px 0 0' },
  actions: { display: 'flex', gap: 8, marginLeft: 12 },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 18, padding: 4 },
};
