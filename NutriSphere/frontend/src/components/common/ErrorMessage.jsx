
import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginBottom: '1rem' }}>
      <AlertCircle size={18} />
      <span>{message}</span>
    </div>
  );
}
