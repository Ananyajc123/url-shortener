import React, { useState } from 'react';
import { login, register } from '../services/api';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = isLogin
        ? await login({ email: form.email, password: form.password })
        : await register(form);
      onLogin(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>⚡ ShortLink</h1>
        <p style={styles.subtitle}>Fast, smart URL shortening</p>

        <div style={styles.tabs}>
          <button style={isLogin ? styles.activeTab : styles.tab}
            onClick={() => setIsLogin(true)}>Login</button>
          <button style={!isLogin ? styles.activeTab : styles.tab}
            onClick={() => setIsLogin(false)}>Register</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input style={styles.input} placeholder="Full Name"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          )}
          <input style={styles.input} placeholder="Email" type="email"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} placeholder="Password" type="password"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f0f4ff', display: 'flex',
    alignItems: 'center', justifyContent: 'center' },
  card: { background: 'white', borderRadius: 16, padding: 40, width: 380,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  logo: { textAlign: 'center', fontSize: 28, margin: '0 0 4px' },
  subtitle: { textAlign: 'center', color: '#888', marginBottom: 24, fontSize: 14 },
  tabs: { display: 'flex', marginBottom: 24, borderRadius: 8,
    overflow: 'hidden', border: '1px solid #e0e0e0' },
  tab: { flex: 1, padding: '10px', border: 'none', background: 'white',
    cursor: 'pointer', fontSize: 14 },
  activeTab: { flex: 1, padding: '10px', border: 'none',
    background: '#4f46e5', color: 'white', cursor: 'pointer', fontSize: 14 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: '12px 14px', borderRadius: 8, border: '1px solid #e0e0e0',
    fontSize: 14, outline: 'none' },
  btn: { padding: '12px', borderRadius: 8, background: '#4f46e5', color: 'white',
    border: 'none', fontSize: 15, cursor: 'pointer', fontWeight: 600 },
  error: { color: '#e53e3e', fontSize: 13, margin: 0 },
};
