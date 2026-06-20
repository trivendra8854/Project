import { Router, type IRouter } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { MarkNotificationReadBody } from "@workspace/api-zod";

const router: IRouter = Router();

function formatNotification(n: typeof notificationsTable.$inferSelect) {
  return {
    id: n.id, type: n.type, title: n.title, message: n.message,
    isRead: n.isRead, createdAt: n.createdAt.toISOString(),
  };
}

router.get("/notifications", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const notifications = await db.select().from(notificationsTable)
    .where(eq(notificationsTable.userId, user.id))
    .orderBy(desc(notificationsTable.createdAt));
  res.json(notifications.map(formatNotification));
});

router.patch("/notifications/:id/read", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const parsed = MarkNotificationReadBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [existing] = await db.select().from(notificationsTable).where(eq(notificationsTable.id, id));
  if (!existing || existing.userId !== user.id) { res.status(404).json({ error: "Not found" }); return; }

  const [updated] = await db.update(notificationsTable).set({ isRead: parsed.data.isRead })
    .where(eq(notificationsTable.id, id)).returning();
  res.json(formatNotification(updated));
});

router.delete("/notifications/:id", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [existing] = await db.select().from(notificationsTable).where(eq(notificationsTable.id, id));
  if (!existing || existing.userId !== user.id) { res.status(404).json({ error: "Not found" }); return; }
  await db.delete(notificationsTable).where(eq(notificationsTable.id, id));
  res.sendStatus(204);
});

router.post("/notifications/mark-all-read", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  await db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.userId, user.id));
  res.json({ message: "All notifications marked as read" });
});

export default router;
