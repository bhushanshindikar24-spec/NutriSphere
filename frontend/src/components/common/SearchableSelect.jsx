import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function SearchableSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select or search...",
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const containerRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes((searchTerm || "").toLowerCase().trim())
  );

  const handleInputChange = (e) => {
    const text = e.target.value;
    setSearchTerm(text);
    onChange(text);
    setIsOpen(true);
  };

  const handleSelectOption = (opt) => {
    setSearchTerm(opt);
    onChange(opt);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {label && <label className="form-label">{label}</label>}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          type="text"
          className="form-input"
          style={{ width: "100%", paddingRight: "2.25rem" }}
          required={required}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: "absolute",
            right: "0.6rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            padding: "0.2rem",
          }}
          tabIndex={-1}
        >
          <ChevronDown
            size={16}
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            maxHeight: "220px",
            overflowY: "auto",
            background: "#ffffff",
            border: "1px solid #cbd5e1",
            borderRadius: "10px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
            zIndex: 100,
            padding: "0.25rem 0",
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "0.75rem 1rem",
                fontSize: "0.82rem",
                color: "#64748b",
                fontStyle: "italic",
              }}
            >
              No exact match. Your custom entry will be used.
            </div>
          ) : (
            filtered.map((opt) => {
              const isSelected = opt.toLowerCase() === (searchTerm || "").toLowerCase().trim();
              return (
                <div
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  onMouseDown={(e) => e.preventDefault()}
                  style={{
                    padding: "0.6rem 1rem",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: isSelected ? "#f0f9ff" : "transparent",
                    color: isSelected ? "#0284c7" : "#1e293b",
                    fontWeight: isSelected ? 700 : 400,
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span>{opt}</span>
                  {isSelected && <Check size={14} color="#0284c7" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
