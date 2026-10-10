import {  useState, useEffect  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../../services/api";

export default function EditDietPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    dailyCaloriesTarget: 2000,
    dailyProteinTarget: 130,
    dailyCarbsTarget: 210,
    dailyFatTarget: 65,
    dailyWaterTarget: 2500,
    notes: "",
    status: "ACTIVE",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get(`/nutrition/diet-plans/${id || 201}`);
        const plan = res.data?.data || res.data;
        if (plan) {
          setFormData({
            name: plan.name || "",
            dailyCaloriesTarget: plan.dailyCaloriesTarget || 2000,
            dailyProteinTarget: plan.dailyProteinTarget || 130,
            dailyCarbsTarget: plan.dailyCarbsTarget || 210,
            dailyFatTarget: plan.dailyFatTarget || 65,
            dailyWaterTarget: plan.dailyWaterTarget || 2500,
            notes: plan.notes || "",
            status: plan.status || "ACTIVE",
          });
        }
      } catch (_err) {
        setFormData({
          name: "Phase 2 Mediterranean Fat-Loss",
          dailyCaloriesTarget: 1950,
          dailyProteinTarget: 140,
          dailyCarbsTarget: 180,
          dailyFatTarget: 65,
          dailyWaterTarget: 2500,
          notes: "Anti-inflammatory emphasis with low glycemic carbs.",
          status: "ACTIVE",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/nutrition/diet-plans/${id || 201}`, formData);
      navigate(`/dietitian/plans/${id || 201}`);
    } catch (err) {
      console.error("Failed to update plan", err);
      navigate(`/dietitian/plans/${id || 201}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading Diet Plan...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline"
        style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h2>Edit Diet Plan</h2>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.25rem" }}>
          <div>
            <label className="form-label">Plan Title</label>
            <input
              type="text"
              className="input-field"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
            <div>
              <label className="form-label">Calories (kcal)</label>
              <input
                type="number"
                className="input-field"
                required
                value={formData.dailyCaloriesTarget}
                onChange={(e) => setFormData({ ...formData, dailyCaloriesTarget: Number(e.target.value) })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Protein (g)</label>
              <input
                type="number"
                className="input-field"
                required
                value={formData.dailyProteinTarget}
                onChange={(e) => setFormData({ ...formData, dailyProteinTarget: Number(e.target.value) })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Carbs (g)</label>
              <input
                type="number"
                className="input-field"
                required
                value={formData.dailyCarbsTarget}
                onChange={(e) => setFormData({ ...formData, dailyCarbsTarget: Number(e.target.value) })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Fat (g)</label>
              <input
                type="number"
                className="input-field"
                required
                value={formData.dailyFatTarget}
                onChange={(e) => setFormData({ ...formData, dailyFatTarget: Number(e.target.value) })}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Plan Status</label>
            <select
              className="input-field"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{ width: "100%" }}
            >
              <option value="ACTIVE">Active</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="DRAFT">Draft</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="form-label">Clinical Notes</label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} style={{ marginRight: "0.4rem" }} />
              {saving ? "Saving Changes..." : "Save Plan Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
