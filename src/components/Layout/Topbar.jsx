import { Sun, Moon, ChevronDown, User } from 'lucide-react';
import useStore from '../../store/useStore';
import './Topbar.css';

export default function Topbar({ title }) {
  const { role, setRole, darkMode, toggleDarkMode } = useStore();

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h2>{title}</h2>
      </div>

      <div className="topbar-actions">
        {/* Role Switcher */}
        <div className="role-switcher">
          <User size={14} />
          <select
            id="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="role-select"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
          <span className={`badge ${role === 'admin' ? 'badge-admin' : 'badge-viewer'}`}>
            {role === 'admin' ? 'Admin' : 'Viewer'}
          </span>
          <ChevronDown size={12} className="role-chevron" />
        </div>

        {/* Dark mode toggle */}
        <button
          id="dark-mode-toggle"
          className="btn btn-ghost btn-icon"
          onClick={toggleDarkMode}
          title="Toggle dark/light mode"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Avatar */}
        <div className="user-avatar" title={role === 'admin' ? 'Admin User' : 'Viewer'}>
          {role === 'admin' ? 'AD' : 'VW'}
        </div>
      </div>
    </header>
  );
}
