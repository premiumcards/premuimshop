const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, "data.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "premium2026";
const PORT = Number(process.env.PORT || 5173);
const sessions = new Map();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function ensureData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [], orders: [] }, null, 2));
  }
}

function readData() {
  ensureData();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": MIME[".json"] });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const candidate = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(candidate, "hex"));
}

function publicUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

function requireFields(payload, fields) {
  for (const field of fields) {
    if (!String(payload[field] || "").trim()) {
      throw new Error(`${field} is required`);
    }
  }
}

async function handleApi(req, res) {
  const payload = await parseBody(req);
  const data = readData();

  if (req.url === "/api/signup" && req.method === "POST") {
    requireFields(payload, ["name", "email", "password"]);
    const email = String(payload.email).trim().toLowerCase();
    if (data.users.some((user) => user.email === email)) {
      return sendJson(res, 409, { error: "Email already registered" });
    }
    const user = {
      id: crypto.randomUUID(),
      name: String(payload.name).trim(),
      phone: String(payload.phone || "").trim(),
      email,
      passwordHash: hashPassword(String(payload.password)),
      createdAt: new Date().toISOString()
    };
    data.users.push(user);
    writeData(data);
    const token = crypto.randomUUID();
    sessions.set(token, user.id);
    return sendJson(res, 200, { user: publicUser(user), token });
  }

  if (req.url === "/api/login" && req.method === "POST") {
    requireFields(payload, ["email", "password"]);
    const email = String(payload.email).trim().toLowerCase();
    const user = data.users.find((row) => row.email === email);
    if (!user || !verifyPassword(String(payload.password), user.passwordHash)) {
      return sendJson(res, 401, { error: "Invalid email or password" });
    }
    const token = crypto.randomUUID();
    sessions.set(token, user.id);
    return sendJson(res, 200, { user: publicUser(user), token });
  }

  if (req.url === "/api/order" && req.method === "POST") {
    requireFields(payload, ["token", "utr"]);
    const userId = sessions.get(String(payload.token));
    const user = data.users.find((row) => row.id === userId);
    if (!user) return sendJson(res, 401, { error: "Please login again" });
    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return sendJson(res, 400, { error: "Cart is empty" });
    }
    const order = {
      id: crypto.randomUUID(),
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      utr: String(payload.utr).trim(),
      items: payload.items.map((item) => ({
        id: item.id,
        name: item.name,
        balance: item.balance,
        price: Number(item.price),
        qty: Number(item.qty || 1)
      })),
      total: Number(payload.total || 0),
      status: "pending",
      createdAt: new Date().toISOString()
    };
    data.orders.push(order);
    writeData(data);
    return sendJson(res, 200, { order });
  }

  if (req.url === "/api/admin" && req.method === "POST") {
    if (String(payload.password) !== ADMIN_PASSWORD) {
      return sendJson(res, 401, { error: "Wrong admin password" });
    }
    return sendJson(res, 200, {
      users: data.users.map(publicUser),
      orders: data.orders
    });
  }

  return sendJson(res, 404, { error: "Not found" });
}

function serveStatic(req, res) {
  const requestUrl = new URL(req.url, "http://localhost");
  const requestedPath = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const filePath = path.normalize(path.join(ROOT, requestedPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, contents) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
    res.end(contents);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/api/")) {
      await handleApi(req, res);
    } else {
      serveStatic(req, res);
    }
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
});

ensureData();
server.listen(PORT, () => {
  console.log(`premium.shop running at http://localhost:${PORT}`);
  console.log(`Admin password: ${ADMIN_PASSWORD}`);
});
