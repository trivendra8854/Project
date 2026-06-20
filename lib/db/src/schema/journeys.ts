import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const journeysTable = pgTable("journeys", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  estimatedDays: integer("estimated_days").notNull().default(30),
  eligibility: text("eligibility").notNull(),
  requiredDocuments: text("required_documents").notNull().default("[]"),
  applicableLaws: text("applicable_laws").notNull().default("[]"),
  steps: text("steps").notNull().default("[]"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const journeyProgressTable = pgTable("journey_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  journeyId: integer("journey_id").notNull().references(() => journeysTable.id, { onDelete: "cascade" }),
  currentStep: integer("current_step").notNull().default(1),
  completedSteps: text("completed_steps").notNull().default("[]"),
  completionPercent: integer("completion_percent").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const insertJourneySchema = createInsertSchema(journeysTable).omit({ id: true, createdAt: true });
export type InsertJourney = z.infer<typeof insertJourneySchema>;
export type Journey = typeof journeysTable.$inferSelect;

export const insertJourneyProgressSchema = createInsertSchema(journeyProgressTable).omit({ id: true });
export type InsertJourneyProgress = z.infer<typeof insertJourneyProgressSchema>;
export type JourneyProgress = typeof journeyProgressTable.$inferSelect;
