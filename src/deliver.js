const TIMEOUT_MS = 5000;

export async function deliver(url, event, { fetchImpl = fetch } = {}) {
  const res = await fetchImpl(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(event),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  return { ok: res.ok, status: res.status };
}
