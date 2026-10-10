import {  useContext  } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, LogOut, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import NotificationBell from '../notifications/NotificationBell';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      background: 'var(--bg-surface-glass)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.75rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <HeartPulse size={24} color="var(--primary)" />
        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>NutriSphere</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <NotificationBell />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <UserIcon size={18} color="var(--text-muted)" />
          <span style={{ fontWeight: 500 }}>{user?.firstName || 'User'}</span>
        </div>
        <button
          onClick={handleLogout}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
