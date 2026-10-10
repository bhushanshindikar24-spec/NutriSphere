# NutriSphere — Security & Penetration Testing

## Assessment Scope

1. **Broken Object Level Authorization (BOLA / IDOR)**:
   - Evaluated cross-tenant access. Patients cannot query or modify clinical records belonging to other patients without active care assignment.
   - Status: **PASSED**. Handled via `SecurityUtils.getCurrentUserId()` and repository scoped queries.

2. **Privilege Escalation**:
   - Tested patient attempting to invoke Dietitian-only endpoint (`POST /api/nutrition/diet-plans`).
   - Response: `403 Forbidden` (`Access Denied`).
   - Status: **PASSED**.

3. **Unauthenticated Access Prevention**:
   - Tested calls without `Authorization: Bearer` header against protected resources.
   - Response: `401 Unauthorized` (`Authentication required`).
   - Status: **PASSED**.

4. **SQL Injection Vulnerability**:
   - Evaluated all repository access methods. All queries use Spring Data JPA parameterized queries and JPQL bindings. No raw string concatenation.
   - Status: **PASSED**.

5. **Cross-Site Scripting (XSS)**:
   - React 19 automatic JSX string escaping prevents inline script execution.
   - Status: **PASSED**.
