import { describe, expect, it } from "vitest";

import {
  applyRateLimit,
  buildRateLimitHeaders,
  getClientIp,
} from "@/lib/rate-limit";

describe("getClientIp", () => {
  it("uses first value from x-forwarded-for", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "10.1.1.1, 10.1.1.2" },
    });

    expect(getClientIp(request)).toBe("10.1.1.1");
  });

  it("falls back to x-real-ip and then unknown", () => {
    const withRealIp = new Request("http://localhost", {
      headers: { "x-real-ip": "192.168.0.9" },
    });
    const withoutHeaders = new Request("http://localhost");

    expect(getClientIp(withRealIp)).toBe("192.168.0.9");
    expect(getClientIp(withoutHeaders)).toBe("unknown");
  });
});

describe("applyRateLimit", () => {
  it("allows requests until limit and then blocks", () => {
    const key = `test:${crypto.randomUUID()}`;
    const config = { windowMs: 30_000, max: 2 };

    const first = applyRateLimit({ key, config });
    const second = applyRateLimit({ key, config });
    const third = applyRateLimit({ key, config });

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.remaining).toBe(0);
    expect(third.retryAfterSeconds).toBeGreaterThan(0);
  });
});

describe("buildRateLimitHeaders", () => {
  it("returns expected rate limit headers", () => {
    const headers = buildRateLimitHeaders({
      allowed: false,
      remaining: 0,
      resetAt: 2_000_000,
      retryAfterSeconds: 45,
    }) as Record<string, string>;

    expect(headers["X-RateLimit-Remaining"]).toBe("0");
    expect(headers["X-RateLimit-Reset"]).toBe("2000");
    expect(headers["Retry-After"]).toBe("45");
  });
});
