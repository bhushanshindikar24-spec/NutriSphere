# NutriSphere — Troubleshooting & Operations Runbook

## Common Issues & Resolutions

### 1. `UnsupportedClassVersionError` or Compilation Failure
- **Symptom**: `class file has wrong version 61.0, should be 52.0`.
- **Cause**: Maven is picking up an older JDK (e.g. Java 8) instead of Java 17.
- **Resolution**: Explicitly point `JAVA_HOME` to JDK 17 before invoking Maven:
  ```powershell
  $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
  ```

### 2. `SchemaManagementException: Schema-validation: missing table`
- **Symptom**: Hibernate ddl-auto validation fails on startup.
- **Cause**: Flyway has unapplied migrations or baseline version mismatch.
- **Resolution**: Ensure all migrations in `backend/src/main/resources/db/migration/` are present and valid (`V1`, `V2`). Re-run `mvn clean compile`.

### 3. Port 8080 or Port 5173 Already in Use
- **Symptom**: `BindException: Address already in use`.
- **Resolution**: Identify and terminate the occupying process:
  ```powershell
  Get-NetTCPConnection -LocalPort 8080 | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force
  ```

### 4. CORS Error in Browser Console
- **Symptom**: `Access to XMLHttpRequest blocked by CORS policy`.
- **Resolution**: Verify `SecurityConfig.java` has allowed `http://localhost:5173` or set `VITE_API_URL` to route through the proxy in `vite.config.js`.
