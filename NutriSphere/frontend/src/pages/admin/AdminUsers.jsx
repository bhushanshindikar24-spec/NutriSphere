import { useState, useEffect } from "react";
import { Users, Shield, CheckCircle, Clock, AlertTriangle, Search } from "lucide-react";
import api from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/users");
        const list = res.data?.data || res.data || [];
        setUsers(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="loading-screen">Loading Platform User Directory...</div>;

  const filtered = users.filter((u) => {
    const matchesRole = filterRole === "ALL" || u.role === filterRole;
    const matchesSearch =
      !search ||
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div style={{ background: "rgba(56, 189, 248, 0.15)", padding: "0.5rem", borderRadius: "10px", color: "#38bdf8" }}>
            <Users size={24} />
          </div>
          <h2 style={{ margin: 0 }}>Platform Users & Access Management</h2>
        </div>
        <p className="text-muted" style={{ margin: 0 }}>
          Comprehensive registry of all clinical providers, patients, culinary staff, and administrative accounts.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255, 255, 255, 0.04)", padding: "0.5rem 1rem", borderRadius: "8px", flex: "1 1 300px" }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: "transparent", border: "none", color: "#fff", width: "100%", outline: "none", fontSize: "0.9rem" }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["ALL", "DOCTOR", "DIETITIAN", "PATIENT", "HOTEL", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={filterRole === r ? "btn btn-primary" : "btn btn-outline"}
              style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase" }}>
              <th style={{ padding: "0.75rem 1rem" }}>User</th>
              <th style={{ padding: "0.75rem 1rem" }}>Role</th>
              <th style={{ padding: "0.75rem 1rem" }}>Account Status</th>
              <th style={{ padding: "0.75rem 1rem" }}>Email Verified</th>
              <th style={{ padding: "0.75rem 1rem" }}>Registered</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                <td style={{ padding: "1rem" }}>
                  <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{u.email}</div>
                </td>
                <td style={{ padding: "1rem" }}>
                  <span
                    style={{
                      background:
                        u.role === "DOCTOR"
                          ? "rgba(16, 185, 129, 0.15)"
                          : u.role === "DIETITIAN"
                          ? "rgba(56, 189, 248, 0.15)"
                          : u.role === "ADMIN"
                          ? "rgba(245, 158, 11, 0.15)"
                          : u.role === "HOTEL"
                          ? "rgba(244, 63, 94, 0.15)"
                          : "rgba(255, 255, 255, 0.05)",
                      color:
                        u.role === "DOCTOR"
                          ? "var(--primary)"
                          : u.role === "DIETITIAN"
                          ? "#38bdf8"
                          : u.role === "ADMIN"
                          ? "var(--accent)"
                          : u.role === "HOTEL"
                          ? "#f43f5e"
                          : "#cbd5e1",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>
                  <span
                    style={{
                      color: u.status === "ACTIVE" ? "var(--primary)" : u.status === "PENDING" ? "var(--accent)" : "#ef4444",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    {u.status === "ACTIVE" ? <CheckCircle size={14} /> : u.status === "PENDING" ? <Clock size={14} /> : <AlertTriangle size={14} />}
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>
                  {u.emailVerified ? (
                    <span style={{ color: "var(--primary)" }}>Verified</span>
                  ) : (
                    <span style={{ color: "var(--text-muted)" }}>Unverified</span>
                  )}
                </td>
                <td style={{ padding: "1rem", color: "var(--text-muted)" }}>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Active"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
