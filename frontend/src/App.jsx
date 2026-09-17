import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EquipmentList from './pages/EquipmentList';
import EquipmentDetail from './pages/EquipmentDetail';
import MaintenancePredictor from './pages/MaintenancePredictor';
import DigitalTwin from './pages/DigitalTwin';
import Reservations from './pages/Reservations';
import AuthCallback from './pages/AuthCallback';
import Login from './pages/Login';

function handleLogout() {
  localStorage.removeItem('lab_token');
  localStorage.removeItem('lab_user');
  window.location.href = '/login';
}

function AuthControls() {
  const token = localStorage.getItem('lab_token');
  if (token) {
    return (
      <div className="auth-controls">
        <button onClick={handleLogout} className="btn-ghost">Sign out</button>
      </div>
    );
  }
  return (
    <div className="auth-controls">
      <NavLink to="/login" className="btn-primary">Sign in</NavLink>
    </div>
  );
}

function BottomTabBar() {
  const location = useLocation();
  const isLogin = location.pathname === '/login' || location.pathname === '/' || location.pathname === '/auth';
  if (isLogin) return null;

  const tabs = [
    { to: '/dashboard',            icon: '📊', label: 'Dashboard',  end: true },
    { to: '/equipment',            icon: '🧪', label: 'Equipment'              },
    { to: '/reservations',         icon: '📅', label: 'Reserve'                },
    { to: '/maintenance-predictor',icon: '🤖', label: 'AI Health'              },
    { to: '/digital-twin',         icon: '🎛️', label: 'Twin'                   },
  ];

  return (
    <nav className="bottom-tab-bar" role="navigation" aria-label="Mobile navigation">
      {tabs.map(tab => {
        const isActive = tab.end
          ? location.pathname === tab.to
          : location.pathname.startsWith(tab.to);
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={'tab-item' + (isActive ? ' active' : '')}
            aria-label={tab.label}
          >
            <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default function App() {
  function RequireAuth({ children }) {
    const token = localStorage.getItem('lab_token');
    const location = useLocation();
    if (!token) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return children;
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🔬</div>
          <div>
            <h1 className="logo-title">Lab Tracker</h1>
            <span className="logo-subtitle">AI & Digital Twin Suite</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">MANAGEMENT</div>
          <div className="nav-tooltip-wrap">
            <NavLink to="/dashboard" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </NavLink>
            <span className="tooltip-text">Dashboard</span>
          </div>
          <div className="nav-tooltip-wrap">
            <NavLink to="/equipment" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <span className="nav-icon">🧪</span>
              <span>Equipment</span>
            </NavLink>
            <span className="tooltip-text">Equipment</span>
          </div>
          <div className="nav-tooltip-wrap">
            <NavLink to="/reservations" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <span className="nav-icon">📅</span>
              <span>Reservations</span>
              <span className="nav-badge">Buffer Shield</span>
            </NavLink>
            <span className="tooltip-text">Reservations</span>
          </div>

          <div className="nav-section-title mt-3">INTELLIGENCE & SIMULATION</div>
          <div className="nav-tooltip-wrap">
            <NavLink to="/maintenance-predictor" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <span className="nav-icon">🤖</span>
              <span>AI Predictor</span>
              <span className="nav-badge pulse">AI ML</span>
            </NavLink>
            <span className="tooltip-text">AI Predictor</span>
          </div>
          <div className="nav-tooltip-wrap">
            <NavLink to="/digital-twin" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <span className="nav-icon">🎛️</span>
              <span>Digital Twin</span>
              <span className="nav-badge live">Live 3D</span>
            </NavLink>
            <span className="tooltip-text">Digital Twin</span>
          </div>
        </nav>

        {/* Sidebar System Status Pill */}
        <div className="sidebar-footer">
          <div className="system-health-pill">
            <span className="health-dot live"></span>
            <div>
              <div className="text-xs font-semibold">Telemetry Feed</div>
              <div className="text-muted text-xxs">Real-time Node 5000</div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <AuthControls />
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/auth" element={<AuthCallback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/equipment" element={<RequireAuth><EquipmentList /></RequireAuth>} />
          <Route path="/equipment/:id" element={<RequireAuth><EquipmentDetail /></RequireAuth>} />
          <Route path="/maintenance-predictor" element={<RequireAuth><MaintenancePredictor /></RequireAuth>} />
          <Route path="/digital-twin" element={<RequireAuth><DigitalTwin /></RequireAuth>} />
          <Route path="/reservations" element={<RequireAuth><Reservations /></RequireAuth>} />
        </Routes>
      </main>

      {/* ── Mobile Bottom Tab Bar ── */}
      <BottomTabBar />
    </div>
  );
}
