
import { CheckCircle2, Clock, Truck, Check } from 'lucide-react';

export default function OrderTimeline({ currentStatus = 'PENDING' }) {
  const steps = [
    { key: 'PENDING', label: 'Order Received', icon: <Clock size={16} /> },
    { key: 'PREPARING', label: 'Kitchen Preparing', icon: <CheckCircle2 size={16} /> },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: <Truck size={16} /> },
    { key: 'DELIVERED', label: 'Delivered', icon: <Check size={16} /> },
  ];

  const getStepIndex = (st) => steps.findIndex(s => s.key === st);
  const currentIdx = getStepIndex(currentStatus);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', position: 'relative' }}>
      {steps.map((step, idx) => {
        const isDone = currentIdx >= idx;
        const isCurrent = currentIdx === idx;
        return (
          <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', zIndex: 2 }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: isDone ? 'var(--primary)' : 'var(--bg-color)',
              color: isDone ? '#fff' : 'var(--text-muted)',
              border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {step.icon}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: isCurrent ? 700 : 500, color: isDone ? 'var(--text-main)' : 'var(--text-muted)', textAlign: 'center' }}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
