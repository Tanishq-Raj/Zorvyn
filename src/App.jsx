import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import useStore from './store/useStore';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import MeshBackground from './components/MeshBackground/MeshBackground';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/insights': 'Insights',
};

export default function App() {
  const { darkMode } = useStore();
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'FinFlow';

  useEffect(() => {
    document.documentElement.className = darkMode ? '' : 'light';
  }, [darkMode]);

  return (
    <div className="app-layout">
      <MeshBackground />
      <Sidebar />
      <div className="main-content">
        <Topbar title={title} />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
