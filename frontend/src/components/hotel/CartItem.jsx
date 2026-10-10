
import { formatCurrency } from '../../utils/formatters';
import { Plus, Minus, Trash2 } from 'lucide-react';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
      <div>
        <h5 style={{ margin: 0, fontSize: '0.9375rem' }}>{item.mealName}</h5>
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{formatCurrency(item.price)} each � {item.calories || 0} kcal</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-color)', padding: '0.2rem 0.4rem', borderRadius: 'var(--radius-md)' }}>
          <button onClick={() => onUpdateQuantity(item.mealId, item.quantity - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}><Minus size={14} /></button>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, minWidth: '18px', textAlign: 'center' }}>{item.quantity}</span>
          <button onClick={() => onUpdateQuantity(item.mealId, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}><Plus size={14} /></button>
        </div>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', minWidth: '60px', textAlign: 'right' }}>{formatCurrency(item.price * item.quantity)}</span>
        <button onClick={() => onRemove(item.mealId)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.2rem' }}><Trash2 size={16} /></button>
      </div>
    </div>
  );
}
