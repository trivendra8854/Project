import { Router, type IRouter } from "express";
import { db, legalAidProvidersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function parseJsonField<T>(val: string | null, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

function formatProvider(p: typeof legalAidProvidersTable.$inferSelect) {
  return {
    id: p.id, name: p.name, type: p.type, city: p.city, state: p.state, pincode: p.pincode,
    address: p.address, phone: p.phone, email: p.email, website: p.website,
    practiceAreas: parseJsonField<string[]>(p.practiceAreas, []),
    languages: parseJsonField<string[]>(p.languages, []),
    rating: p.rating, description: p.description,
  };
}

router.get("/legalaid", requireAuth, async (req, res): Promise<void> => {
  const { city, state, type, area, q } = req.query as Record<string, string>;
  const all = await db.select().from(legalAidProvidersTable);
  let filtered = all;
  if (city) filtered = filtered.filter(p => p.city.toLowerCase().includes(city.toLowerCase()));
  if (state) filtered = filtered.filter(p => p.state.toLowerCase().includes(state.toLowerCase()));
  if (type) filtered = filtered.filter(p => p.type === type);
  if (area) filtered = filtered.filter(p => p.practiceAreas.toLowerCase().includes(area.toLowerCase()));
  if (q) filtered = filtered.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase()));
  res.json(filtered.map(formatProvider));
});

router.get("/legalaid/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [provider] = await db.select().from(legalAidProvidersTable).where(eq(legalAidProvidersTable.id, id));
  if (!provider) { res.status(404).json({ error: "Not found" }); return; }
  res.json(formatProvider(provider));
});

export default router;
