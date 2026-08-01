import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const ignoredDirectories = new Set([".git", "output", ".tmp", ".lighthouseci"]);
const servedExtensions = new Set([".html", ".css", ".js", ".json", ".svg", ".xml", ".txt"]);
const errors = [];
const excludedNames = new RegExp(`\\b(?:${[
  "\\x6f\\x64\\x79",
  "\\x6f\\x64\\x79\\x73\\x73\\x65\\x75\\x73",
  "\\x61\\x6c\\x65\\x78\\x69\\x73",
  "\\x68\\x6f\\x67\\x75\\x65\\x72\\x61",
  "\\x76\\x6f\\x6c\\x75\\x6d\\x65\\x6e",
  "\\x74\\x72\\x61\\x64\\x69\\x6e\\x67\\s+\\x61\\x67\\x65\\x6e\\x74\\x73"
].join("|")})\\b`, "i");

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
  if (excludedNames.test(source)) fail(file, "contiene una denominación o referencia excluida del contenido público");
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
  "assets/js/projects-data.js",
  "assets/css/mascot.css",
  "assets/js/mascot.js",
  "assets/media/mascot/manifest.json",
  "assets/media/mascot/candidate/cero-web-v1.svg"
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

const indexSource = await readFile(path.join(root, "index.html"), "utf8");
const configSource = await readFile(path.join(root, "assets/js/config.js"), "utf8");
const mascotSource = await readFile(path.join(root, "assets/js/mascot.js"), "utf8");
const masterSource = await readFile(path.join(root, "assets/media/mascot/candidate/cero-web-v1.svg"), "utf8");
const manifestPath = path.join(root, "assets/media/mascot/manifest.json");
let manifest;

try {
  manifest = JSON.parse(await readFile(manifestPath, "utf8"));
} catch {
  fail(manifestPath, "el manifiesto no es JSON válido");
}

if (!/mascotDemo:\s*true/.test(configSource)) fail(path.join(root, "assets/js/config.js"), "falta el feature flag mascotDemo activo en staging");
if (!/assets\/css\/mascot\.css/.test(indexSource) || !/assets\/js\/mascot\.js/.test(indexSource)) fail(path.join(root, "index.html"), "faltan los recursos interactivos de CERO");
if (!/data-cero-mascot/.test(indexSource) || !/aria-live="polite"/.test(indexSource)) fail(path.join(root, "index.html"), "falta la figura decorativa o su región de estado");
if (!/window\.CEROCOMA_MASCOT/.test(mascotSource) || !/cerocoma:mascot-statechange/.test(mascotSource)) fail(path.join(root, "assets/js/mascot.js"), "falta la interfaz pública o su evento de cambio");
if (!/cerocoma:compressor-change/.test(await readFile(path.join(root, "assets/js/site.js"), "utf8"))) fail(path.join(root, "assets/js/site.js"), "falta el evento del compresor");

const expectedStates = ["idle", "focus", "think", "build", "ready"];
for (const state of expectedStates) {
  if (!new RegExp(`id: ["']${state}["']`).test(mascotSource)) fail(path.join(root, "assets/js/mascot.js"), `falta el estado ${state}`);
  if (!new RegExp(`data-cero-expression=["']${state}["']`).test(indexSource)) fail(path.join(root, "index.html"), `falta la expresión ${state}`);
}

if (manifest) {
  if (manifest.version !== "1.0.0") fail(manifestPath, "versión de activo inesperada");
  if (manifest.status !== "staging-candidate") fail(manifestPath, "el estado debe ser staging-candidate");
  if (manifest.authorization !== "staging-only") fail(manifestPath, "la autorización debe limitarse a staging");
  if (manifest.originalityReview !== "pending") fail(manifestPath, "la revisión de originalidad debe seguir pendiente");
  if (manifest.productionApproved !== false) fail(manifestPath, "el activo no puede constar como aprobado para producción");
  if (JSON.stringify(manifest.states) !== JSON.stringify(expectedStates)) fail(manifestPath, "los cinco estados no coinciden con la interfaz");
  if (manifest.master?.width !== 480 || manifest.master?.height !== 440 || manifest.master?.viewBox !== "0 0 480 440") fail(manifestPath, "faltan dimensiones canónicas del maestro");
  if (!manifest.master?.alternativeText || !manifest.provenance) fail(manifestPath, "faltan texto alternativo o procedencia");
  for (const asset of [manifest.master, manifest.interactiveVersion]) {
    if (!asset?.path || asset.width !== 480 || asset.height !== 440 || asset.viewBox !== "0 0 480 440") fail(manifestPath, "un activo no registra ruta o dimensiones completas");
    if (typeof asset.alternativeText !== "string" || !asset.provenance) fail(manifestPath, "un activo no registra texto alternativo o procedencia");
    if (asset.authorization !== "staging-only" || asset.status !== "staging-candidate") fail(manifestPath, "un activo excede la autorización de staging");
  }
}

if (!/<svg\b[^>]*viewBox="0 0 480 440"/i.test(masterSource)) fail(path.join(root, "assets/media/mascot/candidate/cero-web-v1.svg"), "el maestro SVG no tiene el viewBox esperado");
if (/<(?:linearGradient|radialGradient|filter|script|image)\b/i.test(masterSource)) fail(path.join(root, "assets/media/mascot/candidate/cero-web-v1.svg"), "el maestro contiene una técnica o dependencia excluida");

if (errors.length) {
  console.error(`Validación fallida con ${errors.length} incidencia(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Validación correcta: ${htmlFiles.length} documentos HTML y ${files.length} archivos revisados.`);
}
