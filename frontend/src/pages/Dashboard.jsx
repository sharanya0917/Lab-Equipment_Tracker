import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

const STAT_CARDS = [
  { key: 'available',   label: 'Available',          icon: '✅', cls: 'available'   },
  { key: 'inUse',       label: 'In‑Use',             icon: '🔄', cls: 'in-use'      },
  { key: 'missing',     label: 'Missing',            icon: '⚠️', cls: 'missing'     },
  { key: 'maintenance', label: 'Under Maintenance',  icon: '🔧', cls: 'maintenance' },
];

export default function Dashboard() {
  const [stats, setStats]     = useState(null);
  const [equipment, setEquip] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getDashboard(), api.getEquipment({})])
      .then(([s, e]) => { setStats(s); setEquip(e); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const overdue = equipment.filter(e =>
    e.status === 'In-Use'
  );

  if (loading) return <p className="text-muted">Loading…</p>;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p className="text-muted">Lab equipment overview</p>
        </div>
        <Link to="/equipment" className="btn btn-primary">View All Equipment →</Link>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        {STAT_CARDS.map(c => (
          <div key={c.key} className={`stat-card ${c.cls}`}>
            <div className={`stat-icon ${c.cls}`}>{c.icon}</div>
            <div className="stat-info">
              <h3>{stats?.[c.key] ?? 0}</h3>
              <p>{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category Breakdown Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {[
          { category: 'Instruments', emoji: '⚗️', color: '#1F4E79' },
          { category: 'Electronics', emoji: '🔌', color: '#EA580C' },
          { category: 'Glassware',   emoji: '🧪', color: '#16A34A' }
        ].map(cat => {
          const count = equipment.filter(e => e.category === cat.category).length;
          return (
            <Link
              key={cat.category}
              to="/equipment"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card" style={{
                padding: '1rem 1.25rem',
                borderLeft: `4px solid ${cat.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',

                transition: 'var(--transition)',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.6rem' }}>{cat.emoji}</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text)' }}>{cat.category}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lab Equipment Category</span>
                  </div>
                </div>
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: cat.color,
                  background: `${cat.color}15`,
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {count}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Feature Showcase Quick Launchers */}
      <div className="feature-launchers-grid mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link to="/maintenance-predictor" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card launcher-card" style={{ borderLeft: '4px solid #16A34A', background: 'var(--surface)', transition: 'transform 0.2s', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.6rem' }}>🤖</span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--primary)' }}>AI Maintenance Predictor</strong>
                <span style={{ fontSize: '0.7rem', color: '#16A34A', fontWeight: 700 }}>Telemetry & Wear Modeling</span>
              </div>
            </div>
            <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>
              Forecast equipment breakdowns from thermal peaks & runtime stress. Output instant health score.
            </p>
          </div>
        </Link>

        <Link to="/digital-twin" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card launcher-card" style={{ borderLeft: '4px solid #0284c7', background: 'var(--surface)', transition: 'transform 0.2s', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.6rem' }}>🎛️</span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--primary)' }}>Interactive Digital Twin</strong>
                <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700 }}>Virtual Knobs & Oscillogram</span>
              </div>
            </div>
            <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>
              Virtually tweak RPM, temperature dials, and observe simulated telemetry waveforms in real-time.
            </p>
          </div>
        </Link>

        <Link to="/reservations" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card launcher-card" style={{ borderLeft: '4px solid #7C3AED', background: 'var(--surface)', transition: 'transform 0.2s', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.6rem' }}>📅</span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--primary)' }}>Smart Reservations</strong>
                <span style={{ fontSize: '0.7rem', color: '#7C3AED', fontWeight: 700 }}>Buffer Shield & Anti-Collision</span>
              </div>
            </div>
            <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>
              Reserve machine slots with automated collision blocking and enforced sterilization buffer windows.
            </p>
          </div>
        </Link>
      </div>


      {/* Recent equipment */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>Recent Equipment</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Category</th><th>Location</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {equipment.slice(0, 8).map(eq => (
                <tr key={eq.equipment_id}>
                  <td data-label="ID"><Link to={`/equipment/${eq.equipment_id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{eq.equipment_id}</Link></td>
                  <td data-label="Name" style={{ fontWeight: 500 }}>{eq.name}</td>
                  <td data-label="Category" className="text-muted">{eq.category}</td>
                  <td data-label="Location" className="text-muted">{eq.location}</td>
                  <td data-label="Status"><StatusChip status={eq.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusChip({ status }) {
  const map = {
    'Available':         'available',
    'In-Use':            'in-use',
    'Missing':           'missing',
    'Under Maintenance': 'maintenance',
  };
  return <span className={`chip ${map[status] || ''}`}>{status}</span>;
}
