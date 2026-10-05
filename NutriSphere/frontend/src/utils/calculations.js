export const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

export const getBMICategory = (bmi) => {
  if (!bmi) return "Unknown";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 24.9) return "Normal weight";
  if (bmi < 29.9) return "Overweight";
  return "Obese";
};

export const calculateBMR = (gender, weightKg, heightCm, age) => {
  if (!weightKg || !heightCm || !age) return 2000;
  // Mifflin-St Jeor Equation
  if (gender === "MALE") {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  } else {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
};

export const calculateTDEE = (bmr, activityLevel) => {
  const multipliers = {
    SEDENTARY: 1.2,
    LIGHTLY_ACTIVE: 1.375,
    MODERATELY_ACTIVE: 1.55,
    VERY_ACTIVE: 1.725,
    EXTRA_ACTIVE: 1.9,
  };
  const mult = multipliers[activityLevel] || 1.375;
  return Math.round(bmr * mult);
};

export const calculateAdherence = (actualCalories, targetCalories) => {
  if (!targetCalories || targetCalories === 0) return 0;
  const ratio = (actualCalories / targetCalories) * 100;
  if (ratio > 100) {
    return Math.max(0, Math.round(100 - (ratio - 100)));
  }
  return Math.round(ratio);
};
