import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const complaintTemplatesTable = pgTable("complaint_templates", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  questions: text("questions").notNull().default("[]"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const complaintsTable = pgTable("complaints", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("draft"),
  answers: text("answers").notNull().default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertComplaintTemplateSchema = createInsertSchema(complaintTemplatesTable).omit({ id: true, createdAt: true });
export type InsertComplaintTemplate = z.infer<typeof insertComplaintTemplateSchema>;
export type ComplaintTemplate = typeof complaintTemplatesTable.$inferSelect;

export const insertComplaintSchema = createInsertSchema(complaintsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaintsTable.$inferSelect;
