
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon, title = 'No Data', message = 'There is currently no information to display.', action }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{icon || <Inbox size={48} />}</div>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem' }}>{title}</h3>
      <p className="text-muted" style={{ margin: '0 0 1.5rem', fontSize: '0.875rem', maxWidth: '400px' }}>{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
