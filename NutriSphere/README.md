# NutriSphere — Clinical Nutrition & Dietary Intelligence Platform

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)
![React](https://img.shields.io/badge/React-19.0-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)
![Java](https://img.shields.io/badge/Java-17-red.svg)

> **Closing the loop between clinical prescription and daily reality.**
> NutriSphere connects Doctors, Dietitians, Patients, and Culinary Kitchens into a unified, intelligence-driven care continuum.

---

## 🌟 Key Features

1. **Reality Score Engine**: Evaluates meal plan feasibility across 6 behavioral dimensions (Food Availability, Affordability, Cooking Complexity, Personal Preference, Schedule Alignment, Historical Adherence) before patient frustration occurs.
2. **Adaptive Diet Engine**: Dynamically analyzes 7-day intake, hydration patterns, and adherence barriers to generate clinical recommendations with built-in Dietitian approval guardrails.
3. **Home Food Mode**: Real-time pantry ingredient matching and meal suggestions without requiring unplanned grocery shopping or plan violations.
4. **Nutrition Digital Twin**: 30-day metabolic projection model tracking caloric intake, macronutrient distributions, weight trajectory, and metabolic health status.
5. **Role Isolation & Collaboration**:
   - **Doctor**: Clinical conditions, diagnostic laboratory reports, consultations.
   - **Dietitian**: Nutritional assessments, requirement calculators, adaptive diet plans, reality score breakdowns.
   - **Patient**: Real-time food/water logging, deviation tracking, home food inventory, digital twin projections.
   - **Hotel / Culinary Kitchen**: Clinically aligned menu curation, allergen tagging, order fulfillment and delivery tracking.

---

## 🏗️ Architecture & Technology Stack

- **Backend**: Spring Boot 3.3.4, Java 17, Spring Security 6 (Stateless JWT), Spring Data JPA, Hibernate 6.5, Flyway Migration.
- **Frontend**: React 19, Vite 8, React Router v6, Vanilla CSS Custom Design System (Glassmorphic, dark/light clinical themes).
- **Database**: MySQL 8.0 with relational integrity across 40 managed tables.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Oracle JDK 17+ installed (`JAVA_HOME` pointing to JDK 17)
- Node.js 18+ and npm 9+
- MySQL 8.0 running on `localhost:3306` with database `nutrisphere`

### 1. Database Setup
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS nutrisphere;"
```

### 2. Backend Server
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
*Backend runs on `http://localhost:8080`. Flyway automatically runs database migrations upon startup.*

### 3. Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔑 Demo Clinical Accounts

| Role | Email | Password | Primary Route |
|---|---|---|---|
| **Patient** | `patient@nutrisphere.com` | `password` | `/patient` |
| **Dietitian** | `dietitian@nutrisphere.com` | `password` | `/dietitian` |
| **Doctor** | `doctor@nutrisphere.com` | `password` | `/doctor` |
| **Hotel Kitchen** | `hotel@nutrisphere.com` | `password` | `/hotel` |

---

## 📂 Project Structure

```
NutriSphere/
├── backend/                   # Spring Boot 3.3.4 API
│   ├── src/main/java/com/nutrisphere/
│   │   ├── ai/                # AI recommendation services
│   │   ├── assignment/        # Doctor-Patient & Dietitian-Patient mappings
│   │   ├── audit/             # HIPAA-aligned access logging
│   │   ├── auth/              # JWT authentication & registration
│   │   ├── config/            # Security, Jackson, WebMvc config
│   │   ├── doctor/            # Doctor profile & clinical workflows
│   │   ├── dietitian/         # Dietitian profile & plan management
│   │   ├── file/              # Stored documents & lab files
│   │   ├── hotel/             # Meals, categories, availability, orders
│   │   ├── intelligence/      # Reality Score, Adaptive Engine, Digital Twin, Home Food
│   │   ├── medical/           # Health conditions, lab reports, consultations
│   │   ├── notification/      # Real-time user notifications
│   │   ├── nutrition/         # Diet plans, food logs, water logs, requirements
│   │   ├── patient/           # Patient profile & health records
│   │   └── user/              # User account entity & repositories
│   └── src/main/resources/db/migration/ # Flyway SQL migrations (V1, V2)
├── frontend/                  # React 19 + Vite SPA
│   ├── src/
│   │   ├── components/        # Intelligence, nutrition, medical, common UI
│   │   ├── context/           # AuthContext, CartContext, NotificationContext
│   │   ├── layouts/           # Role-based dashboard layouts
│   │   ├── pages/             # Doctor, Dietitian, Patient, Hotel, Public pages
│   │   ├── routes/            # Role-isolated route guards
│   │   └── services/          # Axios API communication clients
├── deployment/                # Production Docker & Nginx orchestration
└── docs/                      # Technical specifications, user manuals, API reference
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
