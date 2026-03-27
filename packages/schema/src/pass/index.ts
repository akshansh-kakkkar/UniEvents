import type { Pass } from "@voltaze/db";
import { z } from "zod";

export type { Pass };

export const passSchema = z.object({
	id: z.string().cuid(),
	eventId: z.string().cuid(),
	attendeeId: z.string().cuid(),
	ticketId: z.string().cuid(),
	type: z.enum(["GENERAL", "VIP", "BACKSTAGE", "SPEAKER"]),
	status: z.enum(["ACTIVE", "USED", "CANCELLED"]),
	code: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
}) satisfies z.ZodType<Pass>;

export const createPassSchema = passSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		code: true,
		status: true,
	})
	.extend({
		eventId: z.string().cuid(),
		attendeeId: z.string().cuid(),
		ticketId: z.string().cuid(),
		type: z.enum(["GENERAL", "VIP", "BACKSTAGE", "SPEAKER"]).default("GENERAL"),
	});

export const updatePassSchema = createPassSchema.partial().extend({
	type: z.enum(["GENERAL", "VIP", "BACKSTAGE", "SPEAKER"]).optional(),
	status: z.enum(["ACTIVE", "USED", "CANCELLED"]).optional(),
});

export const validatePassSchema = z.object({
	code: z.string(),
	eventId: z.string().cuid(),
});

export type CreatePassInput = z.infer<typeof createPassSchema>;
export type UpdatePassInput = z.infer<typeof updatePassSchema>;
export type ValidatePassInput = z.infer<typeof validatePassSchema>;
