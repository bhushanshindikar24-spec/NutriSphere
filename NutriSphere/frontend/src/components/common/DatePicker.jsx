
export default function DatePicker({ label, value, onChange, ...props }) {
  return (
    <div className="form-group" style={{ marginBottom: '1rem' }}>
      {label && <label className="form-label">{label}</label>}
      <input type="date" className="form-input" value={value} onChange={onChange} {...props} />
    </div>
  );
}
