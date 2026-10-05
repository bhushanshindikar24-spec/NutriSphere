# NutriSphere — Local Environment Setup Guide

## Requirements
- **JDK**: Eclipse Temurin or Oracle JDK 17+
- **Node.js**: v18.x or v20.x
- **Build Tools**: Maven 3.9+ (or use included `mvnw`)
- **Database**: MySQL 8.0 Server

---

## Step-by-Step Local Setup

### 1. Database Initialization
Ensure MySQL service is running. Connect to MySQL and run:
```sql
CREATE DATABASE IF NOT EXISTS nutrisphere;
```

### 2. Backend Initialization
Set `JAVA_HOME` to JDK 17:
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
cd backend
.\mvnw.cmd clean compile
.\mvnw.cmd spring-boot:run
```
*Backend will start on `http://localhost:8080` and seed default demo accounts.*

### 3. Frontend Initialization
```powershell
cd frontend
npm install
npm run dev
```
*Frontend dev server will start on `http://localhost:5173`.*
