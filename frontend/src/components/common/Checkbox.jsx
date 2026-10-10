
export default function Checkbox({ label, checked, onChange, disabled = false, id }) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <label htmlFor={inputId} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '0.875rem' }}>
      <input id={inputId} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} />
      {label && <span>{label}</span>}
    </label>
  );
}
