import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { getVisuals } from '../equipmentVisuals';

export default function MaintenancePredictor() {
  const location = useLocation();
  const navigate = useNavigate();

  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEqId, setSelectedEqId] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  // Telemetry simulation state
  const [telemetry, setTelemetry] = useState({
    runtime_hours: 480,
    peak_temperature_c: 62,
    vibration_rms: 1.9,
    power_cycles: 190,
    thermal_stress_events: 3,
    last_service_days: 65,
    rpm: 3800
  });

  // AI engine settings
  const [provider, setProvider] = useState('heuristic'); // 'heuristic' | 'groq' | 'openai'
  const [apiKey, setApiKey] = useState(localStorage.getItem('lab_ai_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    api.getEquipment().then(data => {
      setEquipmentList(data);
      if (data.length > 0) {
        // If navigated with state from Digital Twin or Equipment list
        const navId = location.state?.equipment_id;
        const initialId = navId && data.some(e => e.equipment_id === navId) ? navId : data[0].equipment_id;
        setSelectedEqId(initialId);

        if (location.state?.telemetry) {
          setTelemetry(prev => ({ ...prev, ...location.state.telemetry }));
        }
      }
    }).catch(err => console.error('Failed to load equipment:', err));
  }, [location.state]);

  const selectedEquipment = equipmentList.find(e => e.equipment_id === selectedEqId);
  const visuals = selectedEquipment ? getVisuals(selectedEquipment.name, selectedEquipment.category) : null;

  // Preset scenarios
  const applyPreset = (type) => {
    if (type === 'healthy') {
      setTelemetry({
        runtime_hours: 120,
        peak_temperature_c: 41,
        vibration_rms: 0.8,
        power_cycles: 55,
        thermal_stress_events: 0,
        last_service_days: 20,
        rpm: 3000
      });
    } else if (type === 'moderate') {
      setTelemetry({
        runtime_hours: 890,
        peak_temperature_c: 72,
        vibration_rms: 2.8,
        power_cycles: 310,
        thermal_stress_events: 4,
        last_service_days: 110,
        rpm: 8500
      });
    } else if (type === 'critical') {
      setTelemetry({
        runtime_hours: 1840,
        peak_temperature_c: 94,
        vibration_rms: 5.6,
        power_cycles: 620,
        thermal_stress_events: 9,
        last_service_days: 215,
        rpm: 14200
      });
    }
  };

  const handleRunPrediction = async () => {
    if (!selectedEqId) return;
    setScanning(true);
    setError(null);

    // Save key if entered
    if (apiKey) localStorage.setItem('lab_ai_api_key', apiKey);

    try {
      // Small simulated scan delay for visual impact
      await new Promise(r => setTimeout(r, 650));

      const res = await api.predictMaintenance({
        equipment_id: selectedEqId,
        equipment_name: selectedEquipment ? selectedEquipment.name : selectedEqId,
        telemetry,
        provider,
        apiKey: apiKey.trim()
      });

      setPrediction(res);
    } catch (err) {
      setError(err.message || 'Failed to compute prediction');
    } finally {
      setScanning(false);
    }
  };

  // Run automatically on first selection change
  useEffect(() => {
    if (selectedEqId) {
      handleRunPrediction();
    }
  }, [selectedEqId]);

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 50) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <div className="maintenance-predictor-page">
      {/* Header */}
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">🤖 AI-Powered Maintenance Predictor</h1>
          <p className="page-subtitle">
            Analyzes multi-sensor telemetry logs, thermal peaks, and runtime fatigue to predict breakdown windows before failure occurs.
          </p>
        </div>

        {/* AI Provider selector */}
        <div className="ai-provider-pill">
          <span className="pill-label">Inference Engine:</span>
          <select
            value={provider}
            onChange={e => {
              setProvider(e.target.value);
              if (e.target.value !== 'heuristic') setShowKeyInput(true);
            }}
            className="provider-select"
          >
            <option value="heuristic">⚡ Built-in Physics Engine (Zero-Latency)</option>
            <option value="groq">🤖 Groq LLaMA-3 (API Wrapper)</option>
            <option value="openai">✨ OpenAI GPT-4o (API Wrapper)</option>
          </select>
          {provider !== 'heuristic' && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowKeyInput(!showKeyInput)}
              title="Configure API Key"
            >
              🔑 {apiKey ? 'Key Set' : 'Set Key'}
            </button>
          )}
        </div>
      </div>

      {showKeyInput && provider !== 'heuristic' && (
        <div className="api-key-banner">
          <div className="flex items-center gap-2">
            <span>🔑 Enter {provider.toUpperCase()} API Key:</span>
            <input
              type="password"
              placeholder={`Enter ${provider} key... (or leave empty to use server env)`}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="api-key-input"
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                localStorage.setItem('lab_ai_api_key', apiKey);
                setShowKeyInput(false);
                handleRunPrediction();
              }}
            >
              Save & Analyze
            </button>
          </div>
          <p className="text-muted text-xs mt-1">
            API key is stored locally in your browser and used only for telemetry synthesis.
          </p>
        </div>
      )}

      {/* Main Grid */}
      <div className="predictor-layout">
        {/* Left Column: Equipment & Telemetry Controls */}
        <div className="telemetry-panel card">
          <div className="panel-title-bar">
            <h3>🔬 Equipment Telemetry & Stress Logs</h3>
            <span className="chip chip-info">Live Stream</span>
          </div>

          {/* Equipment selector */}
          <div className="form-group mb-3">
            <label>Target Machine:</label>
            <select
              value={selectedEqId}
              onChange={e => setSelectedEqId(e.target.value)}
              className="form-control select-primary"
            >
              {equipmentList.map(eq => (
                <option key={eq.equipment_id} value={eq.equipment_id}>
                  {eq.equipment_id} — {eq.name} ({eq.location}) [{eq.status}]
                </option>
              ))}
            </select>
          </div>

          {/* Equipment preview card snippet */}
          {selectedEquipment && (
            <div className="equipment-preview-badge">
              <div className="preview-avatar">
                {visuals?.img ? (
                  <img src={visuals.img} alt={selectedEquipment.name} />
                ) : (
                  <span>{visuals?.emoji || '🔬'}</span>
                )}
              </div>
              <div className="preview-details">
                <strong>{selectedEquipment.name}</strong>
                <div className="text-muted text-xs">
                  Category: {selectedEquipment.category} | Location: {selectedEquipment.location}
                </div>
                <div className="text-muted text-xs">
                  Purchased: {selectedEquipment.purchase_date} | Status: <span className="status-highlight">{selectedEquipment.status}</span>
                </div>
              </div>
            </div>
          )}

          {/* Scenario presets */}
          <div className="preset-bar">
            <span className="text-muted text-xs">Quick Simulation Scenarios:</span>
            <div className="preset-buttons">
              <button className="btn-chip chip-green" onClick={() => applyPreset('healthy')}>
                🟢 Healthy (New)
              </button>
              <button className="btn-chip chip-amber" onClick={() => applyPreset('moderate')}>
                🟡 Moderate Fatigue
              </button>
              <button className="btn-chip chip-red" onClick={() => applyPreset('critical')}>
                🔴 Imminent Breakdown
              </button>
            </div>
          </div>

          {/* Telemetry Sliders / Inputs */}
          <div className="telemetry-sliders">
            {/* Runtime Hours */}
            <div className="slider-row">
              <div className="slider-header">
                <span>⏱️ Total Runtime Hours</span>
                <strong>{telemetry.runtime_hours} hrs</strong>
              </div>
              <input
                type="range"
                min="10"
                max="2500"
                step="10"
                value={telemetry.runtime_hours}
                onChange={e => setTelemetry({ ...telemetry, runtime_hours: Number(e.target.value) })}
                className="range-slider"
              />
              <div className="slider-ticks">
                <span>0 hrs</span>
                <span>Threshold: 1,000 hrs</span>
                <span>2,500 hrs</span>
              </div>
            </div>

            {/* Peak Operating Temperature */}
            <div className="slider-row">
              <div className="slider-header">
                <span>🔥 Peak Temperature Recorded</span>
                <strong className={telemetry.peak_temperature_c > 75 ? 'text-danger' : ''}>
                  {telemetry.peak_temperature_c} °C
                </strong>
              </div>
              <input
                type="range"
                min="20"
                max="110"
                step="1"
                value={telemetry.peak_temperature_c}
                onChange={e => setTelemetry({ ...telemetry, peak_temperature_c: Number(e.target.value) })}
                className="range-slider"
              />
              <div className="slider-ticks">
                <span>20°C (Cold)</span>
                <span>Warning: 70°C</span>
                <span>Danger: 85°C+</span>
              </div>
            </div>

            {/* Mechanical Vibration RMS */}
            <div className="slider-row">
              <div className="slider-header">
                <span>〰️ Mechanical Vibration (ISO 10816)</span>
                <strong className={telemetry.vibration_rms > 3.5 ? 'text-danger' : ''}>
                  {telemetry.vibration_rms} mm/s RMS
                </strong>
              </div>
              <input
                type="range"
                min="0.2"
                max="7.0"
                step="0.1"
                value={telemetry.vibration_rms}
                onChange={e => setTelemetry({ ...telemetry, vibration_rms: Number(e.target.value) })}
                className="range-slider"
              />
              <div className="slider-ticks">
                <span>0.5 (Smooth)</span>
                <span>2.5 (Alert)</span>
                <span>5.0+ (Critical)</span>
              </div>
            </div>

            {/* Thermal Stress Cycles */}
            <div className="slider-row">
              <div className="slider-header">
                <span>⚡ Thermal Shock Cycles</span>
                <strong>{telemetry.thermal_stress_events} events</strong>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={telemetry.thermal_stress_events}
                onChange={e => setTelemetry({ ...telemetry, thermal_stress_events: Number(e.target.value) })}
                className="range-slider"
              />
            </div>

            {/* Days Since Last Maintenance */}
            <div className="slider-row">
              <div className="slider-header">
                <span>🔧 Days Since Last Service / Calibration</span>
                <strong>{telemetry.last_service_days} days ago</strong>
              </div>
              <input
                type="range"
                min="1"
                max="300"
                step="5"
                value={telemetry.last_service_days}
                onChange={e => setTelemetry({ ...telemetry, last_service_days: Number(e.target.value) })}
                className="range-slider"
              />
            </div>
          </div>

          <div className="panel-actions mt-3 flex gap-2">
            <button
              className="btn btn-primary flex-1 btn-animated"
              onClick={handleRunPrediction}
              disabled={scanning}
            >
              {scanning ? '🔄 Analyzing Telemetry Vectors...' : '⚡ Run AI Health Diagnosis'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/digital-twin', { state: { equipment_id: selectedEqId } })}
              title="Open in Digital Twin Simulator"
            >
              🎛️ Digital Twin
            </button>
          </div>
        </div>

        {/* Right Column: AI Health Diagnosis Results */}
        <div className="diagnosis-panel card">
          <div className="panel-title-bar">
            <h3>📊 Machine Health & Failure Prediction</h3>
            {prediction && (
              <span className="chip chip-accent">
                {prediction.source || 'AI Engine'}
              </span>
            )}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {scanning && (
            <div className="scanning-overlay">
              <div className="radar-scanner"></div>
              <p>Scanning sensor frequency harmonics, thermal gradient curves, and ISO wear models...</p>
            </div>
          )}

          {prediction && !scanning && (
            <div className="prediction-results">
              {/* Top Hero Stats: Health Score & Days to Breakdown */}
              <div className="health-score-hero">
                <div className="score-circle-wrapper">
                  <svg className="score-circle-svg" viewBox="0 0 100 100">
                    <circle className="circle-bg" cx="50" cy="50" r="42" />
                    <circle
                      className="circle-progress"
                      cx="50"
                      cy="50"
                      r="42"
                      stroke={getScoreColor(prediction.health_score)}
                      strokeDasharray={264}
                      strokeDashoffset={264 - (264 * prediction.health_score) / 100}
                    />
                  </svg>
                  <div className="score-text-inside">
                    <span className="score-number" style={{ color: getScoreColor(prediction.health_score) }}>
                      {prediction.health_score}
                    </span>
                    <span className="score-label">/ 100</span>
                    <span className="score-subtext">Health Score</span>
                  </div>
                </div>

                <div className="score-meta">
                  <div className="meta-card">
                    <span className="meta-label">Breakdown Risk</span>
                    <span className={`risk-badge risk-${prediction.risk_level?.toLowerCase()}`}>
                      {prediction.risk_level} Risk
                    </span>
                  </div>

                  <div className="meta-card">
                    <span className="meta-label">Predicted Useful Life</span>
                    <strong className="failure-countdown">
                      ~ {prediction.days_until_failure} Days
                    </strong>
                    <span className="text-muted text-xs">Until catastrophic component failure</span>
                  </div>

                  <div className="meta-card">
                    <span className="meta-label">Primary Root Stressor</span>
                    <span className="primary-factor-text">
                      {prediction.primary_risk_factor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stress Analysis & Anomalies */}
              <div className="result-section">
                <h4>⚠️ Identified Telemetry Stress Vectors</h4>
                <ul className="anomaly-list">
                  {prediction.issues?.map((issue, idx) => (
                    <li key={idx} className="anomaly-item">
                      <span className="anomaly-icon">🔸</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Recommended Actions */}
              <div className="result-section">
                <h4>🛠️ AI Preventative Maintenance Protocol</h4>
                <div className="recommendations-container">
                  {prediction.recommendations?.map((rec, idx) => (
                    <div key={idx} className="rec-card">
                      <div className="rec-num">0{idx + 1}</div>
                      <div className="rec-text">{rec}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="prediction-cta-bar">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/reservations', {
                    state: {
                      equipment_id: selectedEqId,
                      equipment_name: selectedEquipment?.name,
                      purpose: `Preventative Maintenance - Predicted breakdown in ${prediction.days_until_failure} days`
                    }
                  })}
                >
                  📅 Reserve Sterilization & Maintenance Window
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/equipment/${selectedEqId}`)}
                >
                  📋 View Maintenance History
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
