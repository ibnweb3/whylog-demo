import { test } from "node:test";
import assert from "node:assert/strict";
import { deliver } from "../src/deliver.js";

test("reports ok for a 200 response", async () => {
  const fetchImpl = async () => ({ ok: true, status: 200 });
  assert.deepEqual(await deliver("http://x", { id: 1 }, { fetchImpl }), { ok: true, status: 200 });
});

test("passes an abort signal so a hung endpoint cannot block forever", async () => {
  let seen;
  const fetchImpl = async (_url, init) => { seen = init.signal; return { ok: true, status: 200 }; };
  await deliver("http://x", { id: 1 }, { fetchImpl });
  assert.ok(seen instanceof AbortSignal);
});

test("retries a 500 and stops once it succeeds", async () => {
  const statuses = [500, 500, 200];
  let calls = 0;
  const fetchImpl = async () => { const s = statuses[calls++]; return { ok: s < 300, status: s }; };
  const out = await deliver("http://x", { id: 1 }, { fetchImpl, wait: async () => {} });
  assert.deepEqual(out, { ok: true, status: 200 });
  assert.equal(calls, 3);
});

test("does not retry a 400", async () => {
  let calls = 0;
  const fetchImpl = async () => { calls++; return { ok: false, status: 400 }; };
  const out = await deliver("http://x", { id: 1 }, { fetchImpl, wait: async () => {} });
  assert.deepEqual(out, { ok: false, status: 400 });
  assert.equal(calls, 1);
});
