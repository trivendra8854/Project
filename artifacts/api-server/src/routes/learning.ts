import { Router, type IRouter } from "express";
import { db, learningContentTable, bookmarksTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { BookmarkContentBody } from "@workspace/api-zod";

const router: IRouter = Router();

function parseJsonField<T>(val: string | null, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

async function formatContent(c: typeof learningContentTable.$inferSelect, userId: number) {
  const [bookmark] = await db.select().from(bookmarksTable)
    .where(and(eq(bookmarksTable.userId, userId), eq(bookmarksTable.contentId, c.id)));
  return {
    id: c.id, title: c.title, summary: c.summary, content: c.content, type: c.type,
    tags: parseJsonField<string[]>(c.tags, []),
    isBookmarked: !!bookmark,
    createdAt: c.createdAt.toISOString(),
  };
}

router.get("/learning", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const { type, q } = req.query as Record<string, string>;

  const all = await db.select().from(learningContentTable);
  let filtered = all;
  if (type) filtered = filtered.filter(c => c.type === type);
  if (q) filtered = filtered.filter(c => c.title.toLowerCase().includes(q.toLowerCase()));

  const formatted = await Promise.all(filtered.map(c => formatContent(c, user.id)));
  res.json(formatted);
});

router.get("/learning/bookmarks", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const bookmarks = await db.select().from(bookmarksTable).where(eq(bookmarksTable.userId, user.id));
  const contents = await Promise.all(
    bookmarks.map(async b => {
      const [c] = await db.select().from(learningContentTable).where(eq(learningContentTable.id, b.contentId));
      if (!c) return null;
      return formatContent(c, user.id);
    })
  );
  res.json(contents.filter(Boolean));
});

router.get("/learning/:id", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [content] = await db.select().from(learningContentTable).where(eq(learningContentTable.id, id));
  if (!content) { res.status(404).json({ error: "Not found" }); return; }
  res.json(await formatContent(content, user.id));
});

router.post("/learning/:id/bookmark", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const parsed = BookmarkContentBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [existing] = await db.select().from(bookmarksTable)
    .where(and(eq(bookmarksTable.userId, user.id), eq(bookmarksTable.contentId, id)));

  if (parsed.data.bookmarked && !existing) {
    await db.insert(bookmarksTable).values({ userId: user.id, contentId: id });
    res.json({ message: "Bookmarked" });
  } else if (!parsed.data.bookmarked && existing) {
    await db.delete(bookmarksTable).where(and(eq(bookmarksTable.userId, user.id), eq(bookmarksTable.contentId, id)));
    res.json({ message: "Bookmark removed" });
  } else {
    res.json({ message: parsed.data.bookmarked ? "Already bookmarked" : "Not bookmarked" });
  }
});

export default router;
