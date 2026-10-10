
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search...", onSubmit, style = {} }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: "relative", width: "100%", ...style }}>
      <Search
        size={18}
        color="var(--text-muted)"
        style={{
          position: "absolute",
          left: "0.875rem",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
      <input
        type="text"
        className="form-input"
        style={{
          paddingLeft: "2.5rem",
          width: "100%",
          borderRadius: "var(--radius-md)",
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </form>
  );
}
