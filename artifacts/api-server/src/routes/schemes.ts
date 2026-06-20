import { Router, type IRouter } from "express";
import { db, schemesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function parseJsonField<T>(val: string | null, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

function formatScheme(s: typeof schemesTable.$inferSelect) {
  return {
    id: s.id, title: s.title, description: s.description, category: s.category,
    eligibility: s.eligibility, benefits: s.benefits,
    requiredDocuments: parseJsonField<string[]>(s.requiredDocuments, []),
    applicationProcess: s.applicationProcess, officialLink: s.officialLink, ministry: s.ministry,
    createdAt: s.createdAt.toISOString(),
  };
}

router.get("/schemes", requireAuth, async (req, res): Promise<void> => {
  const { q, category, page = "1" } = req.query as Record<string, string>;
  const pageNum = parseInt(page, 10);
  const limit = 12;
  const offset = (pageNum - 1) * limit;

  const all = await db.select().from(schemesTable);
  let filtered = all;
  if (category) filtered = filtered.filter(s => s.category === category);
  if (q) filtered = filtered.filter(s => s.title.toLowerCase().includes(q.toLowerCase()) || s.description.toLowerCase().includes(q.toLowerCase()));

  const total = filtered.length;
  const schemes = filtered.slice(offset, offset + limit).map(formatScheme);
  res.json({ schemes, total, page: pageNum, totalPages: Math.ceil(total / limit) });
});

router.get("/schemes/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [scheme] = await db.select().from(schemesTable).where(eq(schemesTable.id, id));
  if (!scheme) { res.status(404).json({ error: "Not found" }); return; }
  res.json(formatScheme(scheme));
});

export default router;
