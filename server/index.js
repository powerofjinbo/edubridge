import { createServer } from "node:http";
import { appendFile, mkdir, readFile, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const distDir = join(rootDir, "dist");
const dataDir = join(rootDir, "data");
const consultationFile = join(dataDir, "consultations.jsonl");
const port = Number(process.env.PORT || 8787);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  });
  response.end(JSON.stringify(payload));
}

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1_000_000) {
      throw new Error("Request body is too large.");
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function cleanString(value) {
  return typeof value === "string" ? value.trim().slice(0, 1200) : "";
}

async function handleConsultation(request, response) {
  if (request.method === "OPTIONS") {
    return sendJson(response, 204, {});
  }

  if (request.method === "GET") {
    return sendJson(response, 200, { ok: true, message: "EduBridge consultation API is running." });
  }

  if (request.method !== "POST") {
    return sendJson(response, 405, { ok: false, error: "Method not allowed." });
  }

  let payload;
  try {
    payload = JSON.parse(await readBody(request));
  } catch {
    return sendJson(response, 400, { ok: false, error: "Invalid JSON body." });
  }

  const record = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    parentName: cleanString(payload.parentName),
    email: cleanString(payload.email),
    studentGrade: cleanString(payload.studentGrade),
    supportArea: cleanString(payload.supportArea),
    notes: cleanString(payload.notes)
  };

  if (!record.parentName || !record.email || !record.studentGrade) {
    return sendJson(response, 422, {
      ok: false,
      error: "Parent name, email, and student grade are required."
    });
  }

  await mkdir(dataDir, { recursive: true });
  await appendFile(consultationFile, `${JSON.stringify(record)}\n`, "utf8");

  return sendJson(response, 201, { ok: true, id: record.id });
}

async function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const rawPath = decodeURIComponent(url.pathname);
  const safePath = normalize(rawPath).replace(/^(\.\.[/\\])+/, "");
  const requested = safePath === "/" ? "/index.html" : safePath;
  let filePath = join(distDir, requested);

  if (!filePath.startsWith(distDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) {
      throw new Error("Not a file.");
    }
  } catch {
    filePath = join(distDir, "index.html");
  }

  try {
    const contentType = mimeTypes[extname(filePath)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType });
    createReadStream(filePath).pipe(response);
  } catch {
    try {
      const html = await readFile(join(distDir, "index.html"), "utf8");
      response.writeHead(200, { "Content-Type": mimeTypes[".html"] });
      response.end(html);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Build output not found. Run npm run build first.");
    }
  }
}

const server = createServer(async (request, response) => {
  try {
    if (request.url?.startsWith("/api/consultations")) {
      await handleConsultation(request, response);
      return;
    }

    await serveStatic(request, response);
  } catch (error) {
    sendJson(response, 500, { ok: false, error: error.message || "Server error." });
  }
});

server.listen(port, () => {
  console.log(`EduBridge server listening on http://localhost:${port}`);
});
