import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

const ADMIN_PASSWORD = "karanggigi2025";

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-be29dd90/health", (c) => {
  return c.json({ status: "ok" });
});

// POST /visitors — Save a new visitor entry
app.post("/make-server-be29dd90/visitors", async (c) => {
  try {
    const body = await c.req.json();
    const { name, institution, city, email } = body;

    if (!name || !city) {
      return c.json({ error: "Nama dan kota wajib diisi." }, 400);
    }

    const timestamp = new Date().toISOString();
    const randomId = Math.random().toString(36).substring(2, 10);
    const key = `visitor:${timestamp}:${randomId}`;

    const visitor = {
      name: String(name).trim(),
      institution: String(institution || "").trim(),
      city: String(city).trim(),
      email: String(email || "").trim(),
      visitedAt: timestamp,
    };

    await kv.set(key, JSON.stringify(visitor));

    return c.json({ success: true, message: "Terima kasih telah berkunjung!" });
  } catch (err) {
    console.log("Error saving visitor:", err);
    return c.json({ error: `Gagal menyimpan data pengunjung: ${err}` }, 500);
  }
});

// GET /visitors — Get all visitors (requires admin password)
app.get("/make-server-be29dd90/visitors", async (c) => {
  try {
    const password = c.req.query("password");
    if (password !== ADMIN_PASSWORD) {
      return c.json({ error: "Password admin salah." }, 401);
    }

    const records = await kv.getByPrefix("visitor:");
    const visitors = records
      .map((r: string) => {
        try { return JSON.parse(r); } catch { return null; }
      })
      .filter(Boolean)
      .sort((a: { visitedAt: string }, b: { visitedAt: string }) =>
        new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime()
      );

    return c.json({ success: true, visitors, total: visitors.length });
  } catch (err) {
    console.log("Error fetching visitors:", err);
    return c.json({ error: `Gagal mengambil data pengunjung: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);