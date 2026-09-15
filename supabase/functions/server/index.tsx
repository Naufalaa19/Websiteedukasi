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

// ─── KOMENTAR ROUTES ─────────────────────────────────────────────────────────

// GET /comments — fetch all comments
app.get("/make-server-be29dd90/comments", async (c) => {
  try {
    const records = await kv.getByPrefix("comment:");
    const comments = records
      .map((r: string) => { try { return JSON.parse(r); } catch { return null; } })
      .filter(Boolean)
      .sort((a: { createdAt: string }, b: { createdAt: string }) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return c.json({ success: true, comments });
  } catch (err) {
    console.log("Error fetching comments:", err);
    return c.json({ error: `Gagal mengambil komentar: ${err}` }, 500);
  }
});

// POST /comments — add a new comment
app.post("/make-server-be29dd90/comments", async (c) => {
  try {
    const body = await c.req.json();
    const { name, message, category, avatar } = body;
    if (!name?.trim() || !message?.trim()) {
      return c.json({ error: "Nama dan pesan wajib diisi." }, 400);
    }
    const createdAt = new Date().toISOString();
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const comment = {
      id,
      name: String(name).trim(),
      message: String(message).trim(),
      category: String(category || "Pengalaman"),
      avatar: String(avatar || "😊"),
      likes: 0,
      replies: [],
      createdAt,
    };
    await kv.set(`comment:${createdAt}:${id}`, JSON.stringify(comment));
    return c.json({ success: true, comment });
  } catch (err) {
    console.log("Error adding comment:", err);
    return c.json({ error: `Gagal menyimpan komentar: ${err}` }, 500);
  }
});

// POST /comments/like — increment/decrement like count
app.post("/make-server-be29dd90/comments/like", async (c) => {
  try {
    const body = await c.req.json();
    const { commentId, delta } = body; // delta: +1 or -1
    const records = await kv.getByPrefix("comment:");
    for (const r of records) {
      try {
        const parsed = JSON.parse(r);
        if (parsed.id === commentId) {
          const key = `comment:${parsed.createdAt}:${parsed.id}`;
          parsed.likes = Math.max(0, (parsed.likes || 0) + (delta === -1 ? -1 : 1));
          await kv.set(key, JSON.stringify(parsed));
          return c.json({ success: true, likes: parsed.likes });
        }
      } catch { /* skip malformed */ }
    }
    return c.json({ error: "Komentar tidak ditemukan." }, 404);
  } catch (err) {
    console.log("Error liking comment:", err);
    return c.json({ error: `Gagal memproses like: ${err}` }, 500);
  }
});

// POST /comments/reply — add reply to a comment
app.post("/make-server-be29dd90/comments/reply", async (c) => {
  try {
    const body = await c.req.json();
    const { commentId, name, message } = body;
    if (!name?.trim() || !message?.trim()) {
      return c.json({ error: "Nama dan balasan wajib diisi." }, 400);
    }
    const records = await kv.getByPrefix("comment:");
    for (const r of records) {
      try {
        const parsed = JSON.parse(r);
        if (parsed.id === commentId) {
          const key = `comment:${parsed.createdAt}:${parsed.id}`;
          const reply = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: String(name).trim(),
            message: String(message).trim(),
            createdAt: new Date().toISOString(),
          };
          parsed.replies = [...(parsed.replies || []), reply];
          await kv.set(key, JSON.stringify(parsed));
          return c.json({ success: true, reply });
        }
      } catch { /* skip malformed */ }
    }
    return c.json({ error: "Komentar tidak ditemukan." }, 404);
  } catch (err) {
    console.log("Error adding reply:", err);
    return c.json({ error: `Gagal menyimpan balasan: ${err}` }, 500);
  }
});

// DELETE /comments/:id — delete a comment
app.delete("/make-server-be29dd90/comments/:id", async (c) => {
  try {
    const commentId = c.req.param("id");
    const records = await kv.getByPrefix("comment:");
    for (const r of records) {
      try {
        const parsed = JSON.parse(r);
        if (parsed.id === commentId) {
          await kv.delete(`comment:${parsed.createdAt}:${parsed.id}`);
          return c.json({ success: true });
        }
      } catch { /* skip malformed */ }
    }
    return c.json({ error: "Komentar tidak ditemukan." }, 404);
  } catch (err) {
    console.log("Error deleting comment:", err);
    return c.json({ error: `Gagal menghapus komentar: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);