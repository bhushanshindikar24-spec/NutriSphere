
export default function MenuFilters({ search, onSearchChange, category, onCategoryChange, categories = [] }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
      <input
        type="text"
        className="form-input"
        placeholder="Search meals..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ flex: 1, minWidth: '200px' }}
      />
      <select className="form-input" value={category} onChange={(e) => onCategoryChange(e.target.value)} style={{ width: '180px' }}>
        <option value="">All Categories</option>
        {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
      </select>
    </div>
  );
}
