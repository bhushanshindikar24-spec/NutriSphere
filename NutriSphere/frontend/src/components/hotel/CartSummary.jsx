
import { formatCurrency } from '../../utils/formatters';
import { ShoppingBag } from 'lucide-react';

export default function CartSummary({ totalAmount = 0, totalCalories = 0, itemCount = 0, onCheckout }) {
  const deliveryFee = totalAmount > 0 ? 3.50 : 0;
  const grandTotal = totalAmount + deliveryFee;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
      <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShoppingBag size={18} color="var(--primary)" /> Order Summary
      </h4>

      <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="text-muted">Meals Subtotal ({itemCount} items)</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="text-muted">Total Calories</span>
          <span>{Math.round(totalCalories)} kcal</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="text-muted">Clinical Packaging & Delivery</span>
          <span>{formatCurrency(deliveryFee)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.125rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
          <span>Total</span>
          <span style={{ color: 'var(--primary)' }}>{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      <button onClick={onCheckout} disabled={itemCount === 0} className="btn btn-primary btn-block">
        Proceed to Checkout
      </button>
    </div>
  );
}
