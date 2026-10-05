
import CalorieBudgetBar from "./CalorieBudgetBar";
import MacroBreakdown from "./MacroBreakdown";

export default function NutritionSummary({
  actualCalories = 0,
  targetCalories = 2000,
  carbs = 0,
  carbsTarget = 250,
  protein = 0,
  proteinTarget = 100,
  fat = 0,
  fatTarget = 65,
}) {
  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <CalorieBudgetBar consumed={actualCalories} target={targetCalories} />
      <MacroBreakdown
        carbs={carbs}
        carbsTarget={carbsTarget}
        protein={protein}
        proteinTarget={proteinTarget}
        fat={fat}
        fatTarget={fatTarget}
      />
    </div>
  );
}
