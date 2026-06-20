import { pgTable, text, serial, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const legalAidProvidersTable = pgTable("legal_aid_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode"),
  address: text("address").notNull(),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  practiceAreas: text("practice_areas").notNull().default("[]"),
  languages: text("languages").notNull().default("[]"),
  rating: real("rating"),
  description: text("description").notNull(),
});

export const insertLegalAidProviderSchema = createInsertSchema(legalAidProvidersTable).omit({ id: true });
export type InsertLegalAidProvider = z.infer<typeof insertLegalAidProviderSchema>;
export type LegalAidProvider = typeof legalAidProvidersTable.$inferSelect;
