import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { PrismaClient } from "../app/generated/prisma/index.js";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function loadJson(relativePath) {
  const full = resolve(__dirname, relativePath);
  const raw = await readFile(full, "utf-8");
  return JSON.parse(raw);
}

// Converte um item bruto (com chaves PT-BR) para o formato do modelo Crime
function normalizeCrime(raw) {
  const article = String(raw.Artigo ?? raw.article ?? "").trim();
  const title = String(raw.Crime ?? raw.title ?? "").trim();
  const description = String(raw["Descrição"] ?? raw.description ?? "").trim();

  const timeNum = Number(raw.Pena ?? raw.time ?? 0);
  const fineNum = Number(raw.Multa ?? raw.fine ?? 0);
  const fianceNum = Number(raw["Fiança"] ?? raw.fiance ?? 0);

  return {
    article,
    title,
    description,
    time: Number.isFinite(timeNum) ? Math.trunc(timeNum) : 0,
    fine: Number.isFinite(fineNum) ? fineNum : 0,
    fiance: Number.isFinite(fianceNum) ? fianceNum : 0,
    financable: fianceNum > 0, // Define financable com base no valor de fiance
  };
}

// Mescla dois registros do mesmo artigo preferindo maior qualidade de dados
function mergeCrime(a, b) {
  return {
    article: a.article || b.article,
    title: a.title || b.title,
    description: (a.description?.length || 0) >= (b.description?.length || 0) ? a.description : b.description,
    time: Math.max(a.time ?? 0, b.time ?? 0),
    fine: Math.max(a.fine ?? 0, b.fine ?? 0),
    fiance: Math.max(a.fiance ?? 0, b.fiance ?? 0),
    financable: Boolean(a.fiance > 0 || b.fiance > 0),
  };
}

async function main() {
  const crimesRaw = await loadJson("../utils/crimes.json");
  const multasRaw = await loadJson("../utils/multas.json");

  const combined = [...crimesRaw, ...multasRaw].map(normalizeCrime).filter(c => c.article);

  // Dedup por artigo
  const byArticle = new Map();
  for (const c of combined) {
    if (!byArticle.has(c.article)) {
      byArticle.set(c.article, c);
    } else {
      byArticle.set(c.article, mergeCrime(byArticle.get(c.article), c));
    }
  }

  const items = Array.from(byArticle.values());

  for (const c of items) {
    await prisma.crime.upsert({
      where: { article: c.article },
      update: {
        title: c.title,
        description: c.description,
        time: c.time,
        fine: c.fine,
        fiance: c.fiance,
        financable: c.financable,
      },
      create: {
        article: c.article,
        title: c.title,
        description: c.description,
        time: c.time,
        fine: c.fine,
        fiance: c.fiance,
        financable: c.financable,
      },
    });
  }

  console.log(`Seed concluído. Upserts: ${items.length}`);
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
