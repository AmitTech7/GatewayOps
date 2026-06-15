# Docker Commands for GatewayOps

## Prerequisites
- Docker Desktop installed and running
- Git (if cloning)

## Build and Start

### 1. Start All Services (Full Build)
```bash
docker compose up --build
```

This command will:
- Build the API Docker image
- Build the web Docker image
- Start PostgreSQL container
- Start Redis container
- Start API service (waits for PostgreSQL and Redis to be healthy)
- Start web service (waits for API to be healthy)
- Run database migrations automatically
- Seed the database with 10,000+ records
- All services will be ready in ~30-60 seconds

**Access the app:**
- Frontend: http://localhost:3000
- API: http://localhost:4000
- Health Check: http://localhost:4000/health

---

## Useful Commands

### 2. Start Services Without Rebuilding
```bash
docker compose up
```

Use when you haven't changed code and images already exist.

---

### 3. View Real-Time Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api
docker compose logs -f web
docker compose logs -f postgres
docker compose logs -f redis
```

---

### 4. Stop All Services
```bash
docker compose stop
```

Services will stop but containers and data persist. Use `docker compose up` to restart.

---

### 5. Stop and Remove Containers (Keep Data)
```bash
docker compose down
```

Stops and removes containers. Database data persists in the volume.

---

### 6. Complete Reset (Delete Everything)
```bash
docker compose down -v
```

Removes containers, networks, and volumes. **All database data is deleted.**

Then rebuild:
```bash
docker compose up --build
```

---

### 7. View Running Containers
```bash
docker compose ps
```

Shows all services with their status, ports, and health.

---

### 8. Execute Commands in Running Container

**Access PostgreSQL:**
```bash
docker compose exec postgres psql -U gatewayops -d gatewayops
```

Then run SQL:
```sql
SELECT COUNT(*) FROM api_logs;
SELECT * FROM services;
```

Exit with: `\q`

---

**Access API Container Shell:**
```bash
docker compose exec api sh
```

---

### 9. View Service-Specific Status
```bash
# Check API health
curl http://localhost:4000/health

# Check web app (should return HTML)
curl http://localhost:3000

# View API logs
docker compose logs api --tail=50
```

---

### 10. Rebuild Only API (After Code Changes)
```bash
docker compose build api
docker compose up api
```

---

### 11. Rebuild Only Web (After Frontend Changes)
```bash
docker compose build web
docker compose up web
```

---

## Common Scenarios

### Scenario 1: Fresh Start
```bash
docker compose down -v
docker compose up --build
```

### Scenario 2: Code Changes in API
```bash
# Edit src files in apps/api/
docker compose build api
docker compose up
```

### Scenario 3: Code Changes in Frontend
```bash
# Edit src files in apps/web/
docker compose build web
docker compose up
```

### Scenario 4: Database Issues
```bash
# Check database logs
docker compose logs postgres

# Reset database and reseed
docker compose down -v
docker compose up --build
```

### Scenario 5: Port Already in Use
If port 3000, 4000, 5432, or 6379 is already in use:

Edit `docker-compose.yml` and change the port mapping:
```yaml
api:
  ports:
    - "4001:4000"  # Maps host port 4001 to container port 4000

web:
  ports:
    - "3001:3000"  # Maps host port 3001 to container port 3000
```

Then access:
- Frontend: http://localhost:3001
- API: http://localhost:4001

---

## Verify Everything Works

After running `docker compose up --build`:

```bash
# 1. Check all containers are running
docker compose ps

# 2. Test API health endpoint
curl http://localhost:4000/health
# Expected: {"status":"ok","db":"connected","redis":"connected"}

# 3. Test frontend is accessible
curl http://localhost:3000 | head -20

# 4. Check database has data
docker compose exec postgres psql -U gatewayops -d gatewayops -c "SELECT COUNT(*) FROM api_logs;"
# Expected: count=10000
```

---

## Troubleshooting

### API Container Keeps Restarting
```bash
docker compose logs api
```
Check for error messages. Usually PostgreSQL or Redis connection issues.

### Database Migration Fails
```bash
docker compose down -v
docker compose up --build
```
Reset and rebuild.

### High Memory Usage
Increase Docker memory:
- **Mac/Windows:** Docker Desktop → Preferences → Resources → Memory (set to 4GB+)
- **Linux:** Not applicable (uses system memory)

### Services Won't Start
```bash
# Kill dangling containers
docker compose down
docker system prune -f
docker compose up --build
```

---

## Performance Tips

- Use `docker compose up` (without `--build`) if code hasn't changed
- Use `docker compose logs -f service_name` instead of `docker compose logs -f` to reduce output
- Pin Docker Desktop to use 4GB+ RAM
- On Linux, use `docker buildx` for faster builds: `docker buildx build --load -t gatewayops-api .`

