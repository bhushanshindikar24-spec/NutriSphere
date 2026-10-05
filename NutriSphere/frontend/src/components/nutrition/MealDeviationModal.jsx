import {  useState  } from "react";
import Modal from "../common/Modal";
import { BARRIER_TYPES } from "../../utils/constants";
import { capitalize } from "../../utils/formatters";
import { AlertTriangle } from "lucide-react";

export default function MealDeviationModal({ isOpen, onClose, onReport, mealName = "Planned Meal" }) {
  const [barrierType, setBarrierType] = useState("FOOD_UNAVAILABLE");
  const [notes, setNotes] = useState("");
  const [actualMealEaten, setActualMealEaten] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onReport({
      barrierType,
      notes,
      actualMealEaten,
      mealName,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Meal Deviation / Barrier">
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", marginBottom: "1.25rem", fontSize: "0.875rem" }}>
          <AlertTriangle size={20} />
          <span>Reporting adherence obstacles helps your Dietitian adapt future plans!</span>
        </div>

        <div className="form-group">
          <label className="form-label">Primary Barrier / Reason</label>
          <select
            className="form-input"
            value={barrierType}
            onChange={(e) => setBarrierType(e.target.value)}
          >
            {Object.keys(BARRIER_TYPES).map((key) => (
              <option key={key} value={key}>
                {capitalize(key)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">What did you eat instead?</label>
          <input
            type="text"
            className="form-input"
            value={actualMealEaten}
            onChange={(e) => setActualMealEaten(e.target.value)}
            placeholder="e.g. Scrambled eggs on toast"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Context / Additional Details</label>
          <textarea
            className="form-input"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Grocery store was out of salmon, or got home late from work."
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Submit Barrier Report
        </button>
      </form>
    </Modal>
  );
}
