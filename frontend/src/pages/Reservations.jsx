import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api';
import { getVisuals } from '../equipmentVisuals';

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export default function Reservations() {
  const location = useLocation();

  const [equipmentList, setEquipmentList] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEqId, setSelectedEqId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Modal form state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    equipment_id: '',
    researcher_name: '',
    department: 'Biochemistry & Molecular Lab',
    date: new Date().toISOString().split('T')[0],
    start_time: '14:00',
    end_time: '16:00',
    buffer_minutes: 30,
    purpose: ''
  });

  const [conflictWarning, setConflictWarning] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Load equipment & reservations
  const loadData = async () => {
    try {
      setLoading(true);
      const [eqs, resvs] = await Promise.all([
        api.getEquipment(),
        api.getReservations()
      ]);
      setEquipmentList(eqs);
      setReservations(resvs);

      if (eqs.length > 0) {
        const initialEq = location.state?.equipment_id || eqs[0].equipment_id;
        setSelectedEqId(initialEq);
        setForm(f => ({
          ...f,
          equipment_id: initialEq,
          purpose: location.state?.purpose || f.purpose
        }));
      }

      if (location.state?.equipment_id) {
        setShowModal(true);
      }
    } catch (err) {
      console.error('Failed to load reservation data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter reservations for current view
  const currentReservations = reservations.filter(r => {
    const matchEq = selectedEqId ? r.equipment_id === selectedEqId : true;
    const matchDate = selectedDate ? r.date === selectedDate : true;
    return matchEq && matchDate;
  });

  const selectedEquipment = equipmentList.find(e => e.equipment_id === selectedEqId);
  const visuals = selectedEquipment ? getVisuals(selectedEquipment.name, selectedEquipment.category) : null;

  // Real-time client-side collision checker helper
  const checkCollision = (formState) => {
    const { equipment_id, date, start_time, end_time, buffer_minutes } = formState;
    if (!equipment_id || !date || !start_time || !end_time) return null;

    const toMin = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const propStart = toMin(start_time);
    const propEnd = toMin(end_time);
    const propBuf = parseInt(buffer_minutes) || 0;
    const propTotalEnd = propEnd + propBuf;

    if (propEnd <= propStart) {
      return { msg: 'End time must be after start time' };
    }

    const dayResvs = reservations.filter(r => r.equipment_id === equipment_id && r.date === date);

    for (const r of dayResvs) {
      const exStart = toMin(r.start_time);
      const exEnd = toMin(r.end_time);
      const exBuf = parseInt(r.buffer_minutes) || 30;
      const exTotalEnd = exEnd + exBuf;

      // Overlap check
      if (Math.max(propStart, exStart) < Math.min(propTotalEnd, exTotalEnd)) {
        const isDirect = Math.max(propStart, exStart) < Math.min(propEnd, exEnd);
        return {
          msg: isDirect
            ? `Collision: Overlaps directly with reservation by ${r.researcher_name} (${r.start_time} - ${r.end_time})`
            : `Collision: Collides with mandatory sterilization buffer period (${r.buffer_minutes}m) after ${r.researcher_name}'s session (${r.end_time} to +${r.buffer_minutes}m)`,
          isBuffer: !isDirect,
          reservation: r
        };
      }
    }
    return null;
  };

  // Re-run collision check whenever form values change
  useEffect(() => {
    if (showModal) {
      const col = checkCollision(form);
      setConflictWarning(col);
    }
  }, [form, reservations, showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const collision = checkCollision(form);
    if (collision) {
      setSubmitError(collision.msg);
      return;
    }

    try {
      setSubmitting(true);
      const eq = equipmentList.find(x => x.equipment_id === form.equipment_id);
      await api.createReservation({
        ...form,
        equipment_name: eq?.name || form.equipment_id
      });

      setSubmitSuccess('Reservation successfully confirmed! Sterilization buffer locked.');
      setShowModal(false);
      await loadData();
    } catch (err) {
      setSubmitError(err.message || 'Failed to save reservation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this reservation? Sterilization block will be released.')) return;
    try {
      await api.deleteReservation(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="reservations-page">
      {/* Header */}
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">📅 Smart Calendar & Machine Reservations</h1>
          <p className="page-subtitle">
            Collision-proof equipment booking with automated sterilization & decontamination buffer enforcement.
          </p>
        </div>

        <button
          className="btn btn-primary btn-animated"
          onClick={() => {
            setSubmitError(null);
            setSubmitSuccess(null);
            setShowModal(true);
          }}
        >
          + New Reservation
        </button>
      </div>

      {submitSuccess && (
        <div className="alert alert-success">{submitSuccess}</div>
      )}

      {/* Control / Filter Bar */}
      <div className="reservation-controls-bar card">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="filter-group">
            <label>Machine:</label>
            <select
              value={selectedEqId}
              onChange={e => setSelectedEqId(e.target.value)}
              className="form-control"
            >
              <option value="">All Equipment</option>
              {equipmentList.map(eq => (
                <option key={eq.equipment_id} value={eq.equipment_id}>
                  {eq.name} ({eq.equipment_id})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="quick-date-buttons flex gap-1">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            >
              Today
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const tmr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
                setSelectedDate(tmr);
              }}
            >
              Tomorrow
            </button>
          </div>

          {/* Legend */}
          <div className="legend-strip ml-auto flex gap-3 items-center">
            <div className="legend-item"><span className="legend-box box-booked"></span> Active Booking</div>
            <div className="legend-item"><span className="legend-box box-sterilization"></span> Sterilization Buffer</div>
            <div className="legend-item"><span className="legend-box box-free"></span> Available</div>
          </div>
        </div>
      </div>

      {/* Daily Visual Timeline Schedule */}
      <div className="timeline-schedule-card card">
        <div className="panel-title-bar">
          <h3>
            🕒 Visual Time-Slot Schedule — {selectedEquipment ? selectedEquipment.name : 'All Equipment'} ({selectedDate})
          </h3>
          <span className="chip chip-info">{currentReservations.length} Bookings Scheduled</span>
        </div>

        <div className="timeline-grid-wrapper">
          <div className="timeline-inner">
          <div className="timeline-header-hours">
            {TIME_SLOTS.map(hour => (
              <div key={hour} className="hour-col-header">{hour}</div>
            ))}
          </div>

          {/* If an equipment is selected, show its full row */}
          <div className="timeline-row-lane">
            <div className="lane-label">
              <strong>{selectedEquipment ? selectedEquipment.name : 'Selected Machine'}</strong>
              <span className="text-muted text-xs">{selectedEqId || 'All'}</span>
            </div>

            <div className="lane-track">
              {/* Hour dividers */}
              {TIME_SLOTS.map((hour, idx) => (
                <div key={idx} className="track-slot-cell"></div>
              ))}

              {/* Render booked slots and sterilization buffers */}
              {currentReservations.map(resv => {
                const toMin = (t) => {
                  const [h, m] = t.split(':').map(Number);
                  return h * 60 + m;
                };

                const startMin = toMin(resv.start_time);
                const endMin = toMin(resv.end_time);
                const bufMin = parseInt(resv.buffer_minutes) || 30;

                // Timeline spans 08:00 (480 min) to 20:00 (1200 min) => 720 minutes total
                const totalMinutes = 720;
                const offsetMinutes = 480;

                const leftPct = Math.max(0, Math.min(100, ((startMin - offsetMinutes) / totalMinutes) * 100));
                const widthPct = Math.max(2, Math.min(100 - leftPct, ((endMin - startMin) / totalMinutes) * 100));
                const bufWidthPct = Math.max(1, Math.min(100 - (leftPct + widthPct), (bufMin / totalMinutes) * 100));

                return (
                  <div key={resv.id} className="lane-booking-group">
                    {/* Active Booking Block */}
                    <div
                      className="booking-block"
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      title={`${resv.researcher_name} (${resv.start_time} - ${resv.end_time})\n${resv.purpose}`}
                    >
                      <div className="booking-title">{resv.researcher_name}</div>
                      <div className="booking-time">{resv.start_time} - {resv.end_time}</div>
                    </div>

                    {/* Sterilization Buffer Block */}
                    <div
                      className="sterilization-block"
                      style={{ left: `${leftPct + widthPct}%`, width: `${bufWidthPct}%` }}
                      title={`Sterilization Buffer (${bufMin} mins): UV & Autoclave Protocol`}
                    >
                      <span className="buffer-label">🧼 {bufMin}m Sterilization</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          </div>{/* end timeline-inner */}
        </div>

        {/* Mobile fallback: stacked booking cards (hidden on tablet/desktop) */}
        {currentReservations.length === 0 ? null : (
          <div className="timeline-mobile-list">
            {currentReservations.map(resv => (
              <div key={resv.id} className="timeline-mobile-card">
                <div className="timeline-mobile-time">
                  <span className="timeline-mobile-dot" />
                  <span>{resv.start_time} – {resv.end_time}</span>
                  <span className="sterilization-pill" style={{ marginLeft: 'auto' }}>🧼 +{resv.buffer_minutes}m</span>
                </div>
                <div className="timeline-mobile-name">{resv.researcher_name}</div>
                <div className="timeline-mobile-meta">{resv.department} · {resv.equipment_name || resv.equipment_id}</div>
                {resv.purpose && <div className="timeline-mobile-purpose">{resv.purpose}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reservations List Table */}
      <div className="reservations-list-card card">
        <div className="panel-title-bar">
          <h3>📋 Scheduled Reservation Manifest</h3>
          <span className="text-muted text-xs">Sterilization protocol enforced automatically</span>
        </div>

        {currentReservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <p>No reservations scheduled for this selection. Machine is 100% available.</p>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(true)}>
              Book This Machine
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Machine</th>
                  <th>Researcher</th>
                  <th>Department</th>
                  <th>Date & Time</th>
                  <th>Sterilization Buffer</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentReservations.map(r => (
                  <tr key={r.id}>
                    <td data-label="Machine">
                      <strong>{r.equipment_name || r.equipment_id}</strong>
                      <div className="text-muted text-xs">{r.equipment_id}</div>
                    </td>
                    <td data-label="Researcher">{r.researcher_name}</td>
                    <td data-label="Department"><span className="chip chip-secondary">{r.department}</span></td>
                    <td data-label="Date & Time">
                      <div><strong>{r.date}</strong></div>
                      <div className="text-muted text-xs">{r.start_time} – {r.end_time}</div>
                    </td>
                    <td data-label="Buffer">
                      <span className="sterilization-pill">
                        🧼 {r.buffer_minutes} mins decontamination
                      </span>
                    </td>
                    <td data-label="Purpose"><span className="text-xs">{r.purpose}</span></td>
                    <td data-label="Status">
                      <span className="badge badge-success">🛡️ Collision-Protected</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(r.id)}
                        title="Cancel reservation & release buffer"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reservation Booking Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box reservation-modal">
            <div className="modal-header">
              <h2>📅 Reserve Equipment & Lock Buffer</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {submitError && (
                  <div className="alert alert-danger">{submitError}</div>
                )}

                {/* Real-time Conflict Alert Banner */}
                {conflictWarning && (
                  <div className={`alert ${conflictWarning.isBuffer ? 'alert-warning' : 'alert-danger'} animated-shake`}>
                    <strong>⛔ Automated Collision Blocking Active:</strong>
                    <div>{conflictWarning.msg}</div>
                  </div>
                )}

                <div className="form-group mb-3">
                  <label>Equipment / Machine *</label>
                  <select
                    value={form.equipment_id}
                    onChange={e => setForm({ ...form, equipment_id: e.target.value })}
                    className="form-control"
                    required
                  >
                    {equipmentList.map(eq => (
                      <option key={eq.equipment_id} value={eq.equipment_id}>
                        {eq.name} ({eq.equipment_id}) — {eq.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Researcher Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Jane Goodall"
                      value={form.researcher_name}
                      onChange={e => setForm({ ...form, researcher_name: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label>Department / Lab</label>
                    <input
                      type="text"
                      placeholder="e.g. Biochemistry Lab 4"
                      value={form.department}
                      onChange={e => setForm({ ...form, department: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Reservation Date *</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label>Start Time *</label>
                    <input
                      type="time"
                      value={form.start_time}
                      onChange={e => setForm({ ...form, start_time: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label>End Time *</label>
                    <input
                      type="time"
                      value={form.end_time}
                      onChange={e => setForm({ ...form, end_time: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                {/* Sterilization Buffer Selector */}
                <div className="form-group mb-3 buffer-config-box">
                  <label>🧼 Sterilization & Decontamination Buffer Period</label>
                  <p className="text-muted text-xs">
                    Locks the machine after your session to prevent biological contamination, chemical residue, or thermal stress collisions.
                  </p>
                  <div className="buffer-options flex gap-2 mt-1">
                    {[15, 30, 45, 60].map(mins => (
                      <button
                        key={mins}
                        type="button"
                        className={`btn btn-sm ${form.buffer_minutes === mins ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setForm({ ...form, buffer_minutes: mins })}
                      >
                        {mins} Minutes {mins === 30 ? '(Standard)' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label>Experiment Purpose / Protocol Notes</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. High-speed bacterial lysing run at 12,000 RPM"
                    value={form.purpose}
                    onChange={e => setForm({ ...form, purpose: e.target.value })}
                    className="form-control"
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || !!conflictWarning}
                >
                  {submitting ? 'Confirming...' : conflictWarning ? 'Blocked by Collision' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
