type RateLimitConfig = {
  windowMs: number;
  max: number;
};

type Entry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

const store = new Map<string, Entry>();

let lastSweep = 0;

function sweepExpired(now: number) {
  // barrido simple para evitar crecimiento infinito en memoria
  if (now - lastSweep < 60_000) return;
  lastSweep = now;

  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) return xRealIp;

  return "unknown";
}

export function applyRateLimit(options: {
  key: string;
  config: RateLimitConfig;
}): RateLimitResult {
  const now = Date.now();
  sweepExpired(now);

  const existing = store.get(options.key);
  const windowMs = options.config.windowMs;
  const max = options.config.max;

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(options.key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: Math.max(max - 1, 0),
      resetAt,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (existing.count >= max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000),
      ),
    };
  }

  existing.count += 1;
  store.set(options.key, existing);

  return {
    allowed: true,
    remaining: Math.max(max - existing.count, 0),
    resetAt: existing.resetAt,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}

export function buildRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.floor(result.resetAt / 1000)),
    "Retry-After": String(result.retryAfterSeconds),
  };
}
