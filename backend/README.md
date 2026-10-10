# NutriSphere Backend

Personalized Clinical Nutrition and Dietary Intelligence Platform Backend, built with Spring Boot 3.3.4, Java 17, Spring Security 6 with JWT, Spring Data JPA, Flyway, and MySQL.

## Key Modules
- **Authentication & Security**: Role-based access control (DOCTOR, DIETITIAN, PATIENT, HOTEL), JWT stateless authentication.
- **Clinical Data Isolation**: Strict separation of diagnostic clinical data, accessible to Doctors and authorized patients, while preserving privacy in nutrition workflows.
- **Five Intelligence Systems**:
  1. **Reality Score Engine**: Multidimensional adherence score (food availability, affordability, cooking complexity, taste preferences, busy schedule).
  2. **Adaptive Diet Engine**: Automated meal alternatives and caloric adjustments based on reported barriers.
  3. **Adherence Barrier Detection**: Continuous monitoring of missed or deviated meals to identify structural adherence obstacles.
  4. **Home Food Mode & Meal Suggestions**: Generates tailored meal plans from existing household ingredients.
  5. **Nutrition Digital Twin**: Tracks biochemical and biometric trends, simulating caloric deficits and weight trajectories.
- **Third-Party Integrations**:
  - USDA FoodData Central client with resilient fallback.
  - OpenFoodFacts barcode scanning and nutritional mapping.
  - LLM AI Provider client with evidence-based clinical prompts and offline fallback.

## Running Locally
```bash
# Set Java 17
export JAVA_HOME="/path/to/jdk-17"

# Build and run
mvn clean spring-boot:run
```
