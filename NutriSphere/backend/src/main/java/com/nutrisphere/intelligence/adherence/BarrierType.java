package com.nutrisphere.intelligence.adherence;
public enum BarrierType {
    FOOD_UNAVAILABLE("Food Unavailable"),
    TOO_EXPENSIVE("Too Expensive"),
    TASTE("Didn'\''t Like Taste"),
    EATING_OUTSIDE("Eating Outside"),
    BUSY_SCHEDULE("Busy Schedule"),
    FORGOT("Forgot"),
    NOT_HUNGRY("Not Hungry"),
    COOKING_PROBLEM("Cooking Problem"),
    OTHER("Other");
    private final String label;
    BarrierType(String label) { this.label = label; }
    public String getLabel() { return label; }
}
