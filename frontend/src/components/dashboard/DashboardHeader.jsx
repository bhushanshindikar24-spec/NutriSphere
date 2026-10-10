
export default function DashboardHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '1.75rem' }}>{title}</h2>
        {subtitle && <p className="text-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.875rem' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
