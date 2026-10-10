
export default function Radio({ label, name, value, checked, onChange, disabled = false, id }) {
  const inputId = id || `${name}-${value}`;
  return (
    <label htmlFor={inputId} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '0.875rem' }}>
      <input id={inputId} type="radio" name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} />
      {label && <span>{label}</span>}
    </label>
  );
}
