
import Modal from '../common/Modal';
import { formatCurrency } from '../../utils/formatters';
import Badge from '../common/Badge';

export default function MealDetails({ meal, isOpen, onClose, onAddToCart }) {
  if (!meal) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={meal.name}>
      {meal.imageUrl && <img src={meal.imageUrl} alt={meal.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <Badge variant="neutral">{meal.category || 'Nutritional Meal'}</Badge>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(meal.price)}</span>
      </div>
      <p className="text-muted" style={{ fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>{meal.description}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', background: 'var(--bg-color)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '1.5rem' }}>
        <div><span className="text-muted" style={{ fontSize: '0.7rem' }}>Calories</span><p style={{ margin: 0, fontWeight: 700 }}>{meal.calories || 0}</p></div>
        <div><span className="text-muted" style={{ fontSize: '0.7rem' }}>Protein</span><p style={{ margin: 0, fontWeight: 700 }}>{meal.proteinG || 0}g</p></div>
        <div><span className="text-muted" style={{ fontSize: '0.7rem' }}>Carbs</span><p style={{ margin: 0, fontWeight: 700 }}>{meal.carbsG || 0}g</p></div>
        <div><span className="text-muted" style={{ fontSize: '0.7rem' }}>Fat</span><p style={{ margin: 0, fontWeight: 700 }}>{meal.fatG || 0}g</p></div>
      </div>
      <button onClick={() => { onAddToCart(meal); onClose(); }} className="btn btn-primary btn-block">
        Add to Order ({formatCurrency(meal.price)})
      </button>
    </Modal>
  );
}
