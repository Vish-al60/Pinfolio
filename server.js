const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const path = require("path");

const ROOT = __dirname;

function loadEnvFile() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  });
}

loadEnvFile();

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(ROOT, "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const HAS_SUPABASE_CONFIG =
  SUPABASE_URL &&
  SUPABASE_SERVICE_ROLE_KEY &&
  !SUPABASE_URL.includes("your-project-ref") &&
  !SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role");
const DB_MODE =
  process.env.PINFOLIO_DB_MODE ||
  (HAS_SUPABASE_CONFIG ? "supabase" : "local");
const SUPABASE_REST_BASE = SUPABASE_URL ? `${SUPABASE_URL}/rest/v1` : "";
const SUPABASE_HEADERS = HAS_SUPABASE_CONFIG
  ? {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    }
  : null;
const TABLES = {
  users: "pinfolio_accounts",
  sessions: "pinfolio_sessions",
};
const FEEDBACK_TO_EMAIL = process.env.FEEDBACK_TO_EMAIL || "vish.chouhan60@gmail.com";
const FEEDBACK_FROM_EMAIL = process.env.FEEDBACK_FROM_EMAIL || "Pinfolio Feedback <onboarding@resend.dev>";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

const DEFAULT_DATA = {
  users: {},
  sessions: {},
};

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

function ensureDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
  }
}

function readDb() {
  ensureDb();
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch {
    return { ...DEFAULT_DATA };
  }
}

function writeDb(db) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function usingSupabase() {
  return DB_MODE === "supabase" && HAS_SUPABASE_CONFIG && SUPABASE_HEADERS;
}

async function supabaseRequest(pathname, options = {}) {
  if (!usingSupabase()) {
    throw new Error("Supabase configuration is missing.");
  }

  const response = await fetch(`${SUPABASE_REST_BASE}${pathname}`, {
    ...options,
    headers: {
      ...SUPABASE_HEADERS,
      ...(options.headers || {}),
    },
  });

  const raw = await response.text();
  let data = null;

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }
  }

  if (!response.ok) {
    const detail =
      Array.isArray(data) && data[0]?.message
        ? data[0].message
        : data?.message || data?.error || raw || response.statusText;
    throw new Error(detail || "Database request failed");
  }

  return data;
}

function firstRecord(data) {
  return Array.isArray(data) ? data[0] || null : data;
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 25 * 1024 * 1024) {
        reject(new Error("Request too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function normalizeUserName(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 28);
}

function userIdFromName(name) {
  return normalizeUserName(name).toLowerCase();
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase().slice(0, 120);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
}

function createSession(db, userId) {
  const token = crypto.randomBytes(32).toString("hex");
  db.sessions[token] = {
    createdAt: Date.now(),
    userId,
  };
  return token;
}

async function supabaseCreateSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const now = new Date().toISOString();
  await supabaseRequest(`/${TABLES.sessions}`, {
    method: "POST",
    body: JSON.stringify({
      token,
      user_id: userId,
      created_at: now,
      last_used_at: now,
    }),
  });
  return token;
}

async function supabaseGetUserByUserId(userId) {
  const data = await supabaseRequest(
    `/${TABLES.users}?user_id=eq.${encodeURIComponent(userId)}&select=user_id,username,password_hash,salt,data`,
    { method: "GET", headers: { Prefer: "return=representation" } },
  );
  return firstRecord(data);
}

async function supabaseGetSession(token) {
  const data = await supabaseRequest(
    `/${TABLES.sessions}?token=eq.${encodeURIComponent(token)}&select=token,user_id,last_used_at`,
    { method: "GET", headers: { Prefer: "return=representation" } },
  );
  return firstRecord(data);
}

async function supabaseDeleteSession(token) {
  await supabaseRequest(`/${TABLES.sessions}?token=eq.${encodeURIComponent(token)}`, {
    method: "DELETE",
  });
}

async function supabaseUpdateLastUsed(token) {
  await supabaseRequest(`/${TABLES.sessions}?token=eq.${encodeURIComponent(token)}`, {
    method: "PATCH",
    body: JSON.stringify({ last_used_at: new Date().toISOString() }),
  });
}

function getUserFromRequest(req, db) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const session = db.sessions[token];
  if (!session) return null;
  const user = db.users[session.userId];
  if (!user) return null;
  return { token, user, userId: session.userId };
}

async function sendFeedbackEmail({ name, email, review }) {
  if (!RESEND_API_KEY) {
    throw new Error("Feedback email is not configured. Add RESEND_API_KEY in deployment.");
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeReview = escapeHtml(review).replace(/\n/g, "<br />");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FEEDBACK_FROM_EMAIL,
      to: [FEEDBACK_TO_EMAIL],
      reply_to: email,
      subject: `New Pinfolio feedback from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #27191a; line-height: 1.55;">
          <h2 style="margin: 0 0 12px;">New Pinfolio feedback</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>User email:</strong> ${safeEmail}</p>
          <p><strong>Review:</strong></p>
          <div style="padding: 14px; background: #fff5f3; border-radius: 10px;">${safeReview}</div>
        </div>
      `,
      text: `New Pinfolio feedback\n\nName: ${name}\nUser email: ${email}\n\nReview:\n${review}`,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Feedback email could not be sent.");
  }

  return data;
}

async function handleApi(req, res) {
  const db = usingSupabase() ? null : readDb();

  try {
    if (req.method === "POST" && req.url === "/api/signup") {
      const { username, password } = await readBody(req);
      const cleanName = normalizeUserName(username);
      const userId = userIdFromName(cleanName);

      if (!cleanName || String(password || "").length < 4) {
        return sendJson(res, 400, { error: "Username and a 4+ character password are required." });
      }

      if (usingSupabase()) {
        const existing = await supabaseGetUserByUserId(userId);
        if (existing) {
          return sendJson(res, 409, { error: "Username already exists. Use sign in." });
        }

        const salt = crypto.randomBytes(16).toString("hex");
        await supabaseRequest(`/${TABLES.users}`, {
          method: "POST",
          body: JSON.stringify({
            user_id: userId,
            username: cleanName,
            password_hash: hashPassword(String(password), salt),
            salt,
            data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });
        const token = await supabaseCreateSession(userId);
        return sendJson(res, 201, { token, username: cleanName });
      }

      if (db.users[userId]) {
        return sendJson(res, 409, { error: "Username already exists. Use sign in." });
      }

      const salt = crypto.randomBytes(16).toString("hex");
      db.users[userId] = {
        data: {},
        passwordHash: hashPassword(String(password), salt),
        salt,
        username: cleanName,
      };
      const token = createSession(db, userId);
      writeDb(db);
      return sendJson(res, 201, { token, username: cleanName });
    }

    if (req.method === "POST" && req.url === "/api/signin") {
      const { username, password } = await readBody(req);
      const cleanName = normalizeUserName(username);
      const userId = userIdFromName(cleanName);

      if (usingSupabase()) {
        const user = await supabaseGetUserByUserId(userId);
        if (!user) {
          return sendJson(res, 404, { error: "Account not found. Click Register to create one." });
        }

        if (hashPassword(String(password || ""), user.salt) !== user.password_hash) {
          return sendJson(res, 401, { error: "Wrong password." });
        }

        const token = await supabaseCreateSession(user.user_id);
        return sendJson(res, 200, { token, username: user.username });
      }

      const user = db.users[userId];

      if (!user) {
        return sendJson(res, 404, { error: "Account not found. Click Register to create one." });
      }

      if (hashPassword(String(password || ""), user.salt) !== user.passwordHash) {
        return sendJson(res, 401, { error: "Wrong password." });
      }

      const token = createSession(db, userId);
      writeDb(db);
      return sendJson(res, 200, { token, username: user.username });
    }

    if (req.method === "POST" && req.url === "/api/logout") {
      const session = usingSupabase()
        ? await (async () => {
            const auth = req.headers.authorization || "";
            const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
            if (!token) return null;
            return { token };
          })()
        : getUserFromRequest(req, db);

      if (session?.token) {
        if (usingSupabase()) {
          await supabaseDeleteSession(session.token);
        } else {
          delete db.sessions[session.token];
          writeDb(db);
        }
      }

      return sendJson(res, 200, { ok: true });
    }

    if (req.method === "POST" && req.url === "/api/feedback") {
      const { name, email, review } = await readBody(req);
      const cleanName = normalizeUserName(name);
      const cleanEmail = normalizeEmail(email);
      const cleanReview = String(review || "").trim().slice(0, 2000);

      if (!cleanName || !isValidEmail(cleanEmail) || cleanReview.length < 8) {
        return sendJson(res, 400, { error: "Name, email, and a short review are required." });
      }

      await sendFeedbackEmail({ name: cleanName, email: cleanEmail, review: cleanReview });
      return sendJson(res, 200, { ok: true });
    }

    if (req.url === "/api/profile") {
      if (usingSupabase()) {
        const auth = req.headers.authorization || "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
        if (!token) return sendJson(res, 401, { error: "Please sign in first." });

        const session = await supabaseGetSession(token);
        if (!session) return sendJson(res, 401, { error: "Please sign in first." });

        const user = await supabaseGetUserByUserId(session.user_id);
        if (!user) return sendJson(res, 401, { error: "Please sign in first." });

        await supabaseUpdateLastUsed(token);

        if (req.method === "GET") {
          return sendJson(res, 200, {
            data: user.data || {},
            username: user.username,
          });
        }

        if (req.method === "PUT") {
          const patch = await readBody(req);
          const nextData = {
            ...(user.data || {}),
            ...patch,
          };
          const updated = await supabaseRequest(
            `/${TABLES.users}?user_id=eq.${encodeURIComponent(user.user_id)}`,
            {
              method: "PATCH",
              body: JSON.stringify({
                data: nextData,
                updated_at: new Date().toISOString(),
              }),
            },
          );

          const row = firstRecord(updated);
          return sendJson(res, 200, {
            data: row?.data || nextData,
            username: user.username,
          });
        }
      }

      const session = getUserFromRequest(req, db);
      if (!session) return sendJson(res, 401, { error: "Please sign in first." });

      if (req.method === "GET") {
        return sendJson(res, 200, {
          data: session.user.data || {},
          username: session.user.username,
        });
      }

      if (req.method === "PUT") {
        const patch = await readBody(req);
        session.user.data = {
          ...(session.user.data || {}),
          ...patch,
        };
        writeDb(db);
        return sendJson(res, 200, { data: session.user.data, username: session.user.username });
      }
    }

    return sendJson(res, 404, { error: "API route not found." });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "Server error." });
  }
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const requested = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.normalize(path.join(ROOT, requested));

  if (!filePath.startsWith(ROOT) || filePath.includes(`${path.sep}data${path.sep}`)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const type = MIME_TYPES[path.extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    handleApi(req, res);
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Pinfolio server running on http://localhost:${PORT}`);
});
