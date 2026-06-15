# GatewayOps

**An enterprise-grade API Gateway Monitoring Dashboard** for platform engineering teams. This project serves as both a production monitoring tool and a comprehensive technical interview assessment platform.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Database](#database)
- [API Reference](#api-reference)
- [Features](#features)
- [Troubleshooting](#troubleshooting)
- [Assessment Instructions](#assessment-instructions)

---

## Overview

GatewayOps provides real-time monitoring of API gateway traffic, service health, authentication events, and rate limiting across microservices. The dashboard displays comprehensive metrics, detailed request logs, service statistics, and security analytics.

**Tech Stack:**
- **Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS, TanStack Query v5, Recharts
- **Backend:** Express.js, Node.js, TypeScript
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **Infrastructure:** Docker, Docker Compose

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│         Frontend (Next.js 15)                   │
│      http://localhost:3000                      │
│  (Dashboard, Charts, Logs, Analytics)           │
└────────────────┬────────────────────────────────┘
                 │ HTTP/JSON
                 │
┌────────────────▼────────────────────────────────┐
│      Backend (Express + TypeScript)             │
│   http://localhost:4000/api/v1                  │
│  (REST API, Business Logic, Validation)         │
└────────────────┬────────────────────────────────┘
                 │
      ┌──────────┼──────────┐
      │          │          │
┌─────▼──┐  ┌────▼───┐  ┌──▼─────────┐
│PostgreSQL│ │ Redis  │  │ Monitoring │
│Port 5432 │ │Port 6379  │ External   │
└──────────┘ └────────┘  └────────────┘
```

---

## Prerequisites

**Required:**
- Docker Desktop 4.x or later (includes Docker Compose)
- Git
- Terminal/Command Prompt

**No local installation needed** for:
- Node.js
- PostgreSQL
- Redis
- npm

---

## Quick Start

### 1. Clone & Navigate
```bash
git clone https://github.com/your-org/gatewayops.git
cd gatewayops
```

### 2. Start the Project
```bash
docker compose up --build
```

This command:
- Builds API and web Docker images
- Starts PostgreSQL, Redis, API, and web services
- Auto-migrates database schema
- Seeds database with 10,000+ realistic records
- Waits for all services to become healthy

### 3. Access the Application
- **Frontend:** http://localhost:3000
- **API:** http://localhost:4000/api/v1
- **Health Check:** http://localhost:4000/api/v1/health

---

## Project Structure

```
gatewayops/
├── apps/
│   ├── api/                              # Express backend
│   │   ├── src/
│   │   │   ├── config/                   # Database, Redis, env validation
│   │   │   ├── routes/                   # API endpoint definitions
│   │   │   ├── controllers/              # Request handlers
│   │   │   ├── services/                 # Business logic layer
│   │   │   ├── repositories/             # Data access layer (queries)
│   │   │   ├── middleware/               # Auth, CORS, logging, error handling
│   │   │   ├── dto/                      # Data transfer objects
│   │   │   ├── types/                    # TypeScript interfaces
│   │   │   ├── app.ts                    # Express app factory
│   │   │   └── index.ts                  # Entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   └── web/                              # Next.js 15 frontend
│       ├── src/
│       │   ├── app/                      # Page components & layouts
│       │   │   ├── page.tsx              # Dashboard (/
│       │   │   ├── services/             # Services page
│       │   │   ├── logs/                 # API Logs page
│       │   │   ├── rate-limits/          # Rate Limits page
│       │   │   └── auth-stats/           # Auth Statistics page
│       │   ├── components/               # Reusable React components
│       │   │   ├── ui/                   # Basic UI (Card, Badge, Table, etc.)
│       │   │   ├── layout/               # App layout (Sidebar, Header, Shell)
│       │   │   ├── dashboard/            # Dashboard-specific (Charts, Metrics)
│       │   │   ├── logs/                 # Logs components (Table, Filters)
│       │   │   └── services/             # Services components
│       │   ├── hooks/                    # Custom React hooks (useQuery)
│       │   ├── lib/                      # Utilities (API client, query client)
│       │   ├── types/                    # TypeScript interfaces
│       │   └── styles/                   # Global CSS & Tailwind
│       ├── package.json
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       ├── postcss.config.js
│       └── Dockerfile
│
├── database/
│   ├── migrations/                       # Knex.js schema migrations (not used in demo)
│   └── seeds/                            # Database seed scripts (not used in demo)
│
├── docker/
│   ├── postgres/
│   │   └── init.sql                      # Auto-executed SQL (schema + seed data)
│   └── redis/
│       └── redis.conf                    # Redis configuration
│
├── docs/
│   └── problems.md                       # 10 production bugs for assessment
│
├── docker-compose.yml                    # Multi-container orchestration
├── .env.example                          # Environment variable template
├── DOCKER_COMMANDS.md                    # Docker command reference
└── README.md                             # This file
```

---

## Database

### Connection Details
```
Host: localhost
Port: 5432
Database: gatewayops
Username: gatewayops
Password: gatewayops_secret
URL: postgresql://gatewayops:gatewayops_secret@localhost:5432/gatewayops
```

### Access via psql
```bash
docker compose exec postgres psql -U gatewayops -d gatewayops
```

### Common Queries
```sql
-- Count records in each table
SELECT COUNT(*) FROM api_logs;        -- 10,000 records
SELECT COUNT(*) FROM auth_events;     -- 1,000 records
SELECT COUNT(*) FROM services;        -- 5 records
SELECT COUNT(*) FROM users;           -- 100 records
SELECT COUNT(*) FROM rate_limit_violations; -- 200 records

-- View services
SELECT id, name, slug, status FROM services;

-- Check recent logs
SELECT endpoint, method, status_code, latency_ms FROM api_logs ORDER BY created_at DESC LIMIT 10;

-- Auth event breakdown
SELECT event_type, COUNT(*) FROM auth_events GROUP BY event_type;
```

### Seed Data

**Automatically seeded on startup:**

| Table | Count | Description |
|-------|-------|-------------|
| users | 100 | 2 admins, 98 viewers |
| services | 5 | User, Order, Payment, Notification, Analytics |
| api_logs | 10,000 | 30 days of realistic traffic |
| auth_events | 1,000 | Login successes/failures, token events |
| rate_limit_violations | 200 | Traffic violations across services |

**Data Distribution:**
- API Logs: 75% 2xx, 15% 4xx, 10% 5xx status codes
- Latency: 20ms–8000ms (realistic with long tail)
- Timestamps: Distributed over last 30 days
- Traffic: Concentrated during business hours (9am–6pm)

---

## API Reference

**Base URL:** `http://localhost:4000/api/v1`

**Authentication:** Not required (disabled for demo)

### Metrics Endpoints

#### Get Dashboard Summary
```bash
GET /metrics/summary
```
Returns KPI metrics: total requests, failed requests, success rate, auth failures, response time, rate limit violations.

```bash
curl http://localhost:4000/api/v1/metrics/summary
```

#### Get Requests Over Time
```bash
GET /metrics/requests-over-time?interval=hour|day&from=ISO8601&to=ISO8601
```
Time series data for requests chart.

#### Get Error Trends
```bash
GET /metrics/error-trends?from=ISO8601&to=ISO8601
```
Time series data for error rate chart.

#### Get Service Distribution
```bash
GET /metrics/service-distribution?from=ISO8601&to=ISO8601
```
Request distribution across services.

#### Get Detailed Metrics (Admin Only)
```bash
GET /metrics/admin/detailed
```
Advanced metrics including 2xx/4xx/5xx breakdowns, slowest endpoints, busiest service.

### Logs Endpoints

#### Get Paginated Logs
```bash
GET /logs?page=1&limit=10&service=user-service&statusCode=500&from=ISO8601&to=ISO8601&search=endpoint
```
Query parameters:
- `page`: Page number (1-indexed)
- `limit`: Records per page
- `service`: Filter by service slug
- `statusCode`: Filter by HTTP status code
- `from`/`to`: Date range filters
- `search`: Search endpoint or user ID

```bash
curl "http://localhost:4000/api/v1/logs?page=1&limit=10"
```

#### Get Single Log
```bash
GET /logs/{id}
```

### Services Endpoints

#### Get All Services
```bash
GET /services
```

#### Get Service Statistics
```bash
GET /services/{slug}/stats
```
Returns: request count, error count, error rate, average latency.

```bash
curl http://localhost:4000/api/v1/services/user-service/stats
```

### Rate Limits Endpoints

#### Get Rate Limit Summary
```bash
GET /rate-limits/summary?from=ISO8601&to=ISO8601
```

#### Get Violation Details
```bash
GET /rate-limits/violations?from=ISO8601&to=ISO8601
```

#### Get Top Offenders
```bash
GET /rate-limits/top-offenders
```

### Authentication Endpoints

#### Get Auth Statistics
```bash
GET /auth/stats?from=ISO8601&to=ISO8601
```
Successful logins, failed logins, token validation failures, token expirations.

```bash
curl http://localhost:4000/api/v1/auth/stats
```

#### Get Auth Events
```bash
GET /auth/events?page=1&limit=10
```

### Health Check

```bash
GET /health
```
Returns service status and connectivity.

```bash
curl http://localhost:4000/api/v1/health
# {"status":"ok","db":"connected","redis":"connected"}
```

---

## Features

### Dashboard
- **KPI Cards:** Total requests, failed requests, success rate, auth failures, response time, rate limit violations
- **Time Series Charts:** Requests over time, error trends
- **Distribution Charts:** Service distribution (pie chart)
- **Date Range Filter:** Global filter applied to all widgets

### Services Page
- **Service Table:** Name, status badge, request count, error rate, latency
- **Service Statistics:** Inline expansion with detailed stats per service

### API Logs Page
- **Advanced Filters:** Service, status code, date range, endpoint search
- **Pagination:** Navigate through 10,000+ log records
- **Detailed View:** Click row to expand full log details
- **Status Code Badges:** Color-coded HTTP status codes

### Rate Limits Page
- **Summary Metrics:** Total violations, requests/min, peak RPM
- **Violation Details:** Detailed list of rate limit breaches
- **Top Offenders:** Users/services with highest violations

### Auth Statistics Page
- **Event Breakdown:** Successful logins, failures, token events
- **Time Series:** Auth events per day
- **Detailed Log:** Paginated list of auth events

---

## Common Docker Commands

### View Logs
```bash
docker compose logs -f api         # Backend logs
docker compose logs -f web         # Frontend logs
docker compose logs -f postgres    # Database logs
docker compose logs -f redis       # Cache logs
```

### Stop Services
```bash
docker compose stop                # Pause services (keep data)
docker compose down                # Stop and remove containers (keep data)
docker compose down -v             # Stop and remove everything (delete data)
```

### Restart Services
```bash
docker compose up -d               # Start services
docker compose restart api         # Restart specific service
docker compose up --build          # Rebuild and start
```

### Fresh Reset
```bash
docker compose down -v
docker compose up --build
```

### Check Service Status
```bash
docker compose ps
docker compose ps -a               # Include stopped containers
```

### Execute Commands in Containers
```bash
docker compose exec postgres psql -U gatewayops -d gatewayops
docker compose exec api sh
docker compose exec redis redis-cli PING
```

---

## Troubleshooting

### Services Won't Start

**Check logs:**
```bash
docker compose logs postgres
docker compose logs api
```

**Common issues:**
- Port already in use: Kill the process or change ports in docker-compose.yml
- Out of memory: Increase Docker memory to 4GB+
- Network issues: Try `docker compose down -v && docker compose up --build`

### Database Issues

**Fresh database reset:**
```bash
docker compose down -v
docker compose up --build
```

**Connect to database:**
```bash
docker compose exec postgres psql -U gatewayops -d gatewayops
```

### High Memory Usage

**Increase Docker memory:**
- **Mac/Windows:** Docker Desktop → Preferences → Resources → Memory (set to 4GB+)
- **Linux:** Not applicable (uses system memory)

### Port Conflicts

**Edit docker-compose.yml to use different ports:**
```yaml
api:
  ports:
    - "4001:4000"   # Host:Container

web:
  ports:
    - "3001:3000"
```

Then access at: http://localhost:3001 and http://localhost:4001/api/v1

---

## Environment Variables

### Default Configuration (docker-compose.yml)

| Variable | Default | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | `postgresql://gatewayops:gatewayops_secret@postgres:5432/gatewayops` | PostgreSQL connection |
| `REDIS_URL` | `redis://redis:6379` | Redis connection |
| `PORT` | `4000` | API server port |
| `NODE_ENV` | `production` | Node environment |
| `JWT_SECRET` | `super_secret_jwt_key_change_in_prod` | JWT signing key |
| `RUN_MIGRATIONS` | `false` | Run migrations (disabled) |
| `RUN_SEEDS` | `false` | Run seeds (disabled) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Frontend API URL |
| `INTERNAL_API_URL` | `http://api:4000` | Internal Docker API URL |

---

## Assessment Instructions

### For Candidates

This project contains **10 intentional production bugs** embedded silently in the codebase. Your task is to:

1. **Investigate** each reported issue in `docs/problems.md`
2. **Identify** the root cause in the code
3. **Implement** a fix
4. **Verify** your fix works
5. **Document** your findings

**Read:** [`docs/problems.md`](docs/problems.md) for detailed problem descriptions.

### The 10 Bugs

| # | Name | Severity | Category |
|---|------|----------|----------|
| 1 | Metrics Aggregation Double-Count | High | Query Bug |
| 2 | Pagination Off-by-One | Medium | Logic Error |
| 3 | Stale Dashboard Cache | High | Caching Bug |
| 4 | Combined Filter SQL Logic | Medium | Query Bug |
| 5 | Rate Limit Calculation | High | Math/Logic |
| 6 | Auth Failure Undercount | High | Query Bug |
| 7 | N+1 Queries / Missing Index | High | Performance |
| 8 | Broken Authorization | Critical | Security |
| 9 | Frontend State Desync | Medium | State Management |
| 10 | Date Range Edge Case | Medium | Logic Error |

### Submission Requirements

For each bug fixed, provide:

1. **Root Cause:** What is causing the issue?
2. **Impact:** How does it affect users/business?
3. **Fix:** Code changes (diff format preferred)
4. **Verification:** How you tested the fix
5. **Prevention:** How could this be caught earlier?

Submit your fixes as a **pull request** or **patch file**.

---

## Development Notes

### Adding New Features

The codebase follows a **layered architecture**:
- **Routes** → Controllers → Services → Repositories → Database

Example flow for a new endpoint:
1. Define route in `apps/api/src/routes/`
2. Create controller method in `apps/api/src/controllers/`
3. Add service logic in `apps/api/src/services/`
4. Write repository query in `apps/api/src/repositories/`
5. Create React component in `apps/web/src/components/`
6. Add hook in `apps/web/src/hooks/`
7. Use in page component in `apps/web/src/app/`

### Code Style

- **TypeScript strict mode** enabled
- **ESM imports** used throughout
- **No comments** except for WHY (not WHAT)
- **Error handling** at system boundaries (API, DB)
- **Validation** with Zod at API layer

### Performance Considerations

- **Database indexes** on frequently queried columns
- **Redis caching** for expensive aggregations
- **React Query** for client-side caching
- **Pagination** for large datasets
- **Connection pooling** for database

---

## Support

### Getting Help

- Check `DOCKER_COMMANDS.md` for Docker operations
- Review `docs/problems.md` for assessment details
- Check service logs: `docker compose logs -f [service]`
- Verify database connectivity: `curl http://localhost:4000/api/v1/health`

### Reporting Issues

Create an issue with:
- Description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Relevant error logs

---

## License

This project is provided for assessment and educational purposes.

---

**Happy debugging! 🚀**
