import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const schemesTable = pgTable("schemes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  eligibility: text("eligibility").notNull(),
  benefits: text("benefits").notNull(),
  requiredDocuments: text("required_documents").notNull().default("[]"),
  applicationProcess: text("application_process").notNull(),
  officialLink: text("official_link"),
  ministry: text("ministry").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSchemeSchema = createInsertSchema(schemesTable).omit({ id: true, createdAt: true });
export type InsertScheme = z.infer<typeof insertSchemeSchema>;
export type Scheme = typeof schemesTable.$inferSelect;
