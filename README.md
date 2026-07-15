# DevPulse

A real-time system monitoring dashboard built with Next.js 14 (App Router) + TypeScript + Tailwind. It simulates a fleet of microservices (auth-api, payments-gw, checkout-svc, search-index, media-cdn, notif-worker) with live CPU/memory/latency metrics, alerting, and a deployment log — the kind of thing you'd actually containerize and ship through a pipeline.

This project exists to give you real DevOps reps, not just another CRUD app.

## Stack

- **Next.js 14** App Router, TypeScript, Tailwind CSS
- Two API routes (`/api/metrics`, `/api/deployments`) backed by an in-memory mock data engine — no external services needed to run it
- `/api/health` for container/orchestrator health checks

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Run with Docker

```bash
docker build -t devpulse .
docker run -p 3000:3000 devpulse
```

## Run with Docker Compose (app + Postgres)

```bash
docker compose up --build
```

This spins up the app plus a Postgres container (currently unused by the app — it's there so you have a real DB to wire up as a stretch goal, e.g. persisting deployment history instead of keeping it in memory).

---

## DevOps Learning Path

Use this repo as the playground for each phase. Do them in order — each one builds on the last.

### Phase 1 — Containerization ✅ (scaffolded for you)
- [x] Multi-stage `Dockerfile` (deps → build → slim runner using Next's `standalone` output)
- [x] `docker-compose.yml` wiring the app to Postgres with a healthcheck-gated `depends_on`
- Your task: read through the Dockerfile line by line, then break it on purpose (e.g. remove a stage) and fix it. That's how the multi-stage pattern actually sinks in.

### Phase 2 — CI/CD ✅ (scaffolded for you)
- [x] `.github/workflows/ci.yml` — lint → build → docker build on every push/PR
- Your task:
  1. Push this to GitHub, watch the Actions tab run.
  2. Add a `docker/login-action` step + push the image to GHCR or Docker Hub (needs `secrets.DOCKER_USERNAME` / `secrets.DOCKER_PASSWORD` in repo settings).
  3. Add a branch-protection rule requiring CI to pass before merge.

### Phase 3 — Orchestration
- Install `minikube` or `kind` locally.
- Write `Deployment`, `Service`, and `ConfigMap` manifests for this app.
- Point the `Deployment`'s image at the one your CI builds.
- Get `kubectl get pods` showing it running, then `kubectl port-forward` to hit it.

### Phase 4 — Monitoring & Observability
- Add Prometheus + Grafana to `docker-compose.yml` as extra services.
- Expose real metrics from the app (e.g. `/api/metrics` in Prometheus text format via a library like `prom-client`) instead of just JSON for the UI.
- Build a Grafana dashboard on top of it.

### Phase 5 — Infrastructure as Code
- Write a small Terraform config that provisions one real cloud resource (a VM, or an S3/Spaces bucket for build artifacts).
- Practice `terraform plan` / `apply` / `destroy` — get comfortable with state.

---

## Project structure

```
devpulse/
├── app/
│   ├── api/
│   │   ├── metrics/route.ts       # live service metrics (polled every 3s)
│   │   ├── deployments/route.ts   # deployment history
│   │   └── health/route.ts        # container health check
│   ├── layout.tsx
│   ├── page.tsx                   # dashboard (client component, polls the APIs)
│   └── globals.css
├── components/
│   ├── Header.tsx
│   ├── AlertBanner.tsx
│   ├── ServiceCard.tsx
│   ├── Trace.tsx                  # oscilloscope-style sparkline
│   ├── StatusDot.tsx
│   └── DeploymentLog.tsx
├── lib/
│   ├── mock-services.ts           # in-memory data engine simulating drift/incidents
│   └── format.ts
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Notes

- Metrics are simulated server-side in `lib/mock-services.ts` — every poll nudges each service's CPU/mem/latency and occasionally triggers a random "incident" window so the dashboard feels alive. No real infra is being monitored; swap this out for real Prometheus/CloudWatch/Datadog queries once you're comfortable.
- Fonts use the system stack on purpose (see comment in `app/layout.tsx`) so `npm run build` works with zero network access — matters once you're building inside Docker/CI runners with restricted egress.
