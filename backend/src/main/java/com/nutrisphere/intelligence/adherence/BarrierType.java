package com.nutrisphere.intelligence.adherence;

public enum BarrierType {
    TIME_CONSTRAINT("Time Constraint"),
    COST("Cost / Affordability"),
    FOOD_UNAVAILABLE("Food Unavailable"),
    SOCIAL_EVENT("Social Event"),
    CRAVINGS_HUNGER("Cravings / Satiety Deficit"),
    COOKING_SKILL("Cooking Skill / Complexity"),
    DIGESTIVE_DISCOMFORT("Digestive Discomfort"),
    
    // Legacy / Aliases
    TOO_EXPENSIVE("Cost / Affordability"),
    BUSY_SCHEDULE("Time Constraint"),
    COOKING_PROBLEM("Cooking Skill / Complexity"),
    EATING_OUTSIDE("Social Event"),
    TASTE("Taste / Cravings"),
    FORGOT("Schedule / Forgot"),
    NOT_HUNGRY("Satiety / Not Hungry"),
    OTHER("Other");

    private final String label;
    BarrierType(String label) { this.label = label; }
    public String getLabel() { return label; }

    public static BarrierType fromString(String val) {
        if (val == null) return OTHER;
        String normalized = val.trim().toUpperCase().replace(" ", "_").replace("-", "_");
        for (BarrierType b : values()) {
            if (b.name().equals(normalized)) return b;
        }
        if (normalized.contains("TIME") || normalized.contains("BUSY") || normalized.contains("SCHEDULE")) return TIME_CONSTRAINT;
        if (normalized.contains("COST") || normalized.contains("EXPENSIVE") || normalized.contains("MONEY")) return COST;
        if (normalized.contains("UNAVAILABLE") || normalized.contains("STOCK") || normalized.contains("INGREDIENT")) return FOOD_UNAVAILABLE;
        if (normalized.contains("SOCIAL") || normalized.contains("PARTY") || normalized.contains("OUTSIDE")) return SOCIAL_EVENT;
        if (normalized.contains("CRAVING") || normalized.contains("HUNGER") || normalized.contains("TASTE")) return CRAVINGS_HUNGER;
        if (normalized.contains("COOK") || normalized.contains("SKILL") || normalized.contains("RECIPE")) return COOKING_SKILL;
        if (normalized.contains("DIGEST") || normalized.contains("BLOAT") || normalized.contains("REFLUX") || normalized.contains("STOMACH")) return DIGESTIVE_DISCOMFORT;
        return OTHER;
    }
}
