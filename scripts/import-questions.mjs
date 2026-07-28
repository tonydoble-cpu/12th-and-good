#!/usr/bin/env node
/**
 * Import Tony's 401(k) question library (funnel build brief §2).
 *
 * Usage:
 *   node scripts/import-questions.mjs path/to/questions.csv
 *
 * CSV columns (header row required, comma-separated, quotes supported):
 *   category,question,answer            (slug optional as a 4th column)
 *
 * What it does:
 *   1. Parses the CSV, generates slugs from question text when absent.
 *   2. Overwrites lib/questions-data.json (the file the site builds from).
 *   3. If SUPABASE env vars are present, also upserts into the `questions`
 *      table so the white-label path stays warm. Skipped silently otherwise.
 *
 * After running: `npm run build` regenerates every static answer page.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: node scripts/import-questions.mjs <questions.csv>");
  process.exit(1);
}

// --- tiny CSV parser (handles quoted fields with commas/newlines) ---
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field !== "" || row.length) { row.push(field); if (row.some((f) => f.trim() !== "")) rows.push(row); }
  return rows;
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/401\(k\)/g, "401k")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/-$/, "");
}

const rows = parseCSV(readFileSync(resolve(csvPath), "utf8"));
const header = rows.shift().map((h) => h.trim().toLowerCase());
const idx = (name) => header.indexOf(name);
if (idx("category") < 0 || idx("question") < 0 || idx("answer") < 0) {
  console.error(`CSV must have columns: category,question,answer (got: ${header.join(",")})`);
  process.exit(1);
}

const seen = new Set();
const questions = rows.map((r) => {
  const question = r[idx("question")].trim();
  let slug = idx("slug") >= 0 && r[idx("slug")]?.trim() ? r[idx("slug")].trim() : slugify(question);
  while (seen.has(slug)) slug = `${slug}-2`;
  seen.add(slug);
  return {
    slug,
    category: r[idx("category")].trim(),
    question,
    answer: r[idx("answer")].trim(),
  };
});

const outPath = resolve(root, "lib/questions-data.json");
writeFileSync(
  outPath,
  JSON.stringify(
    {
      _note: `Imported ${questions.length} questions on ${new Date().toISOString().slice(0, 10)} via scripts/import-questions.mjs.`,
      questions,
    },
    null,
    2
  ) + "\n"
);
console.log(`✓ Wrote ${questions.length} questions to lib/questions-data.json`);

// --- optional Supabase mirror ---
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (url && key) {
  const res = await fetch(`${url}/rest/v1/questions?on_conflict=slug`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(
      questions.map((q) => ({
        slug: q.slug,
        category: q.category,
        question_text: q.question,
        answer_text: q.answer,
      }))
    ),
  });
  console.log(res.ok ? "✓ Mirrored into Supabase questions table" : `Supabase mirror failed: ${res.status} ${await res.text()}`);
} else {
  console.log("(Supabase env vars not set — skipped DB mirror; JSON is the source of truth for v1.)");
}
console.log("Next: npm run build  — regenerates every static answer page.");
