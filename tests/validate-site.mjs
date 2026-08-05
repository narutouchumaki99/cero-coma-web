import { readdir, readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const ignoredDirectories = new Set([".git", "output", "recursos-locales", ".tmp", ".lighthouseci"]);
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
  // La web es pública e indexable: las páginas de contenido declaran su URL
  // canónica y no llevan noindex. La página de error sí debe conservarlo.
  const hasNoindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(source);
  if (path.basename(htmlFile) === "404.html") {
    if (!hasNoindex) fail(htmlFile, "la página de error debe conservar noindex");
  } else {
    if (hasNoindex) fail(htmlFile, "una página pública no debe llevar noindex");
    if (!/<link\s+rel="canonical"\s+href="https:\/\/cerocomasoluciones\.com/i.test(source)) fail(htmlFile, "falta la URL canónica");
  }
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
  "assets/media/mascot/candidate/rendered/cero-idle.webp",
  "assets/media/mascot/candidate/rendered/cero-focus.webp",
  "assets/media/mascot/candidate/rendered/cero-think.webp",
  "assets/media/mascot/candidate/rendered/cero-build.webp",
  "assets/media/mascot/candidate/rendered/cero-ready.webp"
];

for (const item of required) {
  try { await stat(path.join(root, item)); }
  catch { errors.push(`${item}: archivo obligatorio ausente`); }
}

try {
  await stat(path.join(root, "CNAME"));
  errors.push("CNAME: el dominio lo sirve Cloudflare Pages; este archivo desviaría el dominio a GitHub Pages");
} catch {
  // Correcto: el dominio se resuelve fuera del repositorio.
}

const robots = await readFile(path.join(root, "robots.txt"), "utf8");
if (/^\s*Disallow:\s*\/\s*$/im.test(robots)) errors.push("robots.txt: la web pública no debe bloquear el rastreo completo");
if (!/^\s*Sitemap:\s*https:\/\/cerocomasoluciones\.com\/sitemap\.xml\s*$/im.test(robots)) errors.push("robots.txt: falta la referencia al sitemap");

const indexSource = await readFile(path.join(root, "index.html"), "utf8");
const configSource = await readFile(path.join(root, "assets/js/config.js"), "utf8");

// La URL de la app vive en config.js y además en enlaces estáticos (para que
// funcionen sin JavaScript). Si divergen, los botones llevarían a un destino
// muerto sin que nada avise: aquí se obliga a que coincidan.
{
  const declared = configSource.match(/url:\s*"(https:\/\/[^"]+)"/);
  const appUrl = declared ? declared[1].replace(/\/$/, "") : "";
  for (const htmlFile of htmlFiles) {
    const source = await readFile(htmlFile, "utf8");
    for (const match of source.matchAll(/<a\b[^>]*\bdata-app-link\b[^>]*>/g)) {
      const href = match[0].match(/href="([^"]+)"/);
      if (!href) {
        fail(htmlFile, "un enlace data-app-link no declara href");
      } else if (!appUrl) {
        fail(htmlFile, "hay enlaces a la app pero config.js no declara app.url");
      } else if (href[1].replace(/\/$/, "") !== appUrl) {
        fail(htmlFile, `enlace a la app desincronizado con config.app.url: ${href[1]}`);
      }
    }
  }
}
// El contacto también se sirve estático. Si el HTML publicara un correo o un
// número distintos de los declarados, alguien escribiría a un destino que no
// se lee: aquí se obliga a que coincidan con config.js.
{
  const declaredEmail = configSource.match(/email:\s*"([^"]*)"/)?.[1] || "";
  const declaredWhatsapp = configSource.match(/whatsapp:\s*"([^"]*)"/)?.[1] || "";
  const declaredPhone = configSource.match(/phone:\s*"([^"]*)"/)?.[1] || "";
  for (const htmlFile of htmlFiles) {
    const source = await readFile(htmlFile, "utf8");
    for (const match of source.matchAll(/href="(mailto:|tel:|https:\/\/wa\.me\/)([^"]*)"/g)) {
      const [, scheme, value] = match;
      const expected = scheme === "mailto:" ? declaredEmail : scheme === "tel:" ? declaredPhone : declaredWhatsapp.replace("https://wa.me/", "");
      if (!expected) fail(htmlFile, `se publica un contacto (${scheme}) que config.js no declara`);
      else if (value !== expected) fail(htmlFile, `contacto desincronizado con config.js: ${scheme}${value}`);
    }
  }
}

const mascotSource = await readFile(path.join(root, "assets/js/mascot.js"), "utf8");
const manifestPath = path.join(root, "assets/media/mascot/manifest.json");
let manifest;

try {
  manifest = JSON.parse(await readFile(manifestPath, "utf8"));
} catch {
  fail(manifestPath, "el manifiesto no es JSON válido");
}

if (!/mascotDemo:\s*true/.test(configSource)) fail(path.join(root, "assets/js/config.js"), "falta el feature flag mascotDemo activo en staging");
if (!/assets\/css\/mascot\.css/.test(indexSource) || !/assets\/js\/mascot\.js/.test(indexSource)) fail(path.join(root, "index.html"), "faltan los recursos interactivos de CERO");
if (!/data-cero-mascot/.test(indexSource) || !/data-cero-render/.test(indexSource) || !/aria-live="polite"/.test(indexSource)) fail(path.join(root, "index.html"), "falta el render decorativo o su región de estado");
if (!/window\.CEROCOMA_MASCOT/.test(mascotSource) || !/cerocoma:mascot-statechange/.test(mascotSource)) fail(path.join(root, "assets/js/mascot.js"), "falta la interfaz pública o su evento de cambio");
if (!/cerocoma:compressor-change/.test(await readFile(path.join(root, "assets/js/site.js"), "utf8"))) fail(path.join(root, "assets/js/site.js"), "falta el evento del compresor");

const expectedStates = ["idle", "focus", "think", "build", "ready"];
for (const state of expectedStates) {
  if (!new RegExp(`id: ["']${state}["']`).test(mascotSource)) fail(path.join(root, "assets/js/mascot.js"), `falta el estado ${state}`);
  if (!new RegExp(`cero-${state}\\.webp`).test(mascotSource)) fail(path.join(root, "assets/js/mascot.js"), `falta el render del estado ${state}`);
}

if (manifest) {
  if (manifest.version !== "2.2.0") fail(manifestPath, "versión de activo inesperada");
  if (manifest.status !== "staging-candidate") fail(manifestPath, "el estado debe ser staging-candidate");
  if (manifest.authorization !== "staging-only") fail(manifestPath, "la autorización debe limitarse a staging");
  if (manifest.originalityReview !== "owner-confirmed-2026-08-03" || manifest.rightsReview !== "owner-confirmed-2026-08-03") fail(manifestPath, "las revisiones de originalidad y derechos deben constar como confirmadas por el propietario");
  if (manifest.productionApproved !== false) fail(manifestPath, "el activo no puede constar como aprobado para producción");
  if (JSON.stringify(manifest.states) !== JSON.stringify(expectedStates)) fail(manifestPath, "los cinco estados no coinciden con la interfaz");
  if (manifest.sourceModel?.published !== false || manifest.sourceModel?.licenseProvided !== false) fail(manifestPath, "el GLB original no debe constar como publicado o licenciado");
  if (manifest.sourceModel?.bytes !== 13389496 || manifest.sourceModel?.triangles !== 1935288 || manifest.sourceModel?.animations !== 0) fail(manifestPath, "faltan métricas verificadas del modelo fuente");
  if (manifest.delivery?.kind !== "five-state-render-sequence" || manifest.delivery?.sourcePublished !== false) fail(manifestPath, "la entrega debe usar renders y excluir el modelo fuente");
  if (!Array.isArray(manifest.media) || manifest.media.length !== expectedStates.length) fail(manifestPath, "el manifiesto debe registrar cinco medios");

  let totalBytes = 0;
  for (const asset of manifest.media || []) {
    if (!asset?.path || asset.width !== 512 || asset.height !== 512) fail(manifestPath, "un activo no registra ruta o dimensiones completas");
    if (!expectedStates.includes(asset.state) || typeof asset.alternativeText !== "string" || !asset.provenance) fail(manifestPath, "un activo no registra estado, texto alternativo o procedencia");
    if (asset.authorization !== "staging-only" || asset.status !== "staging-candidate") fail(manifestPath, "un activo excede la autorización de staging");
    const assetPath = path.join(path.dirname(manifestPath), asset.path || "");
    try {
      const data = await readFile(assetPath);
      const digest = createHash("sha256").update(data).digest("hex").toUpperCase();
      totalBytes += data.length;
      if (data.subarray(0, 4).toString("ascii") !== "RIFF" || data.subarray(8, 12).toString("ascii") !== "WEBP") fail(assetPath, "el activo no es un WebP válido");
      if (data.length !== asset.bytes || digest !== asset.sha256) fail(assetPath, "peso o huella distintos del manifiesto");
    } catch {
      fail(assetPath, "el medio registrado no está disponible");
    }
  }
  if (totalBytes !== manifest.delivery?.totalBytes || totalBytes > 100000) fail(manifestPath, "el conjunto de renders excede el presupuesto o no coincide con el manifiesto");

  // Derivado 3D publicado: verificado contra el manifiesto y con presupuesto de peso.
  if (manifest.derivedModel) {
    const derivedPath = path.join(path.dirname(manifestPath), manifest.derivedModel.path || "");
    try {
      const data = await readFile(derivedPath);
      const digest = createHash("sha256").update(data).digest("hex").toUpperCase();
      if (data.subarray(0, 4).toString("ascii") !== "glTF") fail(derivedPath, "el derivado no es un GLB válido");
      if (data.length !== manifest.derivedModel.bytes || digest !== manifest.derivedModel.sha256) fail(derivedPath, "peso o huella del derivado distintos del manifiesto");
      if (data.length > 500000) fail(derivedPath, "el derivado 3D excede el presupuesto de 500 KB");
      if (!manifest.derivedModel.authorizationBasis) fail(manifestPath, "el derivado publicado debe registrar la base de autorización");
      if (JSON.stringify(manifest.derivedModel.animations) !== JSON.stringify(expectedStates)) fail(manifestPath, "el derivado debe declarar los cinco clips de animación de la interfaz");
    } catch {
      fail(derivedPath, "el derivado registrado no está disponible");
    }
  }
}

{
  const allowedGlb = path.join(root, "assets", "media", "mascot", "cero.glb");
  const glbFiles = files.filter((file) => path.extname(file).toLowerCase() === ".glb");
  for (const file of glbFiles) {
    if (path.resolve(file) !== allowedGlb) fail(file, "solo puede publicarse el derivado optimizado assets/media/mascot/cero.glb");
    const details = await stat(file);
    if (details.size === 13389496) fail(file, "el GLB fuente de 13,4 MB no debe publicarse");
  }
}

if (errors.length) {
  console.error(`Validación fallida con ${errors.length} incidencia(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Validación correcta: ${htmlFiles.length} documentos HTML y ${files.length} archivos revisados.`);
}
