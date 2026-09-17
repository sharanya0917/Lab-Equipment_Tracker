import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api';
import { getVisuals } from '../equipmentVisuals';

export default function DigitalTwin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEqId, setSelectedEqId] = useState('EQ-002'); // Default to Centrifuge

  // Twin simulation state
  const [powerState, setPowerState] = useState('RUN'); // 'OFF' | 'STANDBY' | 'RUN'
  const [targetRpm, setTargetRpm] = useState(8500);
  const [targetTemp, setTargetTemp] = useState(37);
  const [vibrationStress, setVibrationStress] = useState(1.8);
  const [vacuumLevel, setVacuumLevel] = useState(98); // %
  const [activeFault, setActiveFault] = useState(null);

  // Live telemetry stream (physics dampening toward target)
  const [liveTelemetry, setLiveTelemetry] = useState({
    currentRpm: 8480,
    currentTemp: 37.2,
    currentVib: 1.85,
    powerWatts: 450,
    elapsedSeconds: 0
  });

  const canvasRef = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => {
    api.getEquipment().then(data => {
      setEquipmentList(data);
      if (location.state?.equipment_id && data.some(e => e.equipment_id === location.state.equipment_id)) {
        setSelectedEqId(location.state.equipment_id);
      }
    }).catch(err => console.error(err));
  }, [location.state]);

  const selectedEquipment = equipmentList.find(e => e.equipment_id === selectedEqId) || {
    name: 'High-Speed Centrifuge',
    equipment_id: 'EQ-002',
    category: 'Instruments',
    location: 'Lab B'
  };

  const visuals = getVisuals(selectedEquipment.name, selectedEquipment.category);

  // Physics animation loop & telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTelemetry(prev => {
        let destRpm = powerState === 'RUN' ? targetRpm : 0;
        let destTemp = powerState === 'RUN' ? targetTemp : 22; // room temp
        let destVib = powerState === 'RUN' ? vibrationStress : 0.1;

        // Apply fault perturbations
        if (activeFault === 'imbalance') {
          destVib += 3.8;
          destRpm = Math.min(destRpm, 11500);
        } else if (activeFault === 'overheat') {
          destTemp += 45;
        } else if (activeFault === 'bearing') {
          destVib += 2.9;
          destTemp += 25;
        }

        // Smooth physics interpolation with sensor jitter
        const jitter = (Math.random() - 0.5);
        const newRpm = Math.max(0, Math.round(prev.currentRpm + (destRpm - prev.currentRpm) * 0.15 + jitter * 12));
        const newTemp = Number((prev.currentTemp + (destTemp - prev.currentTemp) * 0.08 + jitter * 0.2).toFixed(1));
        const newVib = Number(Math.max(0.1, prev.currentVib + (destVib - prev.currentVib) * 0.12 + jitter * 0.05).toFixed(2));
        const watts = powerState === 'RUN' ? Math.round(120 + (newRpm / 15000) * 800 + (newTemp > 50 ? 250 : 0)) : 15;

        // Store into history for waveform drawing
        historyRef.current.push({
          rpm: newRpm,
          temp: newTemp,
          vib: newVib,
          time: prev.elapsedSeconds + 1
        });
        if (historyRef.current.length > 50) historyRef.current.shift();

        return {
          currentRpm: newRpm,
          currentTemp: newTemp,
          currentVib: newVib,
          powerWatts: watts,
          elapsedSeconds: prev.elapsedSeconds + 1
        };
      });
    }, 250);

    return () => clearInterval(interval);
  }, [powerState, targetRpm, targetTemp, vibrationStress, activeFault]);

  // Real-time canvas waveform drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const history = historyRef.current;
    if (history.length < 2) return;

    // Draw RPM Waveform (Cyan)
    ctx.beginPath();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    history.forEach((pt, i) => {
      const x = (i / 49) * width;
      const normalizedRpm = Math.min(1, pt.rpm / 15000);
      const y = height * 0.55 - normalizedRpm * (height * 0.45);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Temperature Curve (Amber/Red)
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    history.forEach((pt, i) => {
      const x = (i / 49) * width;
      const normalizedTemp = Math.min(1, (pt.temp - 10) / 90);
      const y = height * 0.95 - normalizedTemp * (height * 0.4);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Vibration Spectral Spikes (Rose)
    ctx.beginPath();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.8;
    history.forEach((pt, i) => {
      const x = (i / 49) * width;
      const normalizedVib = Math.min(1, pt.vib / 7.0);
      const y = height * 0.9 - normalizedVib * (height * 0.35);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

  }, [liveTelemetry]);

  // Alarm threshold calculation
  const isOverheat = liveTelemetry.currentTemp > 75;
  const isSevereVibration = liveTelemetry.currentVib > 4.0;
  const isCritical = isOverheat || isSevereVibration;

  // Transfer live twin telemetry to AI Predictor
  const handleAnalyzeWithAI = () => {
    navigate('/maintenance-predictor', {
      state: {
        equipment_id: selectedEqId,
        telemetry: {
          runtime_hours: Math.round(500 + liveTelemetry.elapsedSeconds * 4),
          peak_temperature_c: Math.round(liveTelemetry.currentTemp),
          vibration_rms: Number(liveTelemetry.currentVib.toFixed(1)),
          power_cycles: 240,
          thermal_stress_events: isOverheat ? 8 : 2,
          last_service_days: 75,
          rpm: liveTelemetry.currentRpm
        }
      }
    });
  };

  return (
    <div className="digital-twin-page">
      {/* Top Header */}
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">🎛️ Interactive Digital Twin Simulator</h1>
          <p className="page-subtitle">
            Real-time physical telemetry emulator with virtual knob actuators, rotor dynamics, and fault injection.
          </p>
        </div>

        <div className="twin-equipment-picker">
          <label className="text-muted text-xs mr-2">Digital Twin Subject:</label>
          <select
            value={selectedEqId}
            onChange={e => setSelectedEqId(e.target.value)}
            className="form-control select-primary"
          >
            {equipmentList.map(eq => (
              <option key={eq.equipment_id} value={eq.equipment_id}>
                {eq.name} ({eq.equipment_id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Safety Interlock Alarm Banner */}
      {isCritical && (
        <div className="alarm-banner alert alert-danger animated-pulse">
          <span className="alarm-icon">🚨</span>
          <div>
            <strong>CRITICAL TELEMETRY OVERLOAD DETECTED!</strong>
            <div>
              {isOverheat && ` • Thermal limit exceeded: ${liveTelemetry.currentTemp}°C > 75°C. `}
              {isSevereVibration && ` • Harmonic oscillation warning: ${liveTelemetry.currentVib} mm/s RMS > 4.0 mm/s.`}
            </div>
          </div>
          <button
            className="btn btn-sm btn-danger ml-auto"
            onClick={() => {
              setPowerState('OFF');
              setActiveFault(null);
            }}
          >
            🛑 E-STOP SHUTDOWN
          </button>
        </div>
      )}

      {/* Digital Twin Layout */}
      <div className="twin-grid">
        {/* Left Column: Virtual Control Knobs & Actuators */}
        <div className="card control-console">
          <div className="panel-title-bar">
            <h3>🎚️ Virtual Actuators & Knobs</h3>
            <span className={`status-pill pill-${powerState.toLowerCase()}`}>
              {powerState === 'RUN' ? 'RUNNING' : powerState}
            </span>
          </div>

          {/* Main Power Controls */}
          <div className="power-switch-group">
            <span className="label">Operating Mode:</span>
            <div className="btn-group">
              <button
                className={`btn ${powerState === 'OFF' ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => { setPowerState('OFF'); setActiveFault(null); }}
              >
                OFF
              </button>
              <button
                className={`btn ${powerState === 'STANDBY' ? 'btn-warning' : 'btn-secondary'}`}
                onClick={() => setPowerState('STANDBY')}
              >
                STANDBY
              </button>
              <button
                className={`btn ${powerState === 'RUN' ? 'btn-success' : 'btn-secondary'}`}
                onClick={() => setPowerState('RUN')}
              >
                RUN
              </button>
            </div>
          </div>

          {/* Rotary Knob / Sliders */}
          <div className="knobs-container">
            {/* Target RPM */}
            <div className="knob-box">
              <div className="knob-header">
                <span>⚡ Rotor Speed (RPM)</span>
                <span className="knob-value">{targetRpm.toLocaleString()} RPM</span>
              </div>
              <input
                type="range"
                min="0"
                max="15000"
                step="250"
                value={targetRpm}
                onChange={e => setTargetRpm(Number(e.target.value))}
                className="range-slider range-cyan"
                disabled={powerState === 'OFF'}
              />
              <div className="knob-sub">
                <span>0 RPM</span>
                <span>Max 15,000 RPM</span>
              </div>
            </div>

            {/* Chamber Temperature */}
            <div className="knob-box">
              <div className="knob-header">
                <span>🌡️ Temperature Dial</span>
                <span className="knob-value">{targetTemp} °C</span>
              </div>
              <input
                type="range"
                min="4"
                max="95"
                step="1"
                value={targetTemp}
                onChange={e => setTargetTemp(Number(e.target.value))}
                className="range-slider range-amber"
                disabled={powerState === 'OFF'}
              />
              <div className="knob-sub">
                <span>4°C (Refrigerated)</span>
                <span>95°C (Boil/PCR)</span>
              </div>
            </div>

            {/* Vibration / Damper */}
            <div className="knob-box">
              <div className="knob-header">
                <span>〰️ Base Harmonic Vibration</span>
                <span className="knob-value">{vibrationStress} mm/s</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={vibrationStress}
                onChange={e => setVibrationStress(Number(e.target.value))}
                className="range-slider range-rose"
                disabled={powerState === 'OFF'}
              />
              <div className="knob-sub">
                <span>0.5 mm/s (Ideal)</span>
                <span>5.0 mm/s (Severe)</span>
              </div>
            </div>

            {/* Vacuum Pump Level */}
            <div className="knob-box">
              <div className="knob-header">
                <span>🌀 Chamber Vacuum Integrity</span>
                <span className="knob-value">{vacuumLevel} %</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={vacuumLevel}
                onChange={e => setVacuumLevel(Number(e.target.value))}
                className="range-slider"
                disabled={powerState === 'OFF'}
              />
            </div>
          </div>

          {/* Fault Injection Panel */}
          <div className="fault-injection-section">
            <span className="section-label">⚡ Stress Stressors & Fault Injection:</span>
            <div className="fault-chips">
              <button
                className={`chip-btn ${activeFault === 'overheat' ? 'active-fault' : ''}`}
                onClick={() => setActiveFault(activeFault === 'overheat' ? null : 'overheat')}
              >
                🔥 Thermal Spike (+45°C)
              </button>
              <button
                className={`chip-btn ${activeFault === 'imbalance' ? 'active-fault' : ''}`}
                onClick={() => setActiveFault(activeFault === 'imbalance' ? null : 'imbalance')}
              >
                ⚠️ Rotor Imbalance
              </button>
              <button
                className={`chip-btn ${activeFault === 'bearing' ? 'active-fault' : ''}`}
                onClick={() => setActiveFault(activeFault === 'bearing' ? null : 'bearing')}
              >
                ⚙️ Bearing Seizure
              </button>
            </div>
          </div>

          {/* Action to bridge to AI Predictor */}
          <div className="bridge-action-box">
            <button
              className="btn btn-primary w-100"
              onClick={handleAnalyzeWithAI}
            >
              🧠 Feed Live Twin Telemetry into AI Predictor →
            </button>
          </div>
        </div>

        {/* Right Column: Visual Apparatus & Telemetry Displays */}
        <div className="card telemetry-display-console">
          <div className="panel-title-bar">
            <h3>📡 Live Telemetry Oscillogram</h3>
            <div className="telemetry-badges">
              <span className="badge-legend cyan">RPM</span>
              <span className="badge-legend amber">Temp (°C)</span>
              <span className="badge-legend rose">Vibration</span>
            </div>
          </div>

          {/* Digital Twin 3D/2D Visual Schematic */}
          <div className="twin-schematic-wrapper">
            <div className="schematic-container">
              {/* Rotor animation ring */}
              <div
                className={`centrifuge-rotor ${powerState === 'RUN' ? 'spinning' : ''}`}
                style={{
                  animationDuration: liveTelemetry.currentRpm > 0 ? `${Math.max(0.08, 15000 / (liveTelemetry.currentRpm * 8))}s` : '0s',
                  borderColor: isCritical ? '#ef4444' : '#06b6d4'
                }}
              >
                <div className="rotor-spoke spoke-1"></div>
                <div className="rotor-spoke spoke-2"></div>
                <div className="rotor-spoke spoke-3"></div>
                <div className="rotor-spoke spoke-4"></div>
                <div className="rotor-core">
                  <span>{liveTelemetry.currentRpm}</span>
                  <small>RPM</small>
                </div>
              </div>

              {/* Apparatus image and chamber glow */}
              <div className="apparatus-overlay">
                <div className="apparatus-name">
                  <strong>{selectedEquipment.name}</strong>
                  <span>{selectedEquipment.equipment_id} • {selectedEquipment.location}</span>
                </div>
                <div className="apparatus-status">
                  Interlock: <span className="text-success">SEALED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Oscillograph Waveform Canvas */}
          <div className="oscillograph-card">
            <div className="oscillograph-header">
              <span>Dynamic Waveform Stream (50 samples / 4Hz)</span>
              <span className="stream-badge">LIVE 240Hz</span>
            </div>
            <canvas
              ref={canvasRef}
              width={560}
              height={160}
              className="waveform-canvas"
            />
          </div>

          {/* Live Telemetry Digital Gauges */}
          <div className="gauges-row">
            <div className="gauge-card">
              <span className="gauge-label">Rotor Speed</span>
              <span className="gauge-num cyan-text">{liveTelemetry.currentRpm.toLocaleString()}</span>
              <span className="gauge-unit">RPM</span>
            </div>

            <div className="gauge-card">
              <span className="gauge-label">Chamber Temp</span>
              <span className={`gauge-num ${isOverheat ? 'red-text' : 'amber-text'}`}>
                {liveTelemetry.currentTemp}
              </span>
              <span className="gauge-unit">°C</span>
            </div>

            <div className="gauge-card">
              <span className="gauge-label">Vibration RMS</span>
              <span className={`gauge-num ${isSevereVibration ? 'red-text' : 'rose-text'}`}>
                {liveTelemetry.currentVib}
              </span>
              <span className="gauge-unit">mm/s</span>
            </div>

            <div className="gauge-card">
              <span className="gauge-label">Power Consumption</span>
              <span className="gauge-num green-text">{liveTelemetry.powerWatts}</span>
              <span className="gauge-unit">Watts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
