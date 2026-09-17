import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleLocalSignIn(e) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    // Demo/local sign-in: create a lightweight token and persist it.
    const token = `local:${btoa(email)}`;
    localStorage.setItem('lab_token', token);
    localStorage.setItem('lab_user', JSON.stringify({ email }));
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="login-page" style={{ padding: 24, maxWidth: 520, margin: '40px auto' }}>
      <div className="login-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 36 }}>🔬</div>
          <div>
            <h1 style={{ margin: 0 }}>Lab Tracker</h1>
            <div style={{ color: '#6b7280' }}>AI & Digital Twin Suite</div>
          </div>
        </div>

        <form onSubmit={handleLocalSignIn} style={{ marginTop: 20 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Email / Username</label>
          <input className="input" value={email} onChange={e => setEmail(e.target.value)} />

          <label style={{ display: 'block', marginTop: 12, marginBottom: 8 }}>Password</label>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />

          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn-primary" type="submit">Sign In</button>
            <a className="btn-ghost" href="/auth/google">Continue with Google</a>
          </div>
        </form>
      </div>
    </div>
  );
}
