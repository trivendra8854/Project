import { Router, type IRouter } from "express";
import { db, rightsArticlesTable } from "@workspace/db";
import { eq, ilike, or, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function parseJsonField<T>(val: string | null, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

function formatArticle(r: typeof rightsArticlesTable.$inferSelect) {
  return {
    id: r.id, title: r.title, summary: r.summary, content: r.content, category: r.category,
    relevantLaws: parseJsonField<string[]>(r.relevantLaws, []),
    legalProvisions: parseJsonField<string[]>(r.legalProvisions, []),
    governmentResources: parseJsonField<string[]>(r.governmentResources, []),
    createdAt: r.createdAt.toISOString(),
  };
}

const CATEGORIES = [
  { id: "womens-rights", name: "Women's Rights", icon: "shield", count: 0 },
  { id: "consumer-rights", name: "Consumer Rights", icon: "shopping-cart", count: 0 },
  { id: "property-rights", name: "Property Rights", icon: "home", count: 0 },
  { id: "labour-rights", name: "Labour Rights", icon: "briefcase", count: 0 },
  { id: "cyber-crime", name: "Cyber Crime", icon: "monitor", count: 0 },
  { id: "senior-citizen-rights", name: "Senior Citizen Rights", icon: "heart", count: 0 },
  { id: "child-protection", name: "Child Protection", icon: "user", count: 0 },
  { id: "rti", name: "RTI", icon: "file-text", count: 0 },
  { id: "constitutional-rights", name: "Constitutional Rights", icon: "book", count: 0 },
];

router.get("/rights", requireAuth, async (req, res): Promise<void> => {
  const { category, q, page = "1", limit = "12" } = req.query as Record<string, string>;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  let query = db.select().from(rightsArticlesTable);

  const conditions = [];
  if (category) conditions.push(eq(rightsArticlesTable.category, category));
  if (q) conditions.push(or(ilike(rightsArticlesTable.title, `%${q}%`), ilike(rightsArticlesTable.summary, `%${q}%`)));

  const all = await db.select().from(rightsArticlesTable);
  let filtered = all;
  if (category) filtered = filtered.filter(a => a.category === category);
  if (q) filtered = filtered.filter(a => a.title.toLowerCase().includes(q.toLowerCase()) || a.summary.toLowerCase().includes(q.toLowerCase()));

  const total = filtered.length;
  const articles = filtered.slice(offset, offset + limitNum).map(formatArticle);

  res.json({ articles, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
});

router.get("/rights/categories", requireAuth, async (_req, res): Promise<void> => {
  const all = await db.select().from(rightsArticlesTable);
  const categoryCounts: Record<string, number> = {};
  all.forEach(a => { categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1; });

  const cats = CATEGORIES.map(c => ({ ...c, count: categoryCounts[c.id] || 0 }));
  res.json(cats);
});

router.get("/rights/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [article] = await db.select().from(rightsArticlesTable).where(eq(rightsArticlesTable.id, id));
  if (!article) { res.status(404).json({ error: "Article not found" }); return; }
  res.json(formatArticle(article));
});

export default router;
