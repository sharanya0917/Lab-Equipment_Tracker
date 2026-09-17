require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const seedEquipments = require('./seedData');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'lab_tracker';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// In-memory robust fallback store in case MongoDB Atlas has DNS/SSL/IP whitelist issues
class MemoryStore {
  constructor() {
    this.equipment = JSON.parse(JSON.stringify(seedEquipments));
    this.issues = [];
    this.maintenance = [];
    this.reservations = [
      {
        id: 'res-101',
        equipment_id: 'EQ-002',
        equipment_name: 'Centrifuge',
        researcher_name: 'Dr. Sarah Connor',
        department: 'Biochemistry',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        start_time: '10:00',
        end_time: '12:00',
        buffer_minutes: 30,
        purpose: 'Sample separation and protein extraction',
        status: 'Confirmed',
        created_at: new Date().toISOString()
      },
      {
        id: 'res-102',
        equipment_id: 'EQ-001',
        equipment_name: 'Oscilloscope',
        researcher_name: 'Alex Rivera',
        department: 'Quantum Devices',
        date: new Date().toISOString().split('T')[0], // Today
        start_time: '14:00',
        end_time: '16:00',
        buffer_minutes: 30,
        purpose: 'Signal harmonic analysis',
        status: 'Confirmed',
        created_at: new Date().toISOString()
      }
    ];
  }
}

const memStore = new MemoryStore();
let db = null;
let useMongo = false;

// Attempt MongoDB connection with 4s timeout; fallback gracefully if unreachable
async function initDB() {
  try {
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 3000, connectTimeoutMS: 3000 });
    await client.connect();
    db = client.db(DB_NAME);
    useMongo = true;
    console.log('✅ Connected to MongoDB Atlas');

    // Upsert equipment to ensure full 50-item catalog is loaded
    const equipmentCol = db.collection('equipment');
    for (const eq of seedEquipments) {
      await equipmentCol.updateOne(
        { equipment_id: eq.equipment_id },
        { $setOnInsert: eq },
        { upsert: true }
      );
    }
    console.log('🔧 Synced 50-item equipment catalog in MongoDB');

  } catch (err) {
    console.warn(`⚠️ MongoDB connection unavailable (${err.message}). Using resilient local in-memory store.`);
    useMongo = false;
  }
}

// --- Google OAuth (Passport) ------------------------------------------------
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Upsert user record in MongoDB or memory store
      const userRecord = {
        googleId: profile.id,
        displayName: profile.displayName,
        emails: profile.emails || []
      };
      if (db) {
        const usersCol = db.collection('users');
        await usersCol.updateOne({ googleId: profile.id }, { $set: userRecord }, { upsert: true });
      } else {
        memStore.users = memStore.users || [];
        if (!memStore.users.find(u => u.googleId === profile.id)) memStore.users.push(userRecord);
      }
      return done(null, userRecord);
    } catch (err) {
      return done(err);
    }
  }));

  // Route: start OAuth
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  // OAuth callback — issue JWT and redirect to frontend with token
  app.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=auth` }), (req, res) => {
    const payload = {
      id: req.user.googleId,
      name: req.user.displayName,
      emails: req.user.emails
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
    // Redirect to frontend with token in query (SPA should consume and store it)
    res.redirect(`${FRONTEND_URL}/auth?token=${token}`);
  });
} else {
  console.log('ℹ️ Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env to enable SSO.');
}

// Helper: strip MongoDB _id or convert to string to avoid React rendering issues
function sanitize(doc) {
  if (!doc) return doc;
  const d = { ...doc };
  if (d._id) d._id = String(d._id);
  return d;
}

// ── Dashboard Endpoint ───────────────────────────────────────────────────────
app.get('/api/dashboard', async (req, res) => {
  try {
    if (useMongo && db) {
      const pipeline = [
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { _id: 0, status: '$_id', count: 1 } },
      ];
      const agg = await db.collection('equipment').aggregate(pipeline).toArray();
      const result = { available: 0, inUse: 0, missing: 0, maintenance: 0 };
      agg.forEach(item => {
        if (item.status === 'Available') result.available = item.count;
        if (item.status === 'In-Use') result.inUse = item.count;
        if (item.status === 'Missing') result.missing = item.count;
        if (item.status === 'Under Maintenance') result.maintenance = item.count;
      });
      return res.json(result);
    }

    // In-memory fallback
    const result = { available: 0, inUse: 0, missing: 0, maintenance: 0 };
    memStore.equipment.forEach(item => {
      if (item.status === 'Available') result.available++;
      else if (item.status === 'In-Use') result.inUse++;
      else if (item.status === 'Missing') result.missing++;
      else if (item.status === 'Under Maintenance') result.maintenance++;
    });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Equipment CRUD ──────────────────────────────────────────────────────────
app.get('/api/equipment', async (req, res) => {
  try {
    const { search, category, status } = req.query;
    if (useMongo && db) {
      const filter = {};
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { equipment_id: { $regex: search, $options: 'i' } }
        ];
      }
      if (category) filter.category = category;
      if (status) filter.status = status;
      const list = await db.collection('equipment').find(filter).toArray();
      return res.json(list.map(sanitize));
    }

    // In-memory
    let list = memStore.equipment;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(s) || e.equipment_id.toLowerCase().includes(s));
    }
    if (category) list = list.filter(e => e.category === category);
    if (status) list = list.filter(e => e.status === status);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/equipment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useMongo && db) {
      const doc = await db.collection('equipment').findOne({ equipment_id: id });
      if (!doc) return res.status(404).json({ error: 'Not found' });
      return res.json(sanitize(doc));
    }
    const doc = memStore.equipment.find(e => e.equipment_id === id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/equipment', async (req, res) => {
  try {
    const { equipment_id, name, category, location, purchase_date, status = 'Available' } = req.body;
    const doc = { equipment_id, name, category, location, purchase_date, status };
    if (useMongo && db) {
      await db.collection('equipment').insertOne(doc);
    } else {
      memStore.equipment.push(doc);
    }
    res.json({ success: true, item: doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/equipment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useMongo && db) {
      await db.collection('equipment').updateOne({ equipment_id: id }, { $set: req.body });
    } else {
      const idx = memStore.equipment.findIndex(e => e.equipment_id === id);
      if (idx !== -1) memStore.equipment[idx] = { ...memStore.equipment[idx], ...req.body };
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/equipment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useMongo && db) {
      await db.collection('equipment').deleteOne({ equipment_id: id });
    } else {
      memStore.equipment = memStore.equipment.filter(e => e.equipment_id !== id);
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Issue & Return ──────────────────────────────────────────────────────────
app.post('/api/issue', async (req, res) => {
  try {
    const { equipment_id, borrower_name, issue_date, expected_return_date, purpose } = req.body;
    const doc = { equipment_id, borrower_name, issue_date, expected_return_date, purpose, actual_return_date: null };
    if (useMongo && db) {
      await db.collection('issues').insertOne(doc);
      await db.collection('equipment').updateOne({ equipment_id }, { $set: { status: 'In-Use' } });
    } else {
      memStore.issues.push(doc);
      const eq = memStore.equipment.find(e => e.equipment_id === equipment_id);
      if (eq) eq.status = 'In-Use';
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/return', async (req, res) => {
  try {
    const { equipment_id, actual_return_date, condition_on_return } = req.body;
    let newStatus = 'Available';
    if (condition_on_return === 'Damaged') newStatus = 'Under Maintenance';
    if (condition_on_return === 'Missing') newStatus = 'Missing';

    if (useMongo && db) {
      const issueCol = db.collection('issues');
      const latest = await issueCol.findOne({ equipment_id, actual_return_date: null }, { sort: { issue_date: -1 } });
      if (latest) {
        await issueCol.updateOne({ _id: latest._id }, { $set: { actual_return_date, condition_on_return } });
      }
      await db.collection('equipment').updateOne({ equipment_id }, { $set: { status: newStatus } });
    } else {
      const active = [...memStore.issues].reverse().find(i => i.equipment_id === equipment_id && !i.actual_return_date);
      if (active) {
        active.actual_return_date = actual_return_date;
        active.condition_on_return = condition_on_return;
      }
      const eq = memStore.equipment.find(e => e.equipment_id === equipment_id);
      if (eq) eq.status = newStatus;
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Maintenance ─────────────────────────────────────────────────────────────
app.get('/api/maintenance/:equipmentId', async (req, res) => {
  try {
    const { equipmentId } = req.params;
    if (useMongo && db) {
      const records = await db.collection('maintenance').find({ equipment_id: equipmentId }).sort({ date: -1 }).toArray();
      return res.json(records.map(sanitize));
    }
    const records = memStore.maintenance.filter(m => m.equipment_id === equipmentId);
    res.json(records);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/maintenance/:recordId', async (req, res) => {
  try {
    const { recordId } = req.params;
    if (useMongo && db) {
      const { ObjectId } = require('mongodb');
      await db.collection('maintenance').deleteOne({ _id: new ObjectId(recordId) });
    } else {
      memStore.maintenance = memStore.maintenance.filter(m => String(m._id) !== recordId);
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/maintenance', async (req, res) => {
  try {
    const { equipment_id, date, type, technician, cost, notes } = req.body;
    const doc = { equipment_id, date, type, technician, cost, notes };
    if (useMongo && db) {
      await db.collection('maintenance').insertOne(doc);
      if (type === 'Repair' || type === 'Calibration') {
        await db.collection('equipment').updateOne({ equipment_id }, { $set: { status: 'Under Maintenance' } });
      }
    } else {
      doc._id = `maint-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      memStore.maintenance.push(doc);
      if (type === 'Repair' || type === 'Calibration') {
        const eq = memStore.equipment.find(e => e.equipment_id === equipment_id);
        if (eq) eq.status = 'Under Maintenance';
      }
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── SMART CALENDAR RESERVATIONS WITH COLLISION & STERILIZATION BUFFER ─────────
// Helper to convert date + time string to epoch timestamp
function toEpoch(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}:00`).getTime();
}

app.get('/api/reservations', async (req, res) => {
  try {
    const { equipment_id, date } = req.query;
    if (useMongo && db) {
      const filter = {};
      if (equipment_id) filter.equipment_id = equipment_id;
      if (date) filter.date = date;
      const list = await db.collection('reservations').find(filter).sort({ date: 1, start_time: 1 }).toArray();
      return res.json(list.map(sanitize));
    }

    let list = memStore.reservations;
    if (equipment_id) list = list.filter(r => r.equipment_id === equipment_id);
    if (date) list = list.filter(r => r.date === date);
    list.sort((a, b) => `${a.date} ${a.start_time}`.localeCompare(`${b.date} ${b.start_time}`));
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/reservations', async (req, res) => {
  try {
    const {
      equipment_id,
      equipment_name,
      researcher_name,
      department,
      date,
      start_time,
      end_time,
      buffer_minutes = 30, // Default 30 min sterilization buffer
      purpose
    } = req.body;

    if (!equipment_id || !researcher_name || !date || !start_time || !end_time) {
      return res.status(400).json({ error: 'Missing required reservation fields' });
    }

    const proposedStart = toEpoch(date, start_time);
    const proposedEnd = toEpoch(date, end_time);
    const proposedBufferMs = (parseInt(buffer_minutes) || 0) * 60 * 1000;
    const proposedTotalEnd = proposedEnd + proposedBufferMs;

    if (proposedEnd <= proposedStart) {
      return res.status(400).json({ error: 'End time must be strictly after start time' });
    }

    // Retrieve existing reservations for this equipment on the target date
    let existing = [];
    if (useMongo && db) {
      existing = await db.collection('reservations').find({ equipment_id, date }).toArray();
    } else {
      existing = memStore.reservations.filter(r => r.equipment_id === equipment_id && r.date === date);
    }

    // COLLISION & STERILIZATION BUFFER CHECK:
    // Any existing booking A occupies [A_start, A_end + A_buffer_minutes].
    // If the proposed slot [proposedStart, proposedTotalEnd] overlaps with ANY existing slot's total window:
    for (const resv of existing) {
      const exStart = toEpoch(resv.date, resv.start_time);
      const exEnd = toEpoch(resv.date, resv.end_time);
      const exBufferMs = (parseInt(resv.buffer_minutes) || 30) * 60 * 1000;
      const exTotalEnd = exEnd + exBufferMs;

      // Two intervals [A, B] and [C, D] overlap if max(A, C) < min(B, D)
      const hasConflict = Math.max(proposedStart, exStart) < Math.min(proposedTotalEnd, exTotalEnd);

      if (hasConflict) {
        // Distinguish between direct time collision and sterilization buffer collision
        const directCollision = Math.max(proposedStart, exStart) < Math.min(proposedEnd, exEnd);
        const bufferConflict = !directCollision;

        return res.status(409).json({
          error: bufferConflict
            ? `Collision: Proposed slot conflicts with sterilization & decontamination buffer period (${resv.buffer_minutes} mins) for reservation by ${resv.researcher_name} (${resv.start_time} - ${resv.end_time}).`
            : `Collision: Direct time conflict with existing reservation by ${resv.researcher_name} (${resv.start_time} - ${resv.end_time}).`,
          conflictingReservation: resv,
          isBufferCollision: bufferConflict
        });
      }
    }

    // If no collision, save reservation
    const newReservation = {
      id: `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      equipment_id,
      equipment_name: equipment_name || equipment_id,
      researcher_name,
      department: department || 'General Science',
      date,
      start_time,
      end_time,
      buffer_minutes: parseInt(buffer_minutes) || 30,
      purpose: purpose || 'Standard Experiment',
      status: 'Confirmed',
      created_at: new Date().toISOString()
    };

    if (useMongo && db) {
      await db.collection('reservations').insertOne(newReservation);
    } else {
      memStore.reservations.push(newReservation);
    }

    res.status(201).json({ success: true, reservation: newReservation });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/reservations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useMongo && db) {
      await db.collection('reservations').deleteOne({ id });
    } else {
      memStore.reservations = memStore.reservations.filter(r => r.id !== id);
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── AI-POWERED MAINTENANCE PREDICTOR ENDPOINT ────────────────────────────────
// Deterministic scientific health assessment heuristics fallback + LLM wrapper
function calculateEngineeringHealthScore(telemetry) {
  const {
    runtime_hours = 350,
    peak_temperature_c = 42,
    vibration_rms = 1.2,
    power_cycles = 120,
    thermal_stress_events = 2,
    last_service_days = 45,
    rpm = 0,
  } = telemetry;

  let score = 100;
  const issues = [];

  // Runtime degradation (nominal lifecycle ~ 1000 hrs)
  if (runtime_hours > 1500) {
    score -= 30;
    issues.push('High cumulative operational run-time exceeds 1,500 hours.');
  } else if (runtime_hours > 800) {
    score -= 15;
    issues.push('Moderate run-time wear detected (>800 hrs).');
  }

  // Thermal degradation (threshold ~ 65°C - 80°C)
  if (peak_temperature_c > 85) {
    score -= 35;
    issues.push(`Critical thermal peak detected: ${peak_temperature_c}°C (threshold: 75°C). Risk of component warping.`);
  } else if (peak_temperature_c > 70) {
    score -= 18;
    issues.push(`Elevated thermal peaks: ${peak_temperature_c}°C. Accelerated seal and thermal paste fatigue.`);
  }

  // Vibration degradation (ISO 10816 standards: <1.8 good, 1.8-4.5 alert, >4.5 danger)
  if (vibration_rms > 4.2) {
    score -= 35;
    issues.push(`Excessive mechanical vibration: ${vibration_rms} mm/s RMS. Imminent bearing or rotor cage degradation.`);
  } else if (vibration_rms > 2.5) {
    score -= 15;
    issues.push(`Mild mechanical vibration harmonic: ${vibration_rms} mm/s RMS.`);
  }

  // Thermal stress events
  if (thermal_stress_events > 5) {
    score -= 15;
    issues.push(`Multiple thermal cycle shocks (${thermal_stress_events} events). Micro-fracture propagation risk.`);
  }

  // Service interval
  if (last_service_days > 180) {
    score -= 20;
    issues.push(`Overdue maintenance inspection (${last_service_days} days since last calibration).`);
  } else if (last_service_days > 90) {
    score -= 10;
    issues.push(`Maintenance cycle approaching deadline (${last_service_days} days ago).`);
  }

  score = Math.max(5, Math.min(100, Math.round(score)));

  let riskLevel = 'Low';
  let daysUntilFailure = 180;
  if (score < 45) {
    riskLevel = 'Critical';
    daysUntilFailure = Math.max(2, Math.round((score / 45) * 7));
  } else if (score < 70) {
    riskLevel = 'Moderate';
    daysUntilFailure = Math.round(14 + ((score - 45) / 25) * 30);
  } else {
    riskLevel = 'Low';
    daysUntilFailure = Math.round(60 + ((score - 70) / 30) * 120);
  }

  return {
    score,
    riskLevel,
    daysUntilFailure,
    issues: issues.length ? issues : ['All telemetry metrics operate well within nominal tolerance limits.'],
    recommendations: score < 50
      ? [
          'Immediate shutdown & quarantine for deep bearing assembly overhaul.',
          'Flush coolant pathways and replenish vacuum seal grease.',
          'Schedule automated 60-minute autoclave sterilization before technician intervention.'
        ]
      : score < 75
      ? [
          'Schedule preventative recalibration and bearing lubrication within 14 days.',
          'Inspect cooling fan intake mesh for particle clogging.',
          'Ensure sterilization buffer is extended to 45 min after high-temperature runs.'
        ]
      : [
          'Continue routine operational usage schedule.',
          'Standard 30-minute sterilization buffer remains sufficient.',
          'Next periodic inspection scheduled in 90 days.'
        ]
  };
}

// Predict maintenance route
app.post('/api/ai/predict-maintenance', async (req, res) => {
  try {
    const { equipment_id, equipment_name, telemetry, apiKey, provider = 'heuristic' } = req.body;

    const defaultTelemetry = {
      runtime_hours: 420,
      peak_temperature_c: 68,
      vibration_rms: 2.1,
      power_cycles: 185,
      thermal_stress_events: 3,
      last_service_days: 62,
      rpm: 4500
    };

    const mergedTelemetry = { ...defaultTelemetry, ...(telemetry || {}) };
    const analysis = calculateEngineeringHealthScore(mergedTelemetry);

    // If user provided an OpenAI or Groq key or one is in .env, we can query the external LLM:
    const activeKey = apiKey || (provider === 'groq' ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY);

    if (activeKey && (provider === 'openai' || provider === 'groq')) {
      try {
        const endpoint = provider === 'groq'
          ? 'https://api.groq.com/openai/v1/chat/completions'
          : 'https://api.openai.com/v1/chat/completions';
        const model = provider === 'groq' ? 'llama-3.1-8b-instant' : 'gpt-4o-mini';

        const prompt = `You are a high-precision lab equipment predictive maintenance AI.
Analyze the following telemetry for equipment "${equipment_name || equipment_id}":
- Run Time: ${mergedTelemetry.runtime_hours} hrs
- Peak Operating Temp: ${mergedTelemetry.peak_temperature_c}°C
- Mechanical Vibration: ${mergedTelemetry.vibration_rms} mm/s RMS
- Power Cycles: ${mergedTelemetry.power_cycles}
- Thermal Stress Events: ${mergedTelemetry.thermal_stress_events}
- Days Since Last Service: ${mergedTelemetry.last_service_days} days

Return a strictly valid JSON response (no markdown fences, just pure json):
{
  "health_score": <number 0-100>,
  "risk_level": "<Low | Moderate | High | Critical>",
  "days_until_failure": <estimated integer days>,
  "primary_risk_factor": "<short sentence describing root cause>",
  "issues": ["<bullet 1>", "<bullet 2>"],
  "recommendations": ["<action 1>", "<action 2>", "<action 3>"]
}`;

        const apiRes = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeKey}`
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
            response_format: { type: 'json_object' }
          })
        });

        if (apiRes.ok) {
          const aiJson = await apiRes.json();
          const parsed = JSON.parse(aiJson.choices[0].message.content);
          return res.json({
            source: `LLM (${provider.toUpperCase()})`,
            health_score: parsed.health_score ?? analysis.score,
            risk_level: parsed.risk_level ?? analysis.riskLevel,
            days_until_failure: parsed.days_until_failure ?? analysis.daysUntilFailure,
            primary_risk_factor: parsed.primary_risk_factor || analysis.issues[0],
            issues: parsed.issues || analysis.issues,
            recommendations: parsed.recommendations || analysis.recommendations,
            telemetry: mergedTelemetry
          });
        }
      } catch (llmErr) {
        console.warn('External LLM call failed, falling back to engineering heuristics:', llmErr.message);
      }
    }

    // Default fast & reliable heuristic analysis
    res.json({
      source: 'Physics & Telemetry Engine (Instant)',
      health_score: analysis.score,
      risk_level: analysis.riskLevel,
      days_until_failure: analysis.daysUntilFailure,
      primary_risk_factor: analysis.issues[0],
      issues: analysis.issues,
      recommendations: analysis.recommendations,
      telemetry: mergedTelemetry
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Start server
initDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Lab Tracker Backend running at http://localhost:${PORT}`);
    console.log(`📡 Storage mode: ${useMongo ? 'MongoDB Atlas' : 'Resilient In-Memory Datastore'}`);
  });
});
