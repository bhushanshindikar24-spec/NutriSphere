import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ links = [] }) {
  const location = useLocation();

  return (
    <aside style={{
      width: '240px',
      borderRight: '1px solid var(--border-color)',
      background: 'var(--bg-surface)',
      padding: '1.5rem 1rem',
      height: '100%',
    }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <li key={link.path} style={{ marginBottom: '0.4rem' }}>
              <Link
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                }}
              >
                {link.icon}
                {link.label || link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
