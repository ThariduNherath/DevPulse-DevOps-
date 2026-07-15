export type ServiceStatus = "healthy" | "degraded" | "critical";

export interface ServiceMetric {
  id: string;
  name: string;
  region: string;
  status: ServiceStatus;
  cpu: number;
  mem: number;
  latencyMs: number;
  uptimeSec: number;
  history: number[]; // last N cpu readings, for the trace
}

export interface Deployment {
  id: string;
  service: string;
  sha: string;
  branch: string;
  status: "success" | "failed" | "running";
  durationSec: number;
  timestamp: number;
  author: string;
}

const SERVICE_DEFS = [
  { id: "auth-api", name: "auth-api", region: "ap-south-1" },
  { id: "payments-gw", name: "payments-gw", region: "eu-west-1" },
  { id: "checkout-svc", name: "checkout-svc", region: "ap-south-1" },
  { id: "search-index", name: "search-index", region: "us-east-1" },
  { id: "media-cdn", name: "media-cdn", region: "global" },
  { id: "notif-worker", name: "notif-worker", region: "ap-south-1" },
];

const HISTORY_LEN = 24;

// module-level in-memory state so metrics drift realistically across polls
const state = new Map<string, ServiceMetric>();
let bootedAt = Date.now();

function seedRandom(seedStr: string) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function initState() {
  SERVICE_DEFS.forEach((def) => {
    const rand = seedRandom(def.id);
    const baseCpu = 20 + rand() * 30;
    const history = Array.from({ length: HISTORY_LEN }, () => baseCpu + (rand() - 0.5) * 8);
    state.set(def.id, {
      id: def.id,
      name: def.name,
      region: def.region,
      status: "healthy",
      cpu: baseCpu,
      mem: 30 + rand() * 25,
      latencyMs: 40 + rand() * 60,
      uptimeSec: 0,
      history,
    });
  });
  bootedAt = Date.now();
}

initState();

// occasionally one service gets an incident window to make the dashboard feel alive
let incidentService: string | null = null;
let incidentUntil = 0;

function maybeTriggerIncident() {
  if (Date.now() > incidentUntil && Math.random() < 0.12) {
    const pool = SERVICE_DEFS.filter((s) => s.id !== "media-cdn");
    incidentService = pool[Math.floor(Math.random() * pool.length)].id;
    incidentUntil = Date.now() + (15000 + Math.random() * 20000);
  }
  if (Date.now() > incidentUntil) {
    incidentService = null;
  }
}

export function tickMetrics(): ServiceMetric[] {
  maybeTriggerIncident();
  const now = Date.now();

  const results: ServiceMetric[] = [];
  state.forEach((svc, id) => {
    const inIncident = id === incidentService;
    const drift = (Math.random() - 0.5) * (inIncident ? 18 : 5);
    let cpu = clamp(svc.cpu + drift, 4, 99);
    let mem = clamp(svc.mem + (Math.random() - 0.5) * (inIncident ? 6 : 2), 8, 97);
    let latencyMs = clamp(svc.latencyMs + (Math.random() - 0.5) * (inIncident ? 40 : 8), 12, 900);

    if (inIncident) {
      cpu = clamp(cpu + 25, 4, 99);
      latencyMs = clamp(latencyMs + 250, 12, 950);
    }

    let status: ServiceStatus = "healthy";
    if (cpu > 85 || latencyMs > 500) status = "critical";
    else if (cpu > 65 || latencyMs > 250) status = "degraded";

    const history = [...svc.history.slice(1), cpu];
    const uptimeSec = Math.floor((now - bootedAt) / 1000);

    const updated: ServiceMetric = {
      ...svc,
      cpu,
      mem,
      latencyMs,
      status,
      history,
      uptimeSec,
    };
    state.set(id, updated);
    results.push(updated);
  });

  return results;
}

// ---- deployment log (seeded, append-only-ish, simple simulation) ----

const AUTHORS = ["nick.dev", "tharidu.n", "ci-bot", "pasindu.r"];
const BRANCHES = ["main", "develop", "hotfix/checkout", "feat/search-v2"];

let deployments: Deployment[] = Array.from({ length: 8 }, (_, i) => {
  const svc = SERVICE_DEFS[i % SERVICE_DEFS.length];
  const status: Deployment["status"] = i % 7 === 0 ? "failed" : "success";
  return {
    id: `dep-${1000 + i}`,
    service: svc.name,
    sha: Math.random().toString(16).slice(2, 9),
    branch: BRANCHES[i % BRANCHES.length],
    status,
    durationSec: 30 + Math.floor(Math.random() * 180),
    timestamp: Date.now() - (8 - i) * 1000 * 60 * 40,
    author: AUTHORS[i % AUTHORS.length],
  };
});

export function getDeployments(): Deployment[] {
  // small chance of a fresh deployment landing, most recent first
  if (Math.random() < 0.08) {
    const svc = SERVICE_DEFS[Math.floor(Math.random() * SERVICE_DEFS.length)];
    const newDep: Deployment = {
      id: `dep-${Math.floor(Math.random() * 9000 + 1000)}`,
      service: svc.name,
      sha: Math.random().toString(16).slice(2, 9),
      branch: BRANCHES[Math.floor(Math.random() * BRANCHES.length)],
      status: Math.random() < 0.85 ? "success" : "failed",
      durationSec: 20 + Math.floor(Math.random() * 200),
      timestamp: Date.now(),
      author: AUTHORS[Math.floor(Math.random() * AUTHORS.length)],
    };
    deployments = [newDep, ...deployments].slice(0, 12);
  }
  return deployments;
}
