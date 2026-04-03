import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, ChevronDown, User, Shield, Eye } from 'lucide-react';
import useStore from '../../store/useStore';
import './Topbar.css';

export default function Topbar({ title }) {
  const { role, setRole, darkMode, toggleDarkMode } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setIsOpen(false);
  };

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h2>{title}</h2>
      </div>

      <div className="topbar-actions">
        {/* Role Switcher */}
        <div className="role-switcher-container" ref={dropdownRef}>
          <button 
            className={`role-switcher-trigger ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <div className="role-icon-wrapper">
              {role === 'admin' ? <Shield size={14} /> : <Eye size={14} />}
            </div>
            <span className="role-label">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
            <ChevronDown size={14} className={`role-chevron ${isOpen ? 'rotate' : ''}`} />
          </button>

          {isOpen && (
            <div className="role-dropdown-menu">
              <div 
                className={`role-dropdown-item ${role === 'viewer' ? 'selected' : ''}`}
                onClick={() => handleRoleChange('viewer')}
              >
                <Eye size={14} />
                <span>Viewer</span>
                {role === 'viewer' && <div className="selection-dot" />}
              </div>
              <div 
                className={`role-dropdown-item ${role === 'admin' ? 'selected' : ''}`}
                onClick={() => handleRoleChange('admin')}
              >
                <Shield size={14} />
                <span>Admin</span>
                {role === 'admin' && <div className="selection-dot" />}
              </div>
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <button
          id="dark-mode-toggle"
          className="theme-toggle-btn"
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <div className="theme-icon-container">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </div>
        </button>

        {/* Avatar Area */}
        <div className="user-profile-section">
          <div className="user-avatar-premium" title={role === 'admin' ? 'Admin User' : 'Viewer'}>
            <span className="avatar-text">{role === 'admin' ? 'AD' : 'VW'}</span>
            <div className="status-indicator"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
