import { NextResponse } from "next/server";
import os from "node:os";

type HealthStatus = "healthy" | "degraded" | "unhealthy";

type HealthResponse = {
  status: HealthStatus;
  timestamp: string;
  uptime: {
    seconds: number;
    human: string;
  };
  version: {
    node: string;
    next: string;
    app: string;
    v8: string;
  };
  platform: {
    type: string;
    release: string;
    arch: string;
    hostname: string;
    machine: string;
    os: string;
    loadAverage: [number, number, number];
    cpu: {
      model: string;
      cores: number;
      speed: string;
    };
    memory: {
      total: string;
      free: string;
      used: string;
      usagePercent: number;
      heapUsed: string;
      heapTotal: string;
      heapPercent: number;
      rss: string;
      external: string;
    };
    network: Record<string, string>;
  };
  process: {
    pid: number;
    ppid: number;
    nodeEnv: string;
    cwd: string;
    execPath: string;
    args: string[];
    version: string;
  };
  environment: string;
  services: {
    database: "up" | "down" | "skipped";
  };
};

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(" ");
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

function getNetworkInterfaces(): Record<string, string> {
  const interfaces = os.networkInterfaces();
  const result: Record<string, string> = {};

  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;

    const ipv4 = addrs.find((addr) => addr.family === "IPv4" && !addr.internal);

    if (ipv4) {
      result[name] = ipv4.address;
    }
  }

  return result;
}

async function checkDatabase(): Promise<"up" | "down" | "skipped"> {
  try {
    const { getMySqlPool } = await import("@/config/database");
    const pool = getMySqlPool("primary");
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return "up";
  } catch {
    return "down";
  }
}

export async function GET() {
  const startTime = Date.now();

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memoryPercent = Math.round((usedMem / totalMem) * 100);

  const memUsage = process.memoryUsage();
  const heapPercent = Math.round(
    (memUsage.heapUsed / memUsage.heapTotal) * 100,
  );

  const cpus = os.cpus();
  const loadAvg = os.loadavg();

  let dbStatus: "up" | "down" | "skipped" = "skipped";

  if (process.env.MYSQL_PRIMARY_URL) {
    dbStatus = await checkDatabase();
  }

  const status: HealthStatus = dbStatus === "down" ? "unhealthy" : "healthy";

  const responseTime = Date.now() - startTime;

  const body: HealthResponse = {
    status,
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(process.uptime()),
      human: formatUptime(process.uptime()), //
    },
    version: {
      node: process.version,
      next: process.env.__NEXT_VERSION || "unknown",
      app: process.env.npm_package_version || "0.1.0",
      v8: process.versions.v8,
    },
    platform: {
      type: os.type(),
      release: os.release(),
      arch: os.arch(),
      hostname: os.hostname(),
      machine: os.machine(),
      os: `${os.type()} ${os.release()} (${os.arch()})`,
      loadAverage: [
        parseFloat(loadAvg[0].toFixed(2)),
        parseFloat(loadAvg[1].toFixed(2)),
        parseFloat(loadAvg[2].toFixed(2)),
      ],
      cpu: {
        model: cpus[0]?.model || "unknown",
        cores: cpus.length,
        speed: `${cpus[0]?.speed || 0} MHz`,
      },
      memory: {
        total: formatBytes(totalMem),
        free: formatBytes(freeMem),
        used: formatBytes(usedMem),
        usagePercent: memoryPercent,
        heapUsed: formatBytes(memUsage.heapUsed),
        heapTotal: formatBytes(memUsage.heapTotal),
        heapPercent,
        rss: formatBytes(memUsage.rss),
        external: formatBytes(memUsage.external),
      },
      network: getNetworkInterfaces(),
    },
    process: {
      pid: process.pid,
      ppid: process.ppid || 0,
      nodeEnv: process.env.NODE_ENV || "development",
      cwd: process.cwd(),
      execPath: process.execPath,
      args: process.argv.slice(0, 3),
      version: process.version,
    },
    environment: process.env.NODE_ENV || "development",
    services: {
      database: dbStatus,
    },
  };

  const statusCode = status === "healthy" ? 200 : 503;

  return NextResponse.json(body, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "X-Response-Time": `${responseTime}ms`,
    },
  });
}
