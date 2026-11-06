const TIMEOUT_MS = 5000;
const MAX_ATTEMPTS = 3;
const BACKOFF_MS = 200;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function deliver(url, event, { fetchImpl = fetch, wait = sleep } = {}) {
  let last;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetchImpl(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(event),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      last = { ok: res.ok, status: res.status };
      if (res.ok || res.status < 500) return last;
    } catch (err) {
      last = { ok: false, status: 0 };
    }
    if (attempt < MAX_ATTEMPTS) await wait(BACKOFF_MS * 2 ** (attempt - 1));
  }
  return last;
}
