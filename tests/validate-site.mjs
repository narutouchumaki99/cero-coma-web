import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const ignoredDirectories = new Set([".git", "output", ".tmp", ".lighthouseci"]);
const servedExtensions = new Set([".html", ".css", ".js", ".svg", ".xml", ".txt"]);
const errors = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...await walk(absolute));
    else results.push(absolute);
  }
  return results;
}

function relative(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function fail(file, message) {
  errors.push(`${relative(file)}: ${message}`);
}

function isExternal(reference) {
  return /^(?:[a-z]+:|\/\/|#)/i.test(reference);
}

async function checkReference(htmlFile, reference) {
  const clean = reference.split("#")[0].split("?")[0];
  if (!clean || isExternal(clean)) return;
  let destination = path.resolve(path.dirname(htmlFile), decodeURIComponent(clean));
  try {
    const details = await stat(destination);
    if (details.isDirectory()) destination = path.join(destination, "index.html");
    await stat(destination);
  } catch {
    fail(htmlFile, `referencia local inexistente: ${reference}`);
  }
}

const files = await walk(root);
const htmlFiles = files.filter((file) => path.extname(file) === ".html");

for (const htmlFile of htmlFiles) {
  const source = await readFile(htmlFile, "utf8");
  const h1Count = (source.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) fail(htmlFile, `se esperaba un h1 y se encontraron ${h1Count}`);
  if (!/<html\s+lang="es"/i.test(source)) fail(htmlFile, "falta lang=es");
  if (!/<main\b/i.test(source)) fail(htmlFile, "falta el landmark main");
  if (!/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(source)) fail(htmlFile, "falta meta noindex de staging");
  if (!/class="skip-link"/i.test(source)) fail(htmlFile, "falta enlace de salto");

  const references = [...source.matchAll(/\b(?:href|src)="([^"]+)"/gi)].map((match) => match[1]);
  for (const reference of references) await checkReference(htmlFile, reference);
}

for (const file of files.filter((item) => servedExtensions.has(path.extname(item)))) {
  const source = await readFile(file, "utf8");
  if (/[A-Z]:\\Users\\/i.test(source) || /file:\/\//i.test(source)) fail(file, "contiene una ruta local");
  if (/\b(?:localhost|127\.0\.0\.1)\b/i.test(source)) fail(file, "contiene una dirección local");
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(source)) fail(file, "contiene una clave privada");
  if (/\b(?:api[_-]?key|secret|password)\s*[:=]\s*["'][^"']{8,}/i.test(source)) fail(file, "parece contener una credencial");
}

const required = [
  ".nojekyll",
  "robots.txt",
  "sitemap.xml",
  "404.html",
  "index.html",
  "proyectos/index.html",
  "tu-carta-en-cero-coma/index.html",
  "assets/js/config.js",
  "assets/js/projects-data.js"
];

for (const item of required) {
  try { await stat(path.join(root, item)); }
  catch { errors.push(`${item}: archivo obligatorio ausente`); }
}

try {
  await stat(path.join(root, "CNAME"));
  errors.push("CNAME: no debe existir durante staging");
} catch {
  // Correcto: el dominio personalizado queda fuera de staging.
}

const robots = await readFile(path.join(root, "robots.txt"), "utf8");
if (!/Disallow:\s*\//i.test(robots)) errors.push("robots.txt: staging debe bloquear el rastreo");

if (errors.length) {
  console.error(`Validación fallida con ${errors.length} incidencia(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Validación correcta: ${htmlFiles.length} documentos HTML y ${files.length} archivos revisados.`);
}

