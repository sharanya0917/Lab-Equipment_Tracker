const API_BASE = '/api';

export async function request(path, { method = 'GET', body = null, query = {} } = {}) {
  const url = new URL(API_BASE + path, window.location.origin);
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.append(k, v);
  });

  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('lab_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const resp = await fetch(url, opts);
  if (!resp.ok) {
    let errMsg = `API error ${resp.status}`;
    try {
      const errJson = await resp.json();
      errMsg = errJson.error || errMsg;
    } catch {
      errMsg = await resp.text();
    }
    const err = new Error(errMsg);
    err.status = resp.status;
    throw err;
  }
  return resp.json();
}

export const api = {
  // Dashboard & Equipment
  getDashboard:        ()         => request('/dashboard'),
  getEquipment:        (params)   => request('/equipment', { query: params }),
  getEquipmentById:    (id)       => request(`/equipment/${id}`),
  addEquipment:        (data)     => request('/equipment', { method: 'POST', body: data }),
  updateEquipment:     (id, data) => request(`/equipment/${id}`, { method: 'PUT', body: data }),
  deleteEquipment:     (id)       => request(`/equipment/${id}`, { method: 'DELETE' }),
  issueItem:           (data)     => request('/issue', { method: 'POST', body: data }),
  returnItem:          (data)     => request('/return', { method: 'POST', body: data }),
  getMaintenance:      (id)       => request(`/maintenance/${id}`),
  addMaintenance:      (data)     => request('/maintenance', { method: 'POST', body: data }),
  deleteMaintenance:   (id)       => request(`/maintenance/${id}`, { method: 'DELETE' }),

  // Smart Reservations with Collision & Sterilization Buffer
  getReservations:     (params)   => request('/reservations', { query: params }),
  createReservation:   (data)     => request('/reservations', { method: 'POST', body: data }),
  deleteReservation:   (id)       => request(`/reservations/${id}`, { method: 'DELETE' }),

  // AI-Powered Maintenance Predictor
  predictMaintenance:  (data)     => request('/ai/predict-maintenance', { method: 'POST', body: data }),
};
