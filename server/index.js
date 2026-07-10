import { createReadStream } from "node:fs";
import { appendFile, mkdir, readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const distDir = join(rootDir, "dist");
const dataDir = join(rootDir, "data");
const consultationFile = join(dataDir, "consultations.jsonl");
const port = Number(process.env.PORT || 8787);
const maxBodySize = 100_000;
const rateWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 6;

const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || "https://powerofjinbo.github.io,http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

const requestWindows = new Map();

function securityHeaders() {
  return {
    "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https:; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'none'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY"
  };
}

function corsHeaders(request) {
  const origin = request.headers.origin;
  if (!origin || !allowedOrigins.has(origin)) {
    return {};
  }

  return {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Origin": origin,
    Vary: "Origin"
  };
}

function sendJson(request, response, status, payload, extraHeaders = {}) {
  response.writeHead(status, {
    ...securityHeaders(),
    ...corsHeaders(request),
    ...extraHeaders,
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(status === 204 ? undefined : JSON.stringify(payload));
}

async function readBody(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodySize) {
      throw new Error("BODY_TOO_LARGE");
    }
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

function cleanString(value, maxLength = 500) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function getClientAddress(request) {
  const forwarded = cleanString(request.headers["x-forwarded-for"], 160);
  return forwarded.split(",")[0].trim() || request.socket.remoteAddress || "unknown";
}

function isRateLimited(key) {
  const now = Date.now();
  const current = requestWindows.get(key);

  if (!current || now - current.startedAt >= rateWindowMs) {
    requestWindows.set(key, { count: 1, startedAt: now });
    return false;
  }

  current.count += 1;
  return current.count > maxRequestsPerWindow;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

async function handleConsultation(request, response) {
  const origin = request.headers.origin;
  if (origin && !allowedOrigins.has(origin)) {
    return sendJson(request, response, 403, { ok: false, error: "Origin not allowed." });
  }

  if (request.method === "OPTIONS") {
    return sendJson(request, response, 204, {});
  }

  if (request.method !== "POST") {
    return sendJson(request, response, 405, { ok: false, error: "Method not allowed." }, { Allow: "POST, OPTIONS" });
  }

  const clientAddress = getClientAddress(request);
  if (isRateLimited(clientAddress)) {
    return sendJson(request, response, 429, {
      ok: false,
      error: "Too many requests. Please wait a few minutes and try again."
    });
  }

  let payload;
  try {
    payload = JSON.parse(await readBody(request));
  } catch (error) {
    const message = error.message === "BODY_TOO_LARGE" ? "Request body is too large." : "Invalid JSON body.";
    return sendJson(request, response, 400, { ok: false, error: message });
  }

  if (cleanString(payload.website, 200)) {
    return sendJson(request, response, 201, { ok: true, id: randomUUID() });
  }

  const record = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    parentName: cleanString(payload.parentName, 120),
    email: cleanString(payload.email, 254).toLowerCase(),
    studentGrade: cleanString(payload.studentGrade, 80),
    supportArea: cleanString(payload.supportArea, 120),
    notes: cleanString(payload.notes, 1200)
  };

  if (!record.parentName || !record.email || !record.studentGrade) {
    return sendJson(request, response, 422, {
      ok: false,
      error: "Parent or guardian name, email, and student grade are required."
    });
  }

  if (!isValidEmail(record.email)) {
    return sendJson(request, response, 422, { ok: false, error: "Enter a valid email address." });
  }

  await mkdir(dataDir, { recursive: true });
  await appendFile(consultationFile, `${JSON.stringify(record)}\n`, "utf8");

  return sendJson(request, response, 201, { ok: true, id: record.id });
}

function sendHealth(request, response) {
  return sendJson(request, response, 200, {
    ok: true,
    service: "edubridge-consultations",
    status: "ready"
  });
}

async function serveStatic(request, response, pathname) {
  let rawPath;
  try {
    rawPath = decodeURIComponent(pathname);
  } catch {
    response.writeHead(400, securityHeaders());
    response.end("Bad request");
    return;
  }

  const relativePath = normalize(rawPath === "/" ? "index.html" : rawPath)
    .replace(/^[/\\]+/, "")
    .replace(/^(\.\.[/\\])+/, "");
  let filePath = resolve(distDir, relativePath);

  if (filePath !== distDir && !filePath.startsWith(`${distDir}${sep}`)) {
    response.writeHead(403, securityHeaders());
    response.end("Forbidden");
    return;
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) {
      throw new Error("Not a file");
    }
  } catch {
    filePath = join(distDir, "index.html");
  }

  try {
    const extension = extname(filePath);
    const contentType = mimeTypes[extension] || "application/octet-stream";
    const cacheControl = extension === ".html"
      ? "no-cache"
      : rawPath.includes("/assets/")
        ? "public, max-age=31536000, immutable"
        : "public, max-age=3600";

    response.writeHead(200, {
      ...securityHeaders(),
      "Cache-Control": cacheControl,
      "Content-Type": contentType
    });
    createReadStream(filePath).pipe(response);
  } catch {
    try {
      const html = await readFile(join(distDir, "index.html"), "utf8");
      response.writeHead(200, {
        ...securityHeaders(),
        "Cache-Control": "no-cache",
        "Content-Type": mimeTypes[".html"]
      });
      response.end(html);
    } catch {
      response.writeHead(404, { ...securityHeaders(), "Content-Type": "text/plain; charset=utf-8" });
      response.end("Build output not found. Run npm run build first.");
    }
  }
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

    if (url.pathname === "/api/health") {
      sendHealth(request, response);
      return;
    }

    if (url.pathname === "/api/consultations") {
      await handleConsultation(request, response);
      return;
    }

    await serveStatic(request, response, url.pathname);
  } catch {
    sendJson(request, response, 500, { ok: false, error: "Unexpected server error." });
  }
});

server.listen(port, () => {
  console.log(`EduBridge server listening on http://localhost:${port}`);
});
