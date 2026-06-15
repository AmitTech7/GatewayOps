# Getting Started with GatewayOps

A quick guide to get the project up and running in 5 minutes.

---

## Step 1: Prerequisites

Make sure you have:
- ✅ Docker Desktop (4.x or later)
- ✅ Git
- ✅ Terminal/Command Prompt

That's it! No need to install Node.js, PostgreSQL, or Redis.

---

## Step 2: Clone the Repository

```bash
git clone https://github.com/your-org/gatewayops.git
cd gatewayops
```

---

## Step 3: Start the Project

```bash
docker compose up --build
```

This will:
- Build the API and web images
- Start all services (PostgreSQL, Redis, API, web)
- Auto-seed the database with 10,000+ records
- Be ready in ~60 seconds

---

## Step 4: Access the Application

Open your browser to:

- **🎨 Frontend:** http://localhost:3000
- **📡 API:** http://localhost:4000/api/v1
- **❤️ Health Check:** http://localhost:4000/api/v1/health

---

## Step 5: Explore the Dashboard

1. Go to http://localhost:3000
2. You'll see:
   - **Dashboard:** KPI metrics and charts
   - **Services:** List of 5 services with status
   - **Logs:** 10,000 API logs with filters
   - **Rate Limits:** Rate limit violations
   - **Auth Stats:** Authentication statistics

---

## Common Tasks

### View API Logs
```bash
curl http://localhost:4000/api/v1/logs
curl http://localhost:4000/api/v1/logs?page=1&limit=5
```

### Access Database
```bash
docker compose exec postgres psql -U gatewayops -d gatewayops
```

### View Backend Logs
```bash
docker compose logs -f api
```

### Stop Services
```bash
docker compose down
```

### Reset Everything
```bash
docker compose down -v
docker compose up --build
```

---

## Next Steps

- **Read the full README:** Check out [README.md](README.md) for detailed documentation
- **Find bugs:** Check [docs/problems.md](docs/problems.md) for 10 production bugs to fix
- **Docker help:** See [DOCKER_COMMANDS.md](DOCKER_COMMANDS.md) for all Docker operations

---

## Troubleshooting

### Port Already in Use
Edit `docker-compose.yml` and change the ports:
```yaml
api:
  ports:
    - "4001:4000"    # Change 4000 to 4001
web:
  ports:
    - "3001:3000"    # Change 3000 to 3001
```

### Services Won't Start
```bash
# Check logs
docker compose logs postgres
docker compose logs api

# Fresh start
docker compose down -v
docker compose up --build
```

### Can't Connect to Database
```bash
# Verify PostgreSQL is healthy
docker compose ps

# Wait a bit and try again
sleep 5
docker compose ps
```

---

## You're All Set! 🚀

The project is ready. Start investigating the bugs in `docs/problems.md`.

Have questions? Check the [full README](README.md).
