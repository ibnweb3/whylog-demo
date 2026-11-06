// Posts one event to a merchant endpoint. Returns { ok, status }.
export async function deliver(url, event, { fetchImpl = fetch } = {}) {
  const res = await fetchImpl(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(event),
  });
  return { ok: res.ok, status: res.status };
}
