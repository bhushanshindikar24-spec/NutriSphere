# NutriSphere — Security & Access Control Architecture

## Principles
NutriSphere enforces a defense-in-depth security model to safeguard protected health information (PHI) and clinical prescriptions:

1. **Stateless Authentication**: JJWT issued tokens containing user identity, role, and expiration timestamp.
2. **Role-Based Access Control (RBAC)**: Enforced at both URL filter chain level (`SecurityConfig.java`) and method-level using `@PreAuthorize`.
3. **Role Isolation Matrix**:
   - `ROLE_DOCTOR`: Clinical conditions, diagnostic labs, consultations.
   - `ROLE_DIETITIAN`: Nutritional assessments, requirement calculation, diet plan approval, adaptive reviews.
   - `ROLE_PATIENT`: Food/water intake, home food pantry, barriers, hotel ordering.
   - `ROLE_HOTEL`: Kitchen menu curation, order status updates.
4. **Audit Logging**: All write and query operations against sensitive clinical endpoints generate an `audit_logs` record containing timestamp, acting user ID, IP address, and entity ID.
5. **CORS & CSRF**: CSRF disabled due to stateless JWT tokens; CORS policy configured with strict allowed origins and headers.
