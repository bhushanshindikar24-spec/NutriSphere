
export default function Select({ label, options = [], error, ...props }) {
  return (
    <div className="form-group" style={{ marginBottom: '1rem' }}>
      {label && <label className="form-label">{label}</label>}
      <select className="form-input" {...props}>
        {options.map((opt, i) => (
          <option key={i} value={typeof opt === 'object' ? opt.value : opt}>
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
      {error && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{error}</span>}
    </div>
  );
}
