# NutriSphere — Non-Functional Requirements Specification (NFRS)

## 1. Security & Compliance
- **NFR-1.1**: Passwords must be hashed using BCrypt with salt cost factor $\ge 10$.
- **NFR-1.2**: All API endpoints handling patient health data must require Bearer token authentication and role validation.
- **NFR-1.3**: Audit logs must be append-only and record user ID, timestamp, and IP address for every mutation.

## 2. Performance & Responsiveness
- **NFR-2.1**: API responses for core CRUD and logging operations must return in $< 200\text{ ms}$ under nominal load.
- **NFR-2.2**: Complex intelligence algorithms (Reality Score, Digital Twin simulation) must complete in $< 500\text{ ms}$.
- **NFR-2.3**: Frontend initial load and interactive time must be $< 1.5\text{ s}$ over broadband connections.

## 3. Reliability & Availability
- **NFR-3.1**: Database transactions must be strictly ACID-compliant with rollback on failure.
- **NFR-3.2**: Flyway automated migrations must run idempotently without data loss.

## 4. Usability & Accessibility
- **NFR-4.1**: User interfaces must be fully responsive across mobile, tablet, and desktop viewports.
- **NFR-4.2**: Color contrast ratios must meet WCAG 2.1 AA standards for clinical readability.
