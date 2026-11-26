// GET /api/health — cheap uptime check so we know Pages Functions are live.
export const onRequestGet = () =>
  new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
