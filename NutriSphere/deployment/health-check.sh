#!/bin/sh
set -e

# NutriSphere Health Check Script
BACKEND_URL="http://localhost:8080/api/health"
FRONTEND_URL="http://localhost:80"

echo "Checking NutriSphere Services..."

# 1. Check Backend
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL" || echo "FAILED")
if [ "$BACKEND_STATUS" -eq 200 ]; then
  echo "✔ Backend is UP (HTTP $BACKEND_STATUS)"
else
  echo "✖ Backend health check failed with status: $BACKEND_STATUS"
  exit 1
fi

# 2. Check Frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" || echo "FAILED")
if [ "$FRONTEND_STATUS" -eq 200 ] || [ "$FRONTEND_STATUS" -eq 304 ]; then
  echo "✔ Frontend is UP (HTTP $FRONTEND_STATUS)"
else
  echo "✖ Frontend health check failed with status: $FRONTEND_STATUS"
  exit 1
fi

echo "All NutriSphere services are healthy."
exit 0
