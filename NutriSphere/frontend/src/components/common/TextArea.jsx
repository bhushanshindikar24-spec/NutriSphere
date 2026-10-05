
export default function TextArea({ label, error, rows = 3, ...props }) {
  return (
    <div className="form-group" style={{ marginBottom: '1rem' }}>
      {label && <label className="form-label">{label}</label>}
      <textarea className="form-input" rows={rows} {...props} />
      {error && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{error}</span>}
    </div>
  );
}
