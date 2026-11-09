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
    allowHeaders: ["Content-Type", "Authorization", "X-User-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// POST /visitors — Save a new visitor entry
app.post("/visitors", async (c) => {
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
app.get("/visitors", async (c) => {
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
app.get("/comments", async (c) => {
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
app.post("/comments", async (c) => {
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
app.post("/comments/like", async (c) => {
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
app.post("/comments/reply", async (c) => {
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
app.delete("/comments/:id", async (c) => {
  try {
    const commentId = c.req.param("id");
    const records = await kv.getByPrefix("comment:");
    for (const r of records) {
      try {
        const parsed = JSON.parse(r);
        if (parsed.id === commentId) {
          await kv.del(`comment:${parsed.createdAt}:${parsed.id}`);
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

// ─── AKUN, LOGIN & NILAI PRETEST/POSTTEST ───────────────────────────────────

const parse = (r: unknown) => {
  try { return typeof r === "string" ? JSON.parse(r) : r; } catch { return null; }
};

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const hashPw = (email: string, pw: string) => sha256(`kgedu::${email}::${pw}`);
const publicUser = (u: any) => ({ id: u.id, name: u.name, email: u.email, institution: u.institution, city: u.city, createdAt: u.createdAt });

async function startSession(user: any, isRegister = false) {
  const token = crypto.randomUUID() + crypto.randomUUID();
  await kv.set(`session:${token}`, JSON.stringify({ userId: user.id, createdAt: new Date().toISOString() }));
  const at = new Date().toISOString();
  await kv.set(`login:${at}:${user.id}`, JSON.stringify({ userId: user.id, name: user.name, email: user.email, at, isRegister }));
  return token;
}

async function userFromRequest(c: any) {
  const token = c.req.header("X-User-Token");
  if (!token) return null;
  const sess = parse(await kv.get(`session:${token}`));
  if (!sess?.userId) return null;
  return parse(await kv.get(`user:${sess.userId}`));
}

// POST /auth/register
app.post("/auth/register", async (c) => {
  try {
    const { name, email, password, institution, city } = await c.req.json();
    const mail = String(email || "").trim().toLowerCase();
    if (!name?.trim() || !mail.includes("@")) return c.json({ error: "Nama dan email yang valid wajib diisi." }, 400);
    if (!password || String(password).length < 6) return c.json({ error: "Kata sandi minimal 6 karakter." }, 400);
    const existing = parse(await kv.get(`useremail:${mail}`));
    if (existing) return c.json({ error: "Email sudah terdaftar. Silakan masuk." }, 409);
    const id = crypto.randomUUID();
    const user = {
      id, name: String(name).trim(), email: mail,
      institution: String(institution || "").trim(), city: String(city || "").trim(),
      passwordHash: await hashPw(mail, String(password)),
      createdAt: new Date().toISOString(),
    };
    await kv.set(`user:${id}`, JSON.stringify(user));
    await kv.set(`useremail:${mail}`, JSON.stringify({ id }));
    const token = await startSession(user, true);
    return c.json({ success: true, token, user: publicUser(user) });
  } catch (err) {
    console.log("Error register:", err);
    return c.json({ error: `Gagal mendaftar: ${err}` }, 500);
  }
});

// POST /auth/login
app.post("/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const mail = String(email || "").trim().toLowerCase();
    const ref = parse(await kv.get(`useremail:${mail}`));
    const user = ref?.id ? parse(await kv.get(`user:${ref.id}`)) : null;
    if (!user || user.passwordHash !== (await hashPw(mail, String(password || "")))) {
      return c.json({ error: "Email atau kata sandi salah." }, 401);
    }
    const token = await startSession(user);
    return c.json({ success: true, token, user: publicUser(user) });
  } catch (err) {
    console.log("Error login:", err);
    return c.json({ error: `Gagal masuk: ${err}` }, 500);
  }
});

// GET /auth/me
app.get("/auth/me", async (c) => {
  const user = await userFromRequest(c);
  if (!user) return c.json({ error: "Sesi berakhir." }, 401);
  return c.json({ success: true, user: publicUser(user) });
});

// POST /auth/logout
app.post("/auth/logout", async (c) => {
  const token = c.req.header("X-User-Token");
  if (token) await kv.del(`session:${token}`);
  return c.json({ success: true });
});

// POST /results — simpan nilai pretest / posttest
app.post("/results", async (c) => {
  try {
    const user = await userFromRequest(c);
    if (!user) return c.json({ error: "Silakan masuk terlebih dahulu." }, 401);
    const { type, score, total, answers } = await c.req.json();
    if (type !== "pretest" && type !== "posttest") return c.json({ error: "Jenis tes tidak valid." }, 400);
    const at = new Date().toISOString();
    const result = {
      userId: user.id, name: user.name, email: user.email, type,
      score: Number(score), total: Number(total) || 40, answers: answers || {}, at,
    };
    await kv.set(`result:${type}:${user.id}:${at}`, JSON.stringify(result));
    return c.json({ success: true, result });
  } catch (err) {
    console.log("Error saving result:", err);
    return c.json({ error: `Gagal menyimpan nilai: ${err}` }, 500);
  }
});

// GET /results/me — nilai milik pengguna yang login
app.get("/results/me", async (c) => {
  try {
    const user = await userFromRequest(c);
    if (!user) return c.json({ error: "Sesi berakhir." }, 401);
    const rows = (await kv.getByPrefix("result:")).map(parse).filter((r: any) => r && r.userId === user.id);
    rows.sort((a: any, b: any) => a.at.localeCompare(b.at));
    return c.json({ success: true, results: rows.map(({ answers, ...r }: any) => r) });
  } catch (err) {
    return c.json({ error: `Gagal mengambil nilai: ${err}` }, 500);
  }
});

// GET /admin/report — rekap responden (butuh password admin)
app.get("/admin/report", async (c) => {
  try {
    if (c.req.query("password") !== ADMIN_PASSWORD) return c.json({ error: "Password admin salah." }, 401);
    const users = (await kv.getByPrefix("user:")).map(parse).filter((u: any) => u && u.email);
    const logins = (await kv.getByPrefix("login:")).map(parse).filter(Boolean);
    const results = (await kv.getByPrefix("result:")).map(parse).filter(Boolean);
    const rows = users.map((u: any) => {
      const myLogins = logins.filter((l: any) => l.userId === u.id).sort((a: any, b: any) => b.at.localeCompare(a.at));
      const mine = results.filter((r: any) => r.userId === u.id).sort((a: any, b: any) => a.at.localeCompare(b.at));
      const pre = mine.filter((r: any) => r.type === "pretest");
      const post = mine.filter((r: any) => r.type === "posttest");
      const slim = (r: any) => (r ? { score: r.score, total: r.total, at: r.at } : null);
      return {
        id: u.id, name: u.name, email: u.email, institution: u.institution, city: u.city,
        registeredAt: u.createdAt,
        loginCount: myLogins.length,
        lastLogin: myLogins[0]?.at || null,
        pretest: slim(pre[0]),
        posttest: slim(post[post.length - 1]),
        posttestAttempts: post.length,
      };
    }).sort((a: any, b: any) => (b.lastLogin || "").localeCompare(a.lastLogin || ""));
    const loginLog = logins.sort((a: any, b: any) => b.at.localeCompare(a.at)).slice(0, 300);
    return c.json({ success: true, rows, loginLog });
  } catch (err) {
    console.log("Error report:", err);
    return c.json({ error: `Gagal membuat laporan: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);
