import crypto from "node:crypto";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitBuckets = new Map<string, RateLimitBucket>();

const MERCADOPAGO_ALLOWED_RESOURCE_HOSTS = new Set([
  "api.mercadopago.com",
  "api.mercadolibre.com",
]);

function cleanupExpiredBuckets(now: number) {
  for (const [key, bucket] of rateLimitBuckets.entries()) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(key);
    }
  }
}

export function getClientIp(headers: Headers): string {
  const xForwardedFor = headers.get("x-forwarded-for");
  const xRealIp = headers.get("x-real-ip");

  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return xRealIp?.trim() || "unknown";
}

export function enforceRateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  cleanupExpiredBuckets(now);

  const existing = rateLimitBuckets.get(options.key);

  if (!existing || existing.resetAt <= now) {
    rateLimitBuckets.set(options.key, {
      count: 1,
      resetAt: now + options.windowMs,
    });

    return { allowed: true, retryAfterSeconds: Math.ceil(options.windowMs / 1000) };
  }

  if (existing.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  rateLimitBuckets.set(options.key, existing);

  return {
    allowed: true,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}

type ParsedSignature = {
  ts?: string;
  v1?: string;
};

export function parseMercadoPagoSignatureHeader(signatureHeader: string): ParsedSignature {
  const parts = signatureHeader.split(",");
  const parsed: ParsedSignature = {};

  for (const part of parts) {
    const [rawKey, rawValue] = part.split("=", 2);
    if (!rawKey || !rawValue) continue;

    const key = rawKey.trim();
    const value = rawValue.trim();

    if (key === "ts") parsed.ts = value;
    if (key === "v1") parsed.v1 = value;
  }

  return parsed;
}

function buildMercadoPagoManifest(options: {
  dataId?: string;
  requestId?: string;
  ts?: string;
}): string {
  const chunks: string[] = [];

  if (options.dataId) chunks.push(`id:${options.dataId}`);
  if (options.requestId) chunks.push(`request-id:${options.requestId}`);
  if (options.ts) chunks.push(`ts:${options.ts}`);

  return `${chunks.join(";")};`;
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  const aBuffer = Buffer.from(a, "hex");
  const bBuffer = Buffer.from(b, "hex");

  if (aBuffer.length !== bBuffer.length) return false;

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export function validateMercadoPagoWebhookSignature(options: {
  signatureHeader: string;
  requestIdHeader?: string | null;
  dataId?: string;
  secret: string;
}): boolean {
  const parsed = parseMercadoPagoSignatureHeader(options.signatureHeader);

  if (!parsed.ts || !parsed.v1) {
    return false;
  }

  const manifest = buildMercadoPagoManifest({
    dataId: options.dataId,
    requestId: options.requestIdHeader ?? undefined,
    ts: parsed.ts,
  });

  const expected = crypto
    .createHmac("sha256", options.secret)
    .update(manifest)
    .digest("hex");

  return timingSafeEqualHex(expected, parsed.v1);
}

export function isTrustedMercadoPagoResourceUrl(resourceUrl: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(resourceUrl);
  } catch {
    return false;
  }

  return (
    parsed.protocol === "https:" && MERCADOPAGO_ALLOWED_RESOURCE_HOSTS.has(parsed.hostname)
  );
}

export function sanitizeWebhookHeaders(headers: Headers): Record<string, string> {
  const allowList = new Set([
    "content-type",
    "user-agent",
    "x-request-id",
    "x-signature",
    "x-retry",
    "x-rest-pool-name",
    "x-socket-timeout",
    "x-forwarded-for",
    "x-real-ip",
  ]);

  const sanitized: Record<string, string> = {};
  for (const [key, value] of headers.entries()) {
    if (allowList.has(key.toLowerCase())) {
      sanitized[key.toLowerCase()] = value;
    }
  }

  return sanitized;
}
