import { Router, type IRouter } from "express";
import { db, complaintsTable, complaintTemplatesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateComplaintBody, UpdateComplaintBody } from "@workspace/api-zod";

const router: IRouter = Router();

function parseJsonField<T>(val: string | null, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

function formatComplaint(c: typeof complaintsTable.$inferSelect) {
  return {
    id: c.id, type: c.type, title: c.title, content: c.content, status: c.status,
    answers: c.answers, createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString(),
  };
}

function formatTemplate(t: typeof complaintTemplatesTable.$inferSelect) {
  return {
    id: t.id, type: t.type, title: t.title, description: t.description,
    questions: parseJsonField<any[]>(t.questions, []),
  };
}

router.get("/complaints/templates", requireAuth, async (_req, res): Promise<void> => {
  const templates = await db.select().from(complaintTemplatesTable);
  res.json(templates.map(formatTemplate));
});

router.get("/complaints", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const complaints = await db.select().from(complaintsTable)
    .where(eq(complaintsTable.userId, user.id))
    .orderBy(desc(complaintsTable.createdAt));
  res.json(complaints.map(formatComplaint));
});

router.post("/complaints", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const parsed = CreateComplaintBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [complaint] = await db.insert(complaintsTable).values({
    userId: user.id,
    type: parsed.data.type,
    title: parsed.data.title,
    content: parsed.data.content,
    answers: parsed.data.answers || "{}",
    status: "draft",
  }).returning();

  res.status(201).json(formatComplaint(complaint));
});

router.get("/complaints/:id", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [complaint] = await db.select().from(complaintsTable).where(eq(complaintsTable.id, id));
  if (!complaint || complaint.userId !== user.id) { res.status(404).json({ error: "Not found" }); return; }
  res.json(formatComplaint(complaint));
});

router.patch("/complaints/:id", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const parsed = UpdateComplaintBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [existing] = await db.select().from(complaintsTable).where(eq(complaintsTable.id, id));
  if (!existing || existing.userId !== user.id) { res.status(404).json({ error: "Not found" }); return; }

  const updates: any = {};
  if (parsed.data.title != null) updates.title = parsed.data.title;
  if (parsed.data.content != null) updates.content = parsed.data.content;
  if (parsed.data.status != null) updates.status = parsed.data.status;

  const [updated] = await db.update(complaintsTable).set(updates).where(eq(complaintsTable.id, id)).returning();
  res.json(formatComplaint(updated));
});

router.delete("/complaints/:id", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [existing] = await db.select().from(complaintsTable).where(eq(complaintsTable.id, id));
  if (!existing || existing.userId !== user.id) { res.status(404).json({ error: "Not found" }); return; }
  await db.delete(complaintsTable).where(eq(complaintsTable.id, id));
  res.sendStatus(204);
});

export default router;
