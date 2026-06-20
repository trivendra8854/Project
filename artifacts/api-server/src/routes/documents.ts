import { Router, type IRouter } from "express";
import { db, documentsTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { UpdateDocumentBody } from "@workspace/api-zod";
import multer from "multer";
import path from "path";
import fs from "fs";

const router: IRouter = Router();

const workspaceRoot = process.cwd().endsWith(path.join("artifacts", "api-server"))
  ? path.resolve(process.cwd(), "../..")
  : process.cwd();

const uploadsDir = path.resolve(workspaceRoot, "artifacts/api-server/uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png", "image/gif", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});

function formatDocument(d: typeof documentsTable.$inferSelect) {
  return {
    id: d.id, name: d.name, originalName: d.originalName, category: d.category,
    mimeType: d.mimeType, size: d.size, filePath: d.filePath, createdAt: d.createdAt.toISOString(),
  };
}

router.get("/documents", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const { q, category } = req.query as Record<string, string>;

  const all = await db.select().from(documentsTable).where(eq(documentsTable.userId, user.id));
  let filtered = all;
  if (q) filtered = filtered.filter(d => d.name.toLowerCase().includes(q.toLowerCase()) || d.originalName.toLowerCase().includes(q.toLowerCase()));
  if (category) filtered = filtered.filter(d => d.category === category);

  res.json(filtered.map(formatDocument));
});

router.post("/documents/upload", requireAuth, upload.single("file"), async (req, res): Promise<void> => {
  const user = (req as any).user;
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  const [doc] = await db.insert(documentsTable).values({
    userId: user.id,
    name: req.body.name || req.file.originalname,
    originalName: req.file.originalname,
    category: req.body.category || null,
    mimeType: req.file.mimetype,
    size: req.file.size,
    filePath: `/uploads/${req.file.filename}`,
  }).returning();

  res.status(201).json(formatDocument(doc));
});

router.get("/documents/:id", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [doc] = await db.select().from(documentsTable).where(eq(documentsTable.id, id));
  if (!doc || doc.userId !== user.id) { res.status(404).json({ error: "Not found" }); return; }
  res.json(formatDocument(doc));
});

router.patch("/documents/:id", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const parsed = UpdateDocumentBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [existing] = await db.select().from(documentsTable).where(eq(documentsTable.id, id));
  if (!existing || existing.userId !== user.id) { res.status(404).json({ error: "Not found" }); return; }

  const updates: any = {};
  if (parsed.data.name != null) updates.name = parsed.data.name;
  if (parsed.data.category != null) updates.category = parsed.data.category;

  const [updated] = await db.update(documentsTable).set(updates).where(eq(documentsTable.id, id)).returning();
  res.json(formatDocument(updated));
});

router.delete("/documents/:id", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [existing] = await db.select().from(documentsTable).where(eq(documentsTable.id, id));
  if (!existing || existing.userId !== user.id) { res.status(404).json({ error: "Not found" }); return; }

  try {
    const filePath = path.join(uploadsDir, path.basename(existing.filePath));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {}

  await db.delete(documentsTable).where(eq(documentsTable.id, id));
  res.sendStatus(204);
});

export default router;
