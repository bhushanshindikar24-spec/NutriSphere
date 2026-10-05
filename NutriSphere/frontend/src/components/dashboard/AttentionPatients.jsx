
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AttentionPatients({ patients = [] }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
      <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <AlertCircle size={18} color="#EF4444" /> Patients Needing Review
      </h4>
      {patients.length === 0 ? (
        <p className="text-muted" style={{ fontSize: '0.875rem', margin: 0 }}>All assigned patients are currently adhering to diet plans.</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {patients.map((p, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>{p.name || p.patientName}</p>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Barrier: {p.barrier || p.issue || 'Low Adherence'}</span>
              </div>
              <Link to={`/dietitian/patients/${p.patientUserId || p.id || ''}`} style={{ color: 'var(--primary)', fontSize: '0.8125rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Review <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
