
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Confirm Action', message = 'Are you sure you want to proceed?', confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p style={{ margin: '0 0 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <Button variant="outline" onClick={onClose}>{cancelText}</Button>
        <Button variant={isDanger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
      </div>
    </Modal>
  );
}
