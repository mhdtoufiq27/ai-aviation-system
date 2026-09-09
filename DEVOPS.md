# ✈️ AI Aviation Management System — DevOps & CI/CD Guide

This repository includes a comprehensive, production-grade DevOps setup with **Docker containerization**, **Docker Compose multi-service orchestration**, and an automated **Jenkins CI/CD Pipeline**.

---

## 🏛 Architecture Overview

```
                          ┌──────────────────────────┐
                          │   Client (React + Vite)  │
                          │   Nginx Alpine (:3000)   │
                          └─────────────┬────────────┘
                                        │ (HTTP / WebSocket)
                                        ▼
                          ┌──────────────────────────┐
                          │   Server (Node.js API)   │
                          │      Express (:5000)     │
                          └───────┬───────────┬──────┘
                                  │           │
                     (Mongoose)   │           │ (HTTP REST)
                                  ▼           ▼
             ┌─────────────────────────┐  ┌─────────────────────────┐
             │    MongoDB Database     │  │  AeroAI Python Service   │
             │   mongo:7.0 (:27017)    │  │   Flask + ML (:5001)     │
             └─────────────────────────┘  └─────────────────────────┘
```

---

## 🐳 Docker Deployment

### 1. Port Mapping Summary

| Service | Technology | Internal Port | Exposed Host Port | Healthcheck Endpoint |
|---|---|---|---|---|
| **client** | React + Nginx Alpine | `80` | `3000` | `/healthz` |
| **server** | Node.js Express + Socket.io | `5000` | `5000` | `/api/health` |
| **ai-service** | Python 3.11 + Flask + Scikit | `5001` | `5001` | `/health` |
| **mongo** | MongoDB 7.0 | `27017` | `27017` | `mongosh ping` |

---

### 2. Run the Entire Stack Locally with Docker Compose

To build and start all 4 services in detached mode:

```bash
docker compose up -d --build
```

To view live container status and health:

```bash
docker compose ps
```

To view live logs from all services:

```bash
docker compose logs -f
```

To view logs for a specific service:

```bash
docker compose logs -f server
docker compose logs -f ai-service
docker compose logs -f client
```

To stop and tear down containers:

```bash
docker compose down
```

To remove containers and purge persistent database volumes:

```bash
docker compose down -v
```

---

### 3. Individual Container Builds

You can also build and run each service independently:

#### Backend Server:
```bash
docker build -t skyflow-server ./server
docker run -p 5000:5000 --env-file server/.env skyflow-server
```

#### Python AI Service:
```bash
docker build -t skyflow-ai-service ./ai-service
docker run -p 5001:5001 skyflow-ai-service
```

#### Frontend Client:
```bash
docker build -t skyflow-client \
  --build-arg VITE_API_URL=http://localhost:5000/api \
  --build-arg VITE_SOCKET_URL=http://localhost:5000 \
  ./client
docker run -p 3000:80 skyflow-client
```

---

## 🛠 Jenkins CI/CD Pipeline

The included [`Jenkinsfile`](file:///c:/Users/sujan/OneDrive/Desktop/Second%20Sem%20Project/AI%20Aviation%20Management%20System/Jenkinsfile) defines an enterprise-ready Declarative Pipeline.

### Pipeline Stages:
1. **Checkout SCM**: Clones the latest code from GitHub.
2. **Code Validation & Lint**:
   - Python bytecode syntax check on `ai-service`
   - Node.js syntax inspection on `server`
   - Configuration verification on `client`
3. **Build Docker Images (Parallel)**:
   - Builds `skyflow-client` (multi-stage Nginx build)
   - Builds `skyflow-server` (optimized Node alpine build)
   - Builds `skyflow-ai-service` (Python 3.11 slim build)
4. **DevOps Integration Smoke Test**:
   - Launches the full stack using `docker compose up -d`
   - Probes `/api/health`, `/health`, and `/healthz` endpoints
   - Cleans up temporary test containers
5. **Security Scan (Trivy)**: Scans container images for high and critical CVE vulnerabilities.
6. **Push to Docker Hub**:
   - Conditioned on `main` branch and `PUSH_TO_REGISTRY = true`
   - Authenticates using Jenkins credentials ID: `docker-hub-credentials`
   - Pushes both `:latest` and `:${BUILD_NUMBER}` tags
7. **Continuous Deployment**: Rolls out updated containers with zero downtime.

---

### 📋 Setting Up Jenkins

1. **Required Jenkins Plugins**:
   - `Pipeline`
   - `Git Plugin`
   - `Docker Pipeline`
   - `Credentials Binding Plugin`
   - `AnsiColor` (optional, for colored terminal output)

2. **Configure Docker Hub Credentials**:
   - Navigate to **Manage Jenkins** → **Credentials** → **System** → **Global credentials**.
   - Click **Add Credentials**:
     - **Kind**: `Username with password`
     - **Scope**: `Global`
     - **Username**: Your Docker Hub username
     - **Password**: Your Docker Hub Access Token / Password
     - **ID**: `docker-hub-credentials`

3. **Create Jenkins Pipeline Job**:
   - Click **New Item** → Select **Pipeline**.
   - In **Build Triggers**, optionally enable **GitHub hook trigger for GITScm polling**.
   - In **Pipeline Definition**, select **Pipeline script from SCM**.
   - **SCM**: `Git`
   - **Repository URL**: `https://github.com/sujan-ai8/AI-Aviation-Management-System.git`
   - **Branch**: `*/main`
   - **Script Path**: `Jenkinsfile`
   - Save and click **Build with Parameters**.

---

## 🔒 Security & Best Practices Implemented

- **Non-Root Execution**: Dockerfiles for server (`USER node`) and AI microservice (`USER appuser`) drop privileges to non-root users.
- **Multi-Stage Builds**: Frontend uses multi-stage builds so Node compiler tools and dev dependencies are never shipped in the production Nginx image.
- **Docker Layer Caching**: `package*.json` and `requirements.txt` are copied before application code to leverage caching and speed up builds.
- **Layered Git & Docker Ignores**: `.dockerignore` and `.gitignore` prevent sensitive environment files, secrets, database volumes, and build caches from being leaked or pushed.
- **Automated Healthchecks**: Every container specifies built-in healthchecks with timeouts and retry intervals to guarantee dependable orchestration.
