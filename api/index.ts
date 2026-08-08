let app: any;
let initError: string | null = null;

try {
  const server = await import('../server.js');
  app = server.default || server;
} catch (e: any) {
  initError = e?.message || String(e);
  console.error("FATAL: Failed to load server module:", e);
}

export default function handler(req: any, res: any) {
  if (initError || !app) {
    return res.status(500).json({
      ok: false,
      msg: `Server failed to initialize: ${initError || "Unknown error"}`,
      hint: "Check that all environment variables are set and dependencies are installed."
    });
  }
  return app(req, res);
}
