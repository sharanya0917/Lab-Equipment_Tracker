import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, request } from '../api';
import ModalForm from '../components/ModalForm';
import { getVisuals } from '../equipmentVisuals';
import { getEquipmentInstructions } from '../equipmentInstructions';


const STATUS_MAP = {
  'Available':         'available',
  'In-Use':            'in-use',
  'Missing':           'missing',
  'Under Maintenance': 'maintenance',
};

function StatusChip({ status }) {
  return <span className={`chip ${STATUS_MAP[status] || ''}`}>{status}</span>;
}

const now = () => {
  const d = new Date();
  return d.toISOString().slice(0, 16); // datetime-local compatible
};

export default function EquipmentDetail() {
  const { id } = useParams();
  const [equipment,    setEquipment]    = useState(null);
  const [maintenance,  setMaintenance]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showIssue,    setShowIssue]    = useState(false);
  const [showReturn,   setShowReturn]   = useState(false);
  const [showMaint,    setShowMaint]    = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [eq, maint] = await Promise.all([
        request(`/equipment/${id}`),
        api.getMaintenance(id),
      ]);
      setEquipment(eq || null);
      setMaintenance(maint);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <p className="text-muted">Loading…</p>;
  if (!equipment) return <p className="text-muted">Equipment not found.</p>;

  const handleIssue = async data => {
    await api.issueItem({ ...data, equipment_id: id });
    setShowIssue(false);
    load();
  };

  const handleReturn = async data => {
    await api.returnItem({ ...data, equipment_id: id });
    setShowReturn(false);
    load();
  };

  const handleMaint = async data => {
    await api.addMaintenance({ ...data, equipment_id: id });
    setShowMaint(false);
    load();
  };

  const handleDeleteMaintenance = async (recordId) => {
    if (!window.confirm('Delete this maintenance record?')) return;
    try {
      await api.deleteMaintenance(recordId);
      load();
    } catch (e) {
      alert(e.message);
    }
  };
  const isAvailable    = equipment.status === 'Available';
  const isInUse        = equipment.status === 'In-Use';
  const canMaintain    = equipment.status !== 'In-Use';
  const { emoji, color, img } = getVisuals(equipment.name, equipment.category);

  return (
    <div>
      <Link to="/equipment" className="back-link">← Back to Equipment</Link>

      {/* Equipment image banner */}
      <div style={{
        width: '100%',
        height: '200px',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        marginBottom: '1.5rem',
        border: `2px solid ${color}30`,
        position: 'relative',
        background: 'var(--bg-2)',
      }}>
        {img ? (
          <img
            src={img}
            alt={equipment.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div style={{
          display: img ? 'none' : 'flex',
          width: '100%', height: '100%',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '5rem',
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        }}>
          {emoji}
        </div>
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, var(--bg-2) 0%, transparent 60%)',
        }} />
      </div>

      {/* Header */}
      <div className="detail-header">
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{equipment.name}</h2>
          <p className="text-muted" style={{ fontFamily: 'monospace', marginTop: '0.25rem' }}>{equipment.equipment_id}</p>
        </div>
        <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          <StatusChip status={equipment.status} />
          {isAvailable && (
            <button className="btn btn-warning" onClick={() => setShowIssue(true)}>📤 Issue Item</button>
          )}
          {isInUse && (
            <button className="btn btn-success" onClick={() => setShowReturn(true)}>📥 Return Item</button>
          )}
          {canMaintain && (
            <button className="btn btn-ghost" onClick={() => setShowMaint(true)}>🔧 Log Maintenance</button>
          )}

          {/* Quick jump to the 3 new capabilities */}
          <Link
            to="/maintenance-predictor"
            state={{ equipment_id: equipment.equipment_id }}
            className="btn btn-secondary"
            title="Analyze breakdown risk & health score"
          >
            🤖 AI Predictor
          </Link>
          <Link
            to="/digital-twin"
            state={{ equipment_id: equipment.equipment_id }}
            className="btn btn-secondary"
            title="Open real-time digital twin simulator"
          >
            🎛️ Digital Twin
          </Link>
          <Link
            to="/reservations"
            state={{ equipment_id: equipment.equipment_id }}
            className="btn btn-primary"
            title="Book reservation with sterilization buffer shield"
          >
            📅 Reserve Slot
          </Link>
        </div>
      </div>

      {/* Meta */}
      <div className="detail-meta">
        <div className="meta-item"><div className="label">Category</div><div className="value">{equipment.category}</div></div>
        <div className="meta-item"><div className="label">Location</div><div className="value">{equipment.location}</div></div>
        <div className="meta-item"><div className="label">Purchase Date</div><div className="value">{equipment.purchase_date || '—'}</div></div>
        <div className="meta-item"><div className="label">Status</div><div className="value"><StatusChip status={equipment.status} /></div></div>
      </div>

      {/* Equipment Operating Instructions & Safety Protocols */}
      {(() => {
        const instructions = getEquipmentInstructions(equipment.equipment_id, equipment.name);
        return (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 className="section-title" style={{ marginTop: 0, marginBottom: '1.25rem', color: 'var(--primary)' }}>
              📜 Standard Operating Procedure (SOP) & Safety Guidelines
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {/* Steps */}
              <div style={{ background: 'var(--surface-2)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  📋 Operating Instructions
                </h4>
                <ol style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {instructions.operating_steps.map((step, idx) => (
                    <li key={idx} style={{ lineHeight: '1.4' }}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Safety */}
              <div style={{ background: 'var(--warning-bg)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--warning-border)' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--warning)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  ⚠️ Critical Safety & PPE Warnings
                </h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {instructions.safety_warnings.map((warn, idx) => (
                    <li key={idx} style={{ lineHeight: '1.4' }}>{warn}</li>
                  ))}
                </ul>
              </div>

              {/* Decontamination */}
              <div style={{ background: 'var(--primary-light)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(31, 78, 121, 0.2)' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  🧼 Sterilization & Cleaning Protocol
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: '1.5' }}>
                  {instructions.sterilization_protocol}
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>
                  ⏱️ Enforced Buffer Window: 30 Mins Decontamination Shield
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Maintenance History */}
      <h3 className="section-title">🔧 Maintenance History</h3>

      <div className="table-wrap">
        {maintenance.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No maintenance records yet.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr><th>Date</th><th>Type</th><th>Technician</th><th>Cost</th><th>Notes</th><th></th></tr>
            </thead>
            <tbody>
              {maintenance.map((m, i) => (
                <tr key={m._id || i}>
                  <td data-label="Date">{m.date}</td>
                  <td data-label="Type"><span className="chip maintenance">{m.type}</span></td>
                  <td data-label="Technician">{m.technician || '—'}</td>
                  <td data-label="Cost">{m.cost ? `$${m.cost}` : '—'}</td>
                  <td data-label="Notes" className="text-muted">{m.notes || '—'}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteMaintenance(String(m._id ?? i))}
                      title="Delete this maintenance record"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Issue Modal */}
      {showIssue && (
        <ModalForm
          title="Issue Equipment"
          onSubmit={handleIssue}
          onClose={() => setShowIssue(false)}
          fields={[
            { name: 'borrower_name',      label: 'Borrower Name',   type: 'text',           placeholder: 'Full name' },
            { name: 'issue_date',         label: 'Issue Date/Time', type: 'datetime-local',  defaultValue: now() },
            { name: 'expected_return_date', label: 'Expected Return', type: 'datetime-local' },
            { name: 'purpose',            label: 'Purpose',          type: 'text',           placeholder: 'Reason for use' },
          ]}
        />
      )}

      {/* Return Modal */}
      {showReturn && (
        <ModalForm
          title="Return Equipment"
          onSubmit={handleReturn}
          onClose={() => setShowReturn(false)}
          fields={[
            { name: 'actual_return_date',  label: 'Return Date/Time', type: 'datetime-local', defaultValue: now() },
            { name: 'condition_on_return', label: 'Condition',         type: 'select', options: ['Good','Damaged','Missing'] },
          ]}
        />
      )}

      {/* Maintenance Modal */}
      {showMaint && (
        <ModalForm
          title="Log Maintenance"
          onSubmit={handleMaint}
          onClose={() => setShowMaint(false)}
          fields={[
            { name: 'date',       label: 'Date',       type: 'date' },
            { name: 'type',       label: 'Type',       type: 'select', options: ['Routine','Repair','Calibration'] },
            { name: 'technician', label: 'Technician', type: 'text' },
            { name: 'cost',       label: 'Cost ($)',   type: 'number', placeholder: '0.00' },
            { name: 'notes',      label: 'Notes',      type: 'textarea' },
          ]}
        />
      )}
    </div>
  );
}
