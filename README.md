# 🔬 Smart Lab Equipment Management & Telemetry Twin Platform

An advanced, full-stack Laboratory Equipment Tracking & Predictive Maintenance Platform built with React, Vite, Express.js, and MongoDB. It combines real-time digital twin telemetry, AI-driven failure prediction, and collision-proof smart reservation scheduling with automated sterilization buffers.

---

## 🌟 Key Features & Modules

### 1. 🤖 AI-Powered Maintenance Predictor (`/maintenance-predictor`)
Analyzes multi-sensor telemetry logs, runtime history, and thermal stress vectors to predict machine breakdown windows before hardware failure occurs.

- **Multi-Vector Telemetry Stress Log Inputs**:
  - Total Runtime Hours (10 – 2,500 hrs)
  - Peak Operating Temperature (20°C – 110°C)
  - Mechanical Vibration RMS (ISO 10816 standards, 0.2 – 7.0 mm/s)
  - Thermal Shock Cycles & Days Since Last Calibration
- **Quick Preset Stress Scenarios**:
  - 🟢 **Healthy (New)**: Low run time, baseline temperature & vibration.
  - 🟡 **Moderate Fatigue**: Aging bearings, occasional thermal peaks.
  - 🔴 **Imminent Breakdown**: Thermal peaks >85°C, critical vibration >5.0 mm/s.
- **Dual AI Engine Support**:
  - **⚡ Built-in Physics Engine**: Instant, zero-latency deterministic algorithm based on thermal fatigue, bearing wear curves, and ISO standards.
  - **🤖 LLM API Wrapper (Groq LLaMA-3 / OpenAI GPT-4o)**: Option to plug in custom API keys to run deep LLM predictive diagnostics.
- **Visual Diagnostics**:
  - Animated circular **Health Score Meter** (0–100).
  - Risk Level indicators (`Low`, `Moderate`, `High`, `Critical`).
  - Estimated Remaining Useful Life (RUL) countdown.
  - Root cause explanation and actionable preventative protocols.
  - 1-click shortcut to schedule a **Sterilization & Maintenance Reservation Window**.

---

### 2. 🎛️ Interactive Digital Twin Simulator (`/digital-twin`)
A visual control console allowing researchers and lab engineers to virtually adjust operating knobs and monitor simulated real-time telemetry waveforms.

- **Virtual Control Panel & Dials**:
  - Operating Mode (`OFF`, `STANDBY`, `RUN`)
  - Rotor Speed (0 – 15,000 RPM)
  - Temperature (4°C – 95°C)
  - Harmonic Vibration Damper (0.5 – 5.0 mm/s)
  - Vacuum Chamber Pressure Integrity (20% – 100%)
- **Fault Injection Suite**:
  - 🔥 **Thermal Spike (+45°C)**
  - ⚠️ **Rotor Imbalance**
  - ⚙️ **Bearing Seizure**
- **Dynamic Visuals & Oscillogram**:
  - Animated spinning rotor with dynamic motion blur synchronized with live RPM.
  - Multi-trace **HTML5 Canvas Oscillogram**: Real-time waveform stream plotting RPM (cyan), Temperature (amber), and Vibration (rose).
  - **Overload Interlock**: Emergency `🛑 E-STOP SHUTDOWN` trigger with visual warning banners.
  - **Bridge to AI Predictor**: 1-click transfer of live digital twin state directly into the AI Maintenance Predictor.

---

### 3. 📅 Smart Calendar Reservation System (`/reservations`)
An automated booking system for lab equipment with collision detection and mandatory decontamination buffer windows.

- **Visual Hourly Timeline Grid**:
  - Displays lab operating hours (08:00 to 20:00).
  - 🟦 **Active Booking Block**: Displays researcher details & experiment protocol.
  - 🟣 **Sterilization Buffer Block**: Visual decontamination block following each session.
  - 🟩 **Available Time Slots**.
- **Automated Collision Blocking**:
  - Prevents overlapping reservations for the same machine.
  - Enforces mandatory sterilization buffer periods (15m, 30m, 45m, 60m).
  - Blocks any booking attempt that violates either an existing slot or its decontamination buffer.
- **Live Conflict Validation**: Shaking alert banners and immediate form validation prevent conflicting submissions.
- **Reservation Management**: Filterable reservation manifest with 1-click cancellation to release time slots and decontamination locks.

---

### 4. 🧰 Equipment Catalog (`/equipment`)
- Comprehensive listing of laboratory equipment with interactive image previews, specifications, location details, operational status tags (`Available`, `In Use`, `Under Maintenance`), and real-time search/filtering.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**:
  - **Framework**: React 18 + Vite
  - **Icons**: `lucide-react`
  - **Styling**: Modern dark-theme glassmorphism CSS design system with custom CSS variables, responsive grids, micro-interactions, and HTML5 Canvas visuals.
- **Backend**:
  - **Framework**: Node.js + Express.js
  - **Database**: MongoDB Atlas (with seamless zero-downtime in-memory fallback datastore if database connectivity is unavailable).
  - **API Format**: RESTful JSON API.

---

## 📡 REST API Documentation

### Equipment Endpoints
- `GET /api/equipment`: Retrieve all laboratory equipment.
- `GET /api/equipment/:id`: Retrieve details for a specific equipment item.

### Reservation Endpoints
- `GET /api/reservations`: Fetch confirmed reservations (supports `?equipmentId=` and `?date=` filters).
- `POST /api/reservations`: Create a new reservation.
  - **Payload**:
    ```json
    {
      "equipmentId": "eq-1",
      "researcherName": "Dr. Alice Smith",
      "date": "2026-09-15",
      "startTime": "10:00",
      "endTime": "12:00",
      "purpose": "DNA Sequencing",
      "sterilizationBufferMins": 30
    }
    ```
  - **Responses**: `201 Created` on success, `409 Conflict` if double-booked or buffer period violated.
- `DELETE /api/reservations/:id`: Cancel a reservation and free up time slots.

### AI Predictive Telemetry Endpoint
- `POST /api/ai/predict-maintenance`: Analyze usage telemetry metrics.
  - **Payload**:
    ```json
    {
      "runtimeHours": 850,
      "peakTempC": 88,
      "vibrationRms": 5.2,
      "thermalCycles": 140,
      "daysSinceCalibration": 120,
      "apiKey": "optional-groq-or-openai-key"
    }
    ```
  - **Response**: Returns calculated `healthScore`, `riskLevel`, `estimatedFailureDays`, `stressVectors`, and `recommendation`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Environment**:
   Run both frontend and backend servers concurrently:
   ```bash
   npm run dev
   ```
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:5000](http://localhost:5000)

3. **Build for Production**:
   ```bash
   npm run --workspace frontend build
   ```

---

## 📊 Summary of Project Structure

```
hackathon/
├── backend/
│   ├── db/              # Seed SQL & initialization scripts
│   ├── seedData.js      # Initial equipment fallback dataset
│   ├── server.js        # Express REST API, collision math & AI engine
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Header, Navbar & re-usable UI elements
│   │   ├── pages/       # Dashboard, DigitalTwin, MaintenancePredictor, Reservations, Equipment Detail/List
│   │   ├── api.js       # Centralized API service layer
│   │   ├── equipmentVisuals.js # SVG & visual assets mapping
│   │   ├── index.css    # Premium CSS design system
│   │   └── App.jsx      # Navigation router & main state layout
│   └── package.json
├── README.md
└── package.json
```
