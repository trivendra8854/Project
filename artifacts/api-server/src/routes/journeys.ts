import { Router, type IRouter } from "express";
import { db, journeysTable, journeyProgressTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { UpdateJourneyProgressBody } from "@workspace/api-zod";

const router: IRouter = Router();

function parseJsonField<T>(val: string | null, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

function formatJourney(j: typeof journeysTable.$inferSelect) {
  return {
    id: j.id, title: j.title, description: j.description, category: j.category,
    estimatedDays: j.estimatedDays, eligibility: j.eligibility,
    requiredDocuments: parseJsonField<string[]>(j.requiredDocuments, []),
    applicableLaws: parseJsonField<string[]>(j.applicableLaws, []),
    steps: parseJsonField<any[]>(j.steps, []),
  };
}

function formatProgress(p: typeof journeyProgressTable.$inferSelect) {
  return {
    journeyId: p.journeyId, currentStep: p.currentStep,
    completedSteps: parseJsonField<number[]>(p.completedSteps, []),
    completionPercent: p.completionPercent,
    startedAt: p.startedAt?.toISOString() || null,
    completedAt: p.completedAt?.toISOString() || null,
  };
}

router.get("/journeys", requireAuth, async (_req, res): Promise<void> => {
  const journeys = await db.select().from(journeysTable);
  res.json(journeys.map(formatJourney));
});

router.get("/journeys/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [journey] = await db.select().from(journeysTable).where(eq(journeysTable.id, id));
  if (!journey) { res.status(404).json({ error: "Not found" }); return; }
  res.json(formatJourney(journey));
});

router.get("/journeys/:id/progress", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);

  let [progress] = await db.select().from(journeyProgressTable)
    .where(and(eq(journeyProgressTable.userId, user.id), eq(journeyProgressTable.journeyId, id)));

  if (!progress) {
    const [journey] = await db.select().from(journeysTable).where(eq(journeysTable.id, id));
    if (!journey) { res.status(404).json({ error: "Not found" }); return; }
    [progress] = await db.insert(journeyProgressTable).values({
      userId: user.id, journeyId: id, currentStep: 1, completedSteps: "[]", completionPercent: 0,
      startedAt: new Date(),
    }).returning();
  }

  res.json(formatProgress(progress));
});

router.patch("/journeys/:id/progress", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const parsed = UpdateJourneyProgressBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [journey] = await db.select().from(journeysTable).where(eq(journeysTable.id, id));
  if (!journey) { res.status(404).json({ error: "Not found" }); return; }

  const steps = parseJsonField<any[]>(journey.steps, []);
  const totalSteps = steps.length;
  const completedCount = parsed.data.completedSteps.length;
  const completionPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
  const completedAt = completionPercent >= 100 ? new Date() : undefined;

  let [existing] = await db.select().from(journeyProgressTable)
    .where(and(eq(journeyProgressTable.userId, user.id), eq(journeyProgressTable.journeyId, id)));

  let progress: typeof journeyProgressTable.$inferSelect;
  if (existing) {
    const updates: any = {
      currentStep: parsed.data.currentStep,
      completedSteps: JSON.stringify(parsed.data.completedSteps),
      completionPercent,
    };
    if (completedAt) updates.completedAt = completedAt;
    [progress] = await db.update(journeyProgressTable).set(updates)
      .where(and(eq(journeyProgressTable.userId, user.id), eq(journeyProgressTable.journeyId, id))).returning();
  } else {
    [progress] = await db.insert(journeyProgressTable).values({
      userId: user.id, journeyId: id,
      currentStep: parsed.data.currentStep,
      completedSteps: JSON.stringify(parsed.data.completedSteps),
      completionPercent, startedAt: new Date(),
      completedAt: completedAt || undefined,
    }).returning();
  }

  res.json(formatProgress(progress));
});

export default router;
