type RateLimitEntry = { count: number; resetAt: number };

const store = new Map<string, RateLimitEntry>();
const MAX_KEYS = 10_000;

function cleanup(now: number) {
  if (store.size <= MAX_KEYS) return;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  cleanup(now);

  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

export function getRateLimitConfig() {
  return {
    teklifPerHour: Number(process.env.RATE_LIMIT_TEKLIF_PER_HOUR ?? 5),
    yanitlaPerHour: Number(process.env.RATE_LIMIT_YANITLA_PER_HOUR ?? 20),
  };
}
