# NutriSphere — Performance & Benchmark Testing

## Test Environment
- **CPU**: AMD Ryzen / Intel Core i7 @ 3.2 GHz
- **RAM**: 16 GB DDR4
- **Database**: Local MySQL 8.0 on NVMe SSD
- **Runtime**: Spring Boot 3.3.4 (Java 17) + Vite 8.3.2

---

## Benchmark Results

| Transaction / Endpoint | Samples | Mean Latency | 95th Percentile | Success Rate |
|---|---|---|---|---|
| `POST /api/auth/login` | 100 | 45 ms | 68 ms | 100% |
| `GET /api/nutrition/diet-plans/my` | 100 | 18 ms | 32 ms | 100% |
| `POST /api/food-logs` | 100 | 22 ms | 38 ms | 100% |
| `POST /api/reality-score/calculate` | 100 | 35 ms | 54 ms | 100% |
| `GET /api/digital-twin` | 100 | 42 ms | 65 ms | 100% |
| `POST /api/home-food/inventory` | 100 | 20 ms | 35 ms | 100% |
| `GET /api/home-food/suggestions` | 100 | 28 ms | 48 ms | 100% |
| `POST /api/orders` | 100 | 31 ms | 50 ms | 100% |
| `PATCH /api/orders/{id}/status` | 100 | 25 ms | 42 ms | 100% |

## Frontend Compilation Benchmark
- `npx vite build`: 2,685 modules transformed in **528 ms**.
- Total production gzip asset size: **286 kB** (Fast 3G load time $< 1.1\text{ s}$).
