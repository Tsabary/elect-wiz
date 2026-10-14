/**
 * Prints the anonymous counts added up over every day: surveys started, results
 * shown, and a table of all researched parties ranked by how often each came
 * 1st, 2nd, 3rd and 4th.
 *
 * Usage: pnpm tally:report [--he] [--days]
 *   --he    party names in Hebrew
 *   --days  also print surveys started and results per day
 *
 * Reads the counter store from `.env.local` (or the environment): the same
 * settings the site uses, `KV_REST_API_URL` with `KV_REST_API_READ_ONLY_TOKEN`
 * when present (it only reads), else the read-write token. Nothing is changed.
 */
import dns from "node:dns";
import { readFileSync } from "node:fs";
import path from "node:path";
import { buildTallyReport, formatTallyReport, type DayCounts } from "../lib/tally/report";

// Some home networks are slow to reach the store over IPv6.
dns.setDefaultResultOrder("ipv4first");

function loadEnvFile(file: string) {
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
    }
  } catch {
    /* no file: rely on the environment */
  }
}

async function main() {
  loadEnvFile(path.join(process.cwd(), ".env.local"));
  const env = process.env;
  const url = (env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL)?.trim().replace(/\/$/, "");
  const token = (
    env.KV_REST_API_READ_ONLY_TOKEN ||
    env.UPSTASH_REDIS_REST_TOKEN ||
    env.KV_REST_API_TOKEN
  )?.trim();
  if (!url || !token) {
    console.error(
      "No counter store settings found. Put KV_REST_API_URL and KV_REST_API_TOKEN in .env.local.",
    );
    process.exit(1);
  }

  const call = async (body: unknown) => {
    for (let attempt = 1; ; attempt++) {
      try {
        const res = await fetch(`${url}/pipeline`, {
          method: "POST",
          headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(20_000),
        });
        if (!res.ok) throw new Error(`the store answered ${res.status}`);
        return (await res.json()) as { result: unknown; error?: string }[];
      } catch (e) {
        if (attempt >= 3) throw e;
      }
    }
  };

  // Find every day's key.
  const keys: string[] = [];
  let cursor = "0";
  do {
    const [{ result }] = await call([["SCAN", cursor, "MATCH", "tally:*", "COUNT", 1000]]);
    const [next, found] = result as [string, string[]];
    keys.push(...found);
    cursor = next;
  } while (cursor !== "0");

  const byDay: Record<string, DayCounts> = {};
  if (keys.length) {
    const replies = await call(keys.map((k) => ["HGETALL", k]));
    keys.forEach((key, i) => {
      const flat = replies[i].result as string[];
      const counts: DayCounts = {};
      for (let j = 0; j < flat.length; j += 2) counts[flat[j]] = Number(flat[j + 1]);
      byDay[key.slice("tally:".length)] = counts;
    });
  }

  const registry = JSON.parse(
    readFileSync(path.join(process.cwd(), "content/registry/parties.json"), "utf8"),
  ) as { parties: { id: string; tier: string; name: { en: string; he: string } }[] };
  const researched = registry.parties.filter((p) => p.tier === "researched");
  const lang = process.argv.includes("--he") ? "he" : "en";
  const names = new Map(registry.parties.map((p) => [p.id, p.name[lang]]));

  console.log(
    formatTallyReport(
      buildTallyReport(
        byDay,
        researched.map((p) => p.id),
      ),
      (id) => names.get(id) ?? id,
      { showDays: process.argv.includes("--days") },
    ),
  );
}

main().catch((e) => {
  console.error(`Could not read the counts: ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
