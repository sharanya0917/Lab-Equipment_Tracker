import { Link } from 'react-router-dom';
import { getVisuals } from '../equipmentVisuals';

const STATUS_MAP = {
  'Available':         'available',
  'In-Use':            'in-use',
  'Missing':           'missing',
  'Under Maintenance': 'maintenance',
};

function StatusChip({ status }) {
  return <span className={`chip ${STATUS_MAP[status] || ''}`}>{status}</span>;
}

export default function EquipmentCard({ eq }) {
  const { emoji, color, img } = getVisuals(eq.name, eq.category);

  return (
    <div
      className="eq-card"
      style={{ '--card-accent': color }}
    >
      {/* Image / icon header */}
      <div className="eq-card-img">
        {img ? (
          <img
            src={img}
            alt={eq.name}
            onError={e => {
              // Fallback to emoji if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="eq-card-emoji" style={{ display: img ? 'none' : 'flex' }}>
          {emoji}
        </div>
      </div>

      {/* Info */}
      <div className="eq-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '0.2rem' }}>
              {eq.equipment_id}
            </p>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
              {eq.name}
            </h4>
          </div>
          <StatusChip status={eq.status} />
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
          📍 {eq.location} &nbsp;·&nbsp; {eq.category}
        </p>

        <div style={{ marginTop: '0.75rem' }}>
          <Link to={`/equipment/${eq.equipment_id}`} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
