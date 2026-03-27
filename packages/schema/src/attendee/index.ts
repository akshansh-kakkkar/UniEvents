import type { Attendee } from "@voltaze/db";
import { z } from "zod";

export type { Attendee };

export const attendeeSchema = z.object({
	id: z.string().cuid(),
	userId: z.string().cuid().nullable(),
	eventId: z.string().cuid(),
	name: z.string(),
	email: z.string().email(),
	phone: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
}) satisfies z.ZodType<Attendee>;

export const createAttendeeSchema = attendeeSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	})
	.extend({
		userId: z.string().cuid().optional().nullable(),
		eventId: z.string().cuid(),
		name: z.string().min(1).max(100),
		email: z.string().email(),
		phone: z
			.string()
			.regex(/^\+?[1-9]\d{1,14}$/)
			.optional()
			.nullable(),
	});

export const updateAttendeeSchema = createAttendeeSchema.partial().extend({
	name: z.string().min(1).max(100).optional(),
	email: z.string().email().optional(),
	phone: z
		.string()
		.regex(/^\+?[1-9]\d{1,14}$/)
		.optional()
		.nullable(),
});

export const attendeeFilterSchema = z.object({
	eventId: z.string().cuid().optional(),
	userId: z.string().cuid().optional(),
	search: z.string().optional(),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(20),
	sortBy: z.enum(["createdAt", "name", "email"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateAttendeeInput = z.infer<typeof createAttendeeSchema>;
export type UpdateAttendeeInput = z.infer<typeof updateAttendeeSchema>;
export type AttendeeFilterInput = z.infer<typeof attendeeFilterSchema>;
