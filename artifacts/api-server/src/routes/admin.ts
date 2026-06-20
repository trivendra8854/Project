import { Router, type IRouter } from "express";
import { db, usersTable, documentsTable, complaintsTable, chatSessionsTable, rightsArticlesTable } from "@workspace/db";
import { eq, ilike, desc, count } from "drizzle-orm";
import { requireAdmin, signToken } from "../middlewares/auth";
import bcrypt from "bcryptjs";
import { AdminLoginBody } from "@workspace/api-zod";
import { formatUser } from "./auth";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, parsed.data.email));
  if (!user || user.role !== "admin") {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) { res.status(401).json({ error: "Invalid credentials" }); return; }

  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  res.json({ user: formatUser(user), token });
});

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  const [users, docs, complaints, sessions, rights] = await Promise.all([
    db.select().from(usersTable),
    db.select().from(documentsTable),
    db.select().from(complaintsTable),
    db.select().from(chatSessionsTable),
    db.select().from(rightsArticlesTable),
  ]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const complaintTypeCounts: Record<string, number> = {};
  complaints.forEach(c => { complaintTypeCounts[c.type] = (complaintTypeCounts[c.type] || 0) + 1; });

  const rightsCategoryCounts: Record<string, number> = {};
  rights.forEach(r => { rightsCategoryCounts[r.category] = (rightsCategoryCounts[r.category] || 0) + 1; });

  res.json({
    totalUsers: users.length,
    totalDocuments: docs.length,
    totalComplaints: complaints.length,
    totalSessions: sessions.length,
    newUsersThisMonth: users.filter(u => u.createdAt >= monthStart).length,
    activeUsersToday: users.filter(u => u.createdAt >= todayStart).length,
    topComplaintTypes: Object.entries(complaintTypeCounts).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 5),
    topRightsCategories: Object.entries(rightsCategoryCounts).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 5),
  });
});

router.get("/admin/users", requireAdmin, async (req, res): Promise<void> => {
  const { q, page = "1" } = req.query as Record<string, string>;
  const pageNum = parseInt(page, 10);
  const limit = 20;
  const offset = (pageNum - 1) * limit;

  const all = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
  let filtered = all;
  if (q) filtered = filtered.filter(u => u.fullName.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));

  const total = filtered.length;
  const users = filtered.slice(offset, offset + limit).map(formatUser);
  res.json({ users, total, page: pageNum, totalPages: Math.ceil(total / limit) });
});

router.delete("/admin/users/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  await db.delete(usersTable).where(eq(usersTable.id, id));
  res.sendStatus(204);
});

export default router;
