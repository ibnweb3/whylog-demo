import { test } from "node:test";
import assert from "node:assert/strict";
import { deliver } from "../src/deliver.js";

test("reports ok for a 200 response", async () => {
  const fetchImpl = async () => ({ ok: true, status: 200 });
  assert.deepEqual(await deliver("http://x", { id: 1 }, { fetchImpl }), { ok: true, status: 200 });
});
