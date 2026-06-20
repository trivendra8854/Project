import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { UpdateProfileBody, ChangePasswordBody } from "@workspace/api-zod";
import { formatUser } from "./auth";

const router: IRouter = Router();

router.get("/users/profile", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  res.json(formatUser(user));
});

router.patch("/users/profile", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Partial<typeof usersTable.$inferInsert> = {};
  const data = parsed.data;
  if (data.fullName != null) updates.fullName = data.fullName;
  if (data.mobile != null) updates.mobile = data.mobile;
  if (data.aadhaar != null) updates.aadhaar = data.aadhaar;
  if (data.address != null) updates.address = data.address;
  if (data.preferredLanguage != null) updates.preferredLanguage = data.preferredLanguage;
  if (data.profilePhoto != null) updates.profilePhoto = data.profilePhoto;

  const [updated] = await db.update(usersTable).set(updates).where(eq(usersTable.id, user.id)).returning();
  res.json(formatUser(updated));
});

router.post("/users/change-password", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const parsed = ChangePasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { currentPassword, newPassword } = parsed.data;
  const [dbUser] = await db.select().from(usersTable).where(eq(usersTable.id, user.id));
  const valid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
  if (!valid) {
    res.status(400).json({ error: "Current password is incorrect" });
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, user.id));
  res.json({ message: "Password changed successfully" });
});

export default router;
