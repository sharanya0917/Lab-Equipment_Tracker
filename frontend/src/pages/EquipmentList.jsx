import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ModalForm from '../components/ModalForm';
import EquipmentCard from '../components/EquipmentCard';

const STATUS_MAP = {
  'Available':         'available',
  'In-Use':            'in-use',
  'Missing':           'missing',
  'Under Maintenance': 'maintenance',
};

function StatusChip({ status }) {
  return <span className={`chip ${STATUS_MAP[status] || ''}`}>{status}</span>;
}

const CATEGORY_META = {
  'Instruments': { emoji: '⚗️', title: 'Laboratory Instruments', color: '#1F4E79' },
  'Electronics': { emoji: '🔌', title: 'Electronic & Power Equipment', color: '#EA580C' },
  'Glassware':   { emoji: '🧪', title: 'Glassware & Consumables', color: '#16A34A' },
  'Other':       { emoji: '🔬', title: 'Other Lab Equipment', color: '#475569' },
};

const ADD_FIELDS = [
  { name: 'equipment_id', label: 'Equipment ID', type: 'text', placeholder: 'e.g. EQ-016' },
  { name: 'name',         label: 'Name',         type: 'text', placeholder: 'e.g. Centrifuge' },
  { name: 'category',     label: 'Category',     type: 'select', options: ['Instruments','Electronics','Glassware','Other'] },
  { name: 'location',     label: 'Location',     type: 'text', placeholder: 'e.g. Lab A' },
  { name: 'purchase_date',label: 'Purchase Date',type: 'date' },
  { name: 'status',       label: 'Status',       type: 'select', options: ['Available','In-Use','Missing','Under Maintenance'] },
];

export default function EquipmentList() {
  const [equipment, setEquipment]   = useState([]);
  const [filters, setFilters]       = useState({ search: '', status: '' });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAdd, setShowAdd]       = useState(false);
  const [showEdit, setShowEdit]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [viewMode, setViewMode]     = useState('grid'); // 'grid' | 'table'

  const load = () => {
    setLoading(true);
    api.getEquipment(filters)
      .then(setEquipment)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filters]);

  const handleAdd = async data => {
    await api.addEquipment(data);
    setShowAdd(false);
    load();
  };

  const handleEdit = async data => {
    await api.updateEquipment(showEdit.equipment_id, data);
    setShowEdit(null);
    load();
  };

  const handleDelete = async id => {
    if (!confirm(`Delete equipment ${id}?`)) return;
    await api.deleteEquipment(id);
    load();
  };

  const editFields = showEdit
    ? ADD_FIELDS.map(f => ({ ...f, defaultValue: showEdit[f.name] ?? '' }))
    : ADD_FIELDS;

  // Filter by category
  const filteredEquipment = selectedCategory === 'All'
    ? equipment
    : equipment.filter(eq => eq.category === selectedCategory);

  // Group items by category for structured visual display
  const categoriesPresent = selectedCategory === 'All'
    ? ['Instruments', 'Electronics', 'Glassware', 'Other'].filter(cat =>
        equipment.some(eq => eq.category === cat)
      )
    : [selectedCategory];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Equipment Catalog</h2>
          <p className="text-muted">{filteredEquipment.length} items organized by category</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Equipment</button>
      </div>

      {/* Category Navigation Bar */}
      <div className="category-nav-bar" style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '0.75rem'
      }}>
        {['All', 'Instruments', 'Electronics', 'Glassware'].map(cat => {
          const count = cat === 'All'
            ? equipment.length
            : equipment.filter(e => e.category === cat).length;
          const meta = CATEGORY_META[cat] || { emoji: '🔬' };
          const isActive = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn"
              style={{
                background: isActive ? 'var(--primary)' : 'var(--surface)',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: '9999px',
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                boxShadow: isActive ? '0 4px 12px rgba(31, 78, 121, 0.2)' : 'none',
                transition: 'var(--transition)'
              }}
            >
              <span>{cat === 'All' ? '🗂️ All Categories' : `${meta.emoji} ${cat}`}</span>
              <span style={{
                background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--surface-2)',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                marginLeft: '0.4rem'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="toolbar" style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          className="search-input"
          placeholder="🔍  Search by name or ID…"
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        />
        <select
          className="filter-select"
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
        >
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="In-Use">In‑Use</option>
          <option value="Missing">Missing</option>
          <option value="Under Maintenance">Under Maintenance</option>
        </select>

        {/* View mode toggle */}
        <div className="view-toggle">
          <button
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => setViewMode('grid')}
            title="Card view"
          >⊞</button>
          <button
            className={viewMode === 'table' ? 'active' : ''}
            onClick={() => setViewMode('table')}
            title="Table view"
          >☰</button>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <p className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>Loading equipment catalog…</p>
      ) : filteredEquipment.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧪</div>
          <p>No equipment found in this category.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {categoriesPresent.map(categoryName => {
            const categoryItems = filteredEquipment.filter(eq => eq.category === categoryName);
            if (categoryItems.length === 0) return null;

            const meta = CATEGORY_META[categoryName] || { emoji: '🔬', title: categoryName, color: 'var(--primary)' };

            return (
              <div key={categoryName}>
                {/* Category Section Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',

                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                  borderBottom: `2px solid ${meta.color}30`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{
                      fontSize: '1.4rem',
                      background: `${meta.color}15`,
                      padding: '0.3rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${meta.color}30`
                    }}>
                      {meta.emoji}
                    </span>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: meta.color, margin: 0, lineHeight: 1.2 }}>
                        {meta.title}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {categoryItems.length} equipment item{categoryItems.length > 1 ? 's' : ''} registered
                      </span>
                    </div>
                  </div>

                  <span className="chip" style={{ background: `${meta.color}15`, color: meta.color, borderColor: `${meta.color}40`, fontWeight: 700 }}>
                    Category: {categoryName}
                  </span>
                </div>

                {/* Grid or Table for Category */}
                {viewMode === 'grid' ? (
                  <div className="eq-cards-grid">
                    {categoryItems.map(eq => (
                      <div key={eq.equipment_id} style={{ position: 'relative' }}>
                        <EquipmentCard eq={eq} />
                        {/* Edit / Delete actions */}
                        <div style={{ display: 'flex', gap: '0.4rem', padding: '0 1rem 0.75rem', marginTop: '-0.5rem' }}>
                          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setShowEdit(eq)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(eq.equipment_id)}>🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th><th>Name</th><th>Category</th><th>Location</th><th>Purchase Date</th><th>Status</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryItems.map(eq => (
                          <tr key={eq.equipment_id}>
                            <td data-label="ID" style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>{eq.equipment_id}</td>
                            <td data-label="Name" style={{ fontWeight: 600 }}>
                              <Link to={`/equipment/${eq.equipment_id}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>
                                {eq.name}
                              </Link>
                            </td>
                            <td data-label="Category" className="text-muted">{eq.category}</td>
                            <td data-label="Location" className="text-muted">{eq.location}</td>
                            <td data-label="Purchased" className="text-muted">{eq.purchase_date}</td>
                            <td data-label="Status"><StatusChip status={eq.status} /></td>
                            <td>
                              <div className="flex">
                                <Link to={`/equipment/${eq.equipment_id}`} className="btn btn-ghost btn-sm">View</Link>
                                <button className="btn btn-ghost btn-sm" onClick={() => setShowEdit(eq)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(eq.equipment_id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <ModalForm title="Add Equipment" fields={ADD_FIELDS} onSubmit={handleAdd} onClose={() => setShowAdd(false)} />
      )}

      {/* Edit Modal */}
      {showEdit && (
        <ModalForm title={`Edit – ${showEdit.name}`} fields={editFields} onSubmit={handleEdit} onClose={() => setShowEdit(null)} />
      )}
    </div>
  );
}
