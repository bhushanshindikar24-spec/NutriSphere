# NutriSphere — System Architecture

```
                  ┌──────────────────────────────┐
                  │    React 19 Frontend (SPA)   │
                  │   Vite 8 • Context API • CSS │
                  └──────────────┬───────────────┘
                                 │ HTTP / JSON
                                 ▼
                  ┌──────────────────────────────┐
                  │   Spring Boot 3.3.4 (REST)   │
                  │ Security • Controllers • Svc │
                  └──────────────┬───────────────┘
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼                                           ▼
┌──────────────────────┐                    ┌──────────────────────┐
│      MySQL 8.0       │                    │    External APIs     │
│ Flyway (40 Tables)   │                    │ USDA FoodData • OFF  │
└──────────────────────┘                    └──────────────────────┘
```

## Core Subsystems
1. **Frontend Client Layer**: Single-Page Application with dedicated layouts and route protections for Patient, Dietitian, Doctor, and Hotel.
2. **Application Server Layer**: Spring Boot micro-monolith providing stateless API endpoints, transaction management, and clinical business logic.
3. **Database Layer**: Relational MySQL schema with strict foreign key constraints, baseline schema V1, and medical extension migration V2.
4. **Third-Party Integration Layer**: USDA FoodData Central and Open Food Facts clients providing verified nutrient density tables.
