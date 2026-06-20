import { Router, type IRouter } from "express";
import { db, complaintsTable, documentsTable, journeyProgressTable, notificationsTable, schemesTable, rightsArticlesTable } from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function parseJsonField<T>(val: string | null, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

router.get("/dashboard/stats", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const userId = user.id;

  const [complaints, documents, journeys, notifications, schemes, rights] = await Promise.all([
    db.select().from(complaintsTable).where(eq(complaintsTable.userId, userId)).orderBy(desc(complaintsTable.createdAt)).limit(5),
    db.select().from(documentsTable).where(eq(documentsTable.userId, userId)).orderBy(desc(documentsTable.createdAt)).limit(5),
    db.select().from(journeyProgressTable).where(eq(journeyProgressTable.userId, userId)),
    db.select().from(notificationsTable).where(eq(notificationsTable.userId, userId)),
    db.select().from(schemesTable).limit(3),
    db.select().from(rightsArticlesTable).limit(3),
  ]);

  const unread = notifications.filter(n => !n.isRead).length;

  const recentActivity = [
    ...complaints.slice(0, 2).map(c => ({ id: c.id, type: "complaint", description: `Complaint: ${c.title}`, createdAt: c.createdAt.toISOString() })),
    ...documents.slice(0, 2).map(d => ({ id: d.id, type: "document", description: `Document: ${d.name}`, createdAt: d.createdAt.toISOString() })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const formatComplaint = (c: typeof complaintsTable.$inferSelect) => ({
    id: c.id, type: c.type, title: c.title, content: c.content, status: c.status, answers: c.answers,
    createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString(),
  });

  const formatDocument = (d: typeof documentsTable.$inferSelect) => ({
    id: d.id, name: d.name, originalName: d.originalName, category: d.category,
    mimeType: d.mimeType, size: d.size, filePath: d.filePath, createdAt: d.createdAt.toISOString(),
  });

  const formatScheme = (s: typeof schemesTable.$inferSelect) => ({
    id: s.id, title: s.title, description: s.description, category: s.category,
    eligibility: s.eligibility, benefits: s.benefits,
    requiredDocuments: parseJsonField<string[]>(s.requiredDocuments, []),
    applicationProcess: s.applicationProcess, officialLink: s.officialLink, ministry: s.ministry,
    createdAt: s.createdAt.toISOString(),
  });

  const formatRights = (r: typeof rightsArticlesTable.$inferSelect) => ({
    id: r.id, title: r.title, summary: r.summary, content: r.content, category: r.category,
    relevantLaws: parseJsonField<string[]>(r.relevantLaws, []),
    legalProvisions: parseJsonField<string[]>(r.legalProvisions, []),
    governmentResources: parseJsonField<string[]>(r.governmentResources, []),
    createdAt: r.createdAt.toISOString(),
  });

  res.json({
    welcomeMessage: `Welcome back, ${user.fullName.split(" ")[0]}!`,
    totalDocuments: documents.length,
    totalComplaints: complaints.length,
    activeJourneys: journeys.filter(j => !j.completedAt).length,
    unreadNotifications: unread,
    recentComplaints: complaints.map(formatComplaint),
    recentDocuments: documents.map(formatDocument),
    recentActivity,
    featuredSchemes: schemes.map(formatScheme),
    legalRightsHighlight: rights.map(formatRights),
  });
});

export default router;
