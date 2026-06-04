import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
         PieChart, Pie, Cell, Legend } from 'recharts';
import { getUrlStats } from '../services/api';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export default function Stats() {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUrlStats(shortCode)
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [shortCode]);

  if (loading) return <div style={styles.center}>Loading analytics...</div>;
  if (!stats) return <div style={styles.center}>Failed to load stats</div>;

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <button style={styles.back} onClick={() => navigate('/dashboard')}>← Back</button>
        <h2 style={styles.navTitle}>Analytics</h2>
      </nav>

      <div style={styles.container}>
        {/* Summary Cards */}
        <div style={styles.grid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Clicks</p>
            <p style={styles.statValue}>{stats.totalClicks || 0}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Short URL</p>
            <p style={{...styles.statValue, fontSize: 14}}>{stats.shortUrl}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Created</p>
            <p style={{...styles.statValue, fontSize: 16}}>
              {new Date(stats.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Expires</p>
            <p style={{...styles.statValue, fontSize: 16}}>
              {stats.expiresAt ? new Date(stats.expiresAt).toLocaleDateString() : 'Never'}
            </p>
          </div>
        </div>

        {/* Original URL */}
        <div style={styles.card}>
          <p style={styles.label}>Original URL</p>
          <a href={stats.originalUrl} target="_blank" rel="noreferrer" style={styles.link}>
            {stats.originalUrl}
          </a>
        </div>

        {/* Daily Clicks Chart */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Clicks — Last 30 Days</h3>
          {stats.dailyClicks && stats.dailyClicks.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={stats.dailyClicks}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="clicks" stroke="#4f46e5"
                  strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p style={styles.empty}>No click data yet</p>}
        </div>

        {/* Device Breakdown */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Device Breakdown</h3>
          {stats.deviceBreakdown && stats.deviceBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={stats.deviceBreakdown} dataKey="count"
                  nameKey="deviceType" cx="50%" cy="50%" outerRadius={90} label>
                  {stats.deviceBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={styles.empty}>No device data yet</p>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f0f4ff' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', color: '#888' },
  nav: { background: 'white', padding: '16px 32px', display: 'flex',
    alignItems: 'center', gap: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  back: { background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 15, color: '#4f46e5' },
  navTitle: { margin: 0, fontSize: 18 },
  container: { maxWidth: 860, margin: '32px auto', padding: '0 16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: { background: 'white', borderRadius: 12, padding: '20px 16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' },
  statLabel: { color: '#888', fontSize: 12, margin: '0 0 8px', textTransform: 'uppercase' },
  statValue: { color: '#1a1a1a', fontSize: 24, fontWeight: 700, margin: 0 },
  card: { background: 'white', borderRadius: 16, padding: 28, marginBottom: 20,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  cardTitle: { margin: '0 0 20px', fontSize: 17, fontWeight: 600 },
  label: { color: '#888', fontSize: 13, margin: '0 0 6px' },
  link: { color: '#4f46e5', wordBreak: 'break-all', fontSize: 14 },
  empty: { color: '#aaa', textAlign: 'center', padding: '20px 0' },
};
