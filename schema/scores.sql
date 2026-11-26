-- Game leaderboard + per-IP rate limit for POST /api/scores
CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_scores_player ON scores (player_name);
CREATE INDEX IF NOT EXISTS idx_scores_best ON scores (score DESC);

CREATE TABLE IF NOT EXISTS score_rate_limits (
  ip TEXT PRIMARY KEY,
  last_at INTEGER NOT NULL
);
