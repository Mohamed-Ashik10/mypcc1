import { z } from "zod";

// ─── Hymn ─────────────────────────────────────────────────────────────────────
export const HymnSchema = z.object({
    number: z.coerce.number().int().positive("Hymn number must be a positive integer"),
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    author: z.string().max(200).optional(),
    lyrics: z.string().min(1, "Lyrics are required"),
    tags: z.string().max(500).optional(),
    tuneUrl: z.string().url().max(500).optional().or(z.literal("")),
});

export type HymnInput = z.infer<typeof HymnSchema>;

// ─── Diary Entry ──────────────────────────────────────────────────────────────
export const DiaryEntrySchema = z.object({
    date: z.string().min(1, "Date is required").refine(
        (d) => !isNaN(Date.parse(d)),
        "Invalid date format"
    ),
    title: z.string().max(300).optional(),
    readingOne: z.string().optional(),
    readingTwo: z.string().optional(),
    readingThree: z.string().optional(),
    theme: z.string().max(500).optional(),
    body: z.string().optional(),
    hymn: z.string().optional(),
    userId: z.string().optional(),
});

export type DiaryEntryInput = z.infer<typeof DiaryEntrySchema>;

// ─── Devotional ───────────────────────────────────────────────────────────────
export const DevotionalSchema = z.object({
    title: z.string().min(1, "Title is required").max(300),
    date: z.string().min(1, "Date is required").refine(
        (d) => !isNaN(Date.parse(d)),
        "Invalid date format"
    ),
    content: z.string().min(1, "Content is required"),
    author: z.string().max(200).optional(),
});

export type DevotionalInput = z.infer<typeof DevotionalSchema>;

// ─── Announcement ─────────────────────────────────────────────────────────────
export const AnnouncementSchema = z.object({
    title: z.string().min(1, "Title is required").max(300),
    content: z.string().min(1, "Content is required"),
    isActive: z.boolean().optional().default(true),
});

export type AnnouncementInput = z.infer<typeof AnnouncementSchema>;

// ─── The Echo Issue ───────────────────────────────────────────────────────────
export const EchoIssueSchema = z.object({
    title: z.string().min(1, "Title is required").max(300),
    issueMonth: z.string().min(1, "Issue month is required").refine(
        (d) => !isNaN(Date.parse(d)),
        "Invalid date format"
    ),
    excerpt: z.string().max(1000).optional(),
    fullText: z.string().optional(),
    author: z.string().max(200).optional(),
    category: z.string().max(100).optional(),
    pdfUrl: z.string().url("Invalid PDF URL").optional().or(z.literal("")),
    coverUrl: z.string().url("Invalid cover URL").optional().or(z.literal("")),
});

export type EchoIssueInput = z.infer<typeof EchoIssueSchema>;

// ─── Auth / Register ──────────────────────────────────────────────────────────
export const RegisterSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["USER", "EDITOR", "ADMIN", "SUPER_ADMIN"]).optional().default("USER"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
