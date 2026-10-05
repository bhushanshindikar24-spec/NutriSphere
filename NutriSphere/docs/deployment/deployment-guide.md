# NutriSphere — Production Deployment Guide

## Deployment Architecture
NutriSphere is engineered for containerized orchestration via Docker Compose or Kubernetes, backed by managed MySQL.

```
[ Internet ] ──HTTPS (443)──► [ Nginx Reverse Proxy / Frontend (Port 80) ]
                                    │
                                    ├─── /api/* ──► [ Spring Boot Backend (Port 8080) ]
                                    │                      │
                                    │                      └──► [ MySQL Database (Port 3306) ]
                                    └─── /* ──────► Static SPA Bundle
```

---

## 1-Command Production Setup

1. Copy production environment file:
   ```bash
   cp deployment/.env.production.example deployment/.env.production
   ```
2. Configure your secure credentials in `deployment/.env.production`.
3. Launch container cluster:
   ```bash
   docker compose -f deployment/docker-compose.prod.yml up -d --build
   ```
4. Verify services:
   ```bash
   ./deployment/health-check.sh
   ```
