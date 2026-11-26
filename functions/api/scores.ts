type Env = { DB: D1Database };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const clientIp = (request: Request) =>
  request.headers.get("CF-Connecting-IP") ||
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  "unknown";

const cleanName = (value: unknown) => {
  if (typeof value !== "string") return null;
  const name = value.replace(/\s+/g, " ").trim();
  if (!name || name.length > 20) return null;
  return name;
};

const MAX_SCORE = 300;

const cleanScore = (value: unknown) => {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > MAX_SCORE) return null;
  return value;
};

const RATE_MS = 12_000;

const topSql = (today: boolean) => {
  const scoped = today
    ? `SELECT * FROM scores WHERE date(created_at) = date('now')`
    : `SELECT * FROM scores`;
  return `WITH scoped AS (${scoped})
  SELECT s.player_name, s.score
  FROM scoped s
  INNER JOIN (
    SELECT MIN(id) AS id
    FROM scoped
    WHERE (lower(trim(player_name)), score) IN (
      SELECT lower(trim(player_name)), MAX(score)
      FROM scoped
      GROUP BY lower(trim(player_name))
    )
    GROUP BY lower(trim(player_name))
  ) t ON s.id = t.id
  ORDER BY s.score DESC, s.id ASC
  LIMIT 10`;
};

// Creates tables if D1 is bound but schema has not been applied yet.
const ensureSchema = (db: D1Database) =>
  db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT NOT NULL,
      score INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_scores_player ON scores (player_name)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_scores_best ON scores (score DESC)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS score_rate_limits (
      ip TEXT PRIMARY KEY,
      last_at INTEGER NOT NULL
    )`),
  ]);

// GET /api/scores — top 10, one best score per player (case-insensitive name).
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) return json({ error: "Leaderboard is not connected yet.", code: "no_d1" }, 503);
  const period = new URL(request.url).searchParams.get("period");
  const today = period === "today";
  try {
    await ensureSchema(env.DB);
    const { results } = await env.DB.prepare(topSql(today)).all<{ player_name: string; score: number }>();
    return json({ scores: results ?? [], period: today ? "today" : "all" });
  } catch {
    return json({ error: "Could not load scores.", code: "query_failed" }, 500);
  }
};

// POST /api/scores — save one score after validating name, score range, and IP rate limit.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) return json({ error: "Leaderboard is not connected yet.", code: "no_d1" }, 503);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Send JSON with player_name and score." }, 400);
  }

  const data = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const player_name = cleanName(data.player_name);
  const score = cleanScore(data.score);
  if (!player_name) return json({ error: "Name must be 1–20 characters." }, 400);
  if (score === null) return json({ error: `Score must be a whole number from 0 to ${MAX_SCORE}.` }, 400);

  const ip = clientIp(request);
  const now = Date.now();

  try {
    await ensureSchema(env.DB);

    const prev = await env.DB.prepare(
      "SELECT MAX(score) AS best FROM scores WHERE lower(trim(player_name)) = lower(?)"
    )
      .bind(player_name)
      .first<{ best: number | null }>();
    const previous_best = typeof prev?.best === "number" ? prev.best : null;

    const row = await env.DB.prepare("SELECT last_at FROM score_rate_limits WHERE ip = ?")
      .bind(ip)
      .first<{ last_at: number }>();
    if (row && now - row.last_at < RATE_MS) {
      return json({ error: "Please wait a few seconds before submitting again." }, 429);
    }

    await env.DB.batch([
      env.DB.prepare("INSERT INTO scores (player_name, score) VALUES (?, ?)").bind(player_name, score),
      env.DB.prepare(
        "INSERT INTO score_rate_limits (ip, last_at) VALUES (?, ?) ON CONFLICT(ip) DO UPDATE SET last_at = excluded.last_at"
      ).bind(ip, now),
    ]);

    const better = await env.DB.prepare(
      `SELECT COUNT(*) AS n FROM (
         SELECT MAX(score) AS best FROM scores GROUP BY lower(trim(player_name))
       ) WHERE best > ?`
    )
      .bind(score)
      .first<{ n: number }>();
    const rank = (better?.n ?? 0) + 1;
    const high_score = previous_best === null || score > previous_best;

    return json({ ok: true, player_name, score, rank, previous_best, high_score });
  } catch {
    return json({ error: "Could not save that score.", code: "query_failed" }, 500);
  }
};
