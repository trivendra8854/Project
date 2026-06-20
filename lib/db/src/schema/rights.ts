import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const rightsArticlesTable = pgTable("rights_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  relevantLaws: text("relevant_laws").notNull().default("[]"),
  legalProvisions: text("legal_provisions").notNull().default("[]"),
  governmentResources: text("government_resources").notNull().default("[]"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertRightsArticleSchema = createInsertSchema(rightsArticlesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertRightsArticle = z.infer<typeof insertRightsArticleSchema>;
export type RightsArticle = typeof rightsArticlesTable.$inferSelect;
