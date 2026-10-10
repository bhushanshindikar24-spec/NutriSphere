
export default function Input({ label, error, helperText, ...props }) {
  return (
    <div className="form-group" style={{ marginBottom: '1rem' }}>
      {label && <label className="form-label">{label}</label>}
      <input className="form-input" {...props} />
      {error && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{error}</span>}
      {helperText && !error && <span className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{helperText}</span>}
    </div>
  );
}
