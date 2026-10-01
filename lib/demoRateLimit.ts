type DemoRequestStore = Map<string, number[]>;
type DemoGlobal = typeof globalThis & { __pathwayDemoRequests?: DemoRequestStore };

const globalStore = globalThis as DemoGlobal;
const requestsByAddress = globalStore.__pathwayDemoRequests || (globalStore.__pathwayDemoRequests = new Map<string, number[]>());
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

export function getDemoClientAddress(headers: Headers) {
  return headers.get("x-real-ip") || headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function consumeDemoRequest(address: string, now = Date.now()) {
  const recentRequests = (requestsByAddress.get(address) || []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recentRequests.length >= MAX_REQUESTS) {
    requestsByAddress.set(address, recentRequests);
    return false;
  }

  recentRequests.push(now);
  requestsByAddress.set(address, recentRequests);

  if (requestsByAddress.size > 5000) {
    for (const [key, timestamps] of requestsByAddress) {
      if (timestamps.every((timestamp) => now - timestamp >= WINDOW_MS)) requestsByAddress.delete(key);
    }
  }

  return true;
}

export function resetDemoRequests(address: string) {
  let removed = 0;
  for (const key of requestsByAddress.keys()) {
    if (key.endsWith(`:${address}`)) {
      requestsByAddress.delete(key);
      removed += 1;
    }
  }
  return removed;
}
