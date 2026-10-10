
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page = 0, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
      <button
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        style={{ padding: '0.4rem 0.6rem', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.5 : 1 }}
      >
        <ChevronLeft size={16} />
      </button>
      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Page {page + 1} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        style={{ padding: '0.4rem 0.6rem', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page >= totalPages - 1 ? 0.5 : 1 }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
