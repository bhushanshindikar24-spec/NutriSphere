
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  if (items.length === 0) return null;
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
      {items.map((item, idx) => (
        <span key={idx}>
          {idx > 0 && <ChevronRight size={14} />}
          {item.path ? (
            <Link to={item.path} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{item.label}</Link>
          ) : (
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
