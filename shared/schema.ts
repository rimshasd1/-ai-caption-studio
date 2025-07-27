import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const captions = pgTable("captions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  description: text("description").notNull(),
  tones: jsonb("tones").$type<string[]>().notNull(),
  results: jsonb("results").$type<CaptionResult[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type CaptionResult = {
  tone: string;
  text: string;
  characterCount: number;
  suggestedHashtags?: string[];
};

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCaptionSchema = createInsertSchema(captions).pick({
  description: true,
  tones: true,
}).extend({
  description: z.string().min(10, "Description must be at least 10 characters"),
  tones: z.array(z.string()).min(1, "Select at least one tone").max(3, "Select up to 3 tones"),
});

export const generateCaptionRequestSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  tones: z.array(z.string()).min(1, "Select at least one tone").max(3, "Select up to 3 tones"),
  imageBase64: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Caption = typeof captions.$inferSelect;
export type InsertCaption = z.infer<typeof insertCaptionSchema>;
export type GenerateCaptionRequest = z.infer<typeof generateCaptionRequestSchema>;
