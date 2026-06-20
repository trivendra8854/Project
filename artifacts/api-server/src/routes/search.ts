import { Router, type IRouter } from "express";
import { db, rightsArticlesTable, schemesTable, complaintsTable, documentsTable, learningContentTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function parseJsonField<T>(val: string | null, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

router.get("/search", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const { q } = req.query as Record<string, string>;
  if (!q || q.trim().length < 2) {
    res.json({ rights: [], schemes: [], complaints: [], documents: [], learning: [] });
    return;
  }

  const ql = q.toLowerCase();
  const [allRights, allSchemes, allComplaints, allDocuments, allLearning] = await Promise.all([
    db.select().from(rightsArticlesTable),
    db.select().from(schemesTable),
    db.select().from(complaintsTable).where(eq(complaintsTable.userId, user.id)),
    db.select().from(documentsTable).where(eq(documentsTable.userId, user.id)),
    db.select().from(learningContentTable),
  ]);

  res.json({
    rights: allRights.filter(r => r.title.toLowerCase().includes(ql) || r.summary.toLowerCase().includes(ql)).slice(0, 5).map(r => ({
      id: r.id, title: r.title, summary: r.summary, content: r.content, category: r.category,
      relevantLaws: parseJsonField<string[]>(r.relevantLaws, []),
      legalProvisions: parseJsonField<string[]>(r.legalProvisions, []),
      governmentResources: parseJsonField<string[]>(r.governmentResources, []),
      createdAt: r.createdAt.toISOString(),
    })),
    schemes: allSchemes.filter(s => s.title.toLowerCase().includes(ql) || s.description.toLowerCase().includes(ql)).slice(0, 5).map(s => ({
      id: s.id, title: s.title, description: s.description, category: s.category,
      eligibility: s.eligibility, benefits: s.benefits,
      requiredDocuments: parseJsonField<string[]>(s.requiredDocuments, []),
      applicationProcess: s.applicationProcess, officialLink: s.officialLink, ministry: s.ministry,
      createdAt: s.createdAt.toISOString(),
    })),
    complaints: allComplaints.filter(c => c.title.toLowerCase().includes(ql) || c.type.toLowerCase().includes(ql)).slice(0, 5).map(c => ({
      id: c.id, type: c.type, title: c.title, content: c.content, status: c.status,
      answers: c.answers, createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString(),
    })),
    documents: allDocuments.filter(d => d.name.toLowerCase().includes(ql) || d.originalName.toLowerCase().includes(ql)).slice(0, 5).map(d => ({
      id: d.id, name: d.name, originalName: d.originalName, category: d.category,
      mimeType: d.mimeType, size: d.size, filePath: d.filePath, createdAt: d.createdAt.toISOString(),
    })),
    learning: allLearning.filter(l => l.title.toLowerCase().includes(ql) || l.summary.toLowerCase().includes(ql)).slice(0, 5).map(l => ({
      id: l.id, title: l.title, summary: l.summary, content: l.content, type: l.type,
      tags: parseJsonField<string[]>(l.tags, []), isBookmarked: false, createdAt: l.createdAt.toISOString(),
    })),
  });
});

export default router;
