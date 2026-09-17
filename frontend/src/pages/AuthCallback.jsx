import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('lab_token', token);
      // Redirect to dashboard after successful external OAuth
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/?auth=fail', { replace: true });
    }
  }, [search, navigate]);

  return (
    <div style={{ padding: 24 }}>
      <h3>Signing you in…</h3>
      <p>If you are not redirected, close this window and try again.</p>
    </div>
  );
}
