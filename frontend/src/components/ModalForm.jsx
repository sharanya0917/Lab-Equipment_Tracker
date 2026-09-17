import { useState } from 'react';

export default function ModalForm({ title, fields, onSubmit, onClose }) {
  const initial = {};
  fields.forEach(f => {
    initial[f.name] = f.defaultValue ?? (f.type === 'select' ? f.options[0] : '');
  });
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  };

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try { await onSubmit(form); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            {fields.map(f => (
              <div key={f.name} className="form-group">
                <label htmlFor={f.name}>{f.label}</label>
                {f.type === 'select' ? (
                  <select id={f.name} name={f.name} value={form[f.name]} onChange={handleChange} className="form-control">
                    {f.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea id={f.name} name={f.name} value={form[f.name]} onChange={handleChange} className="form-control" rows={3} />
                ) : (
                  <input id={f.name} type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} className="form-control" placeholder={f.placeholder || ''} />
                )}
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
