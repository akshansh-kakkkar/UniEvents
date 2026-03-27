import type { CheckIn } from "@voltaze/db";
import { z } from "zod";

export type { CheckIn };

export const checkInSchema = z.object({
	id: z.string().cuid(),
	attendeeId: z.string().cuid(),
	eventId: z.string().cuid(),
	timestamp: z.date(),
	method: z.enum(["QR_SCAN", "MANUAL"]),
}) satisfies z.ZodType<CheckIn>;

export const createCheckInSchema = checkInSchema
	.omit({
		id: true,
		timestamp: true,
	})
	.extend({
		attendeeId: z.string().cuid(),
		eventId: z.string().cuid(),
		method: z.enum(["QR_SCAN", "MANUAL"]),
	});

export const checkInFilterSchema = z.object({
	eventId: z.string().cuid().optional(),
	attendeeId: z.string().cuid().optional(),
	method: z.enum(["QR_SCAN", "MANUAL"]).optional(),
	dateFrom: z.coerce.date().optional(),
	dateTo: z.coerce.date().optional(),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(20),
	sortBy: z.enum(["timestamp"]).default("timestamp"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateCheckInInput = z.infer<typeof createCheckInSchema>;
export type CheckInFilterInput = z.infer<typeof checkInFilterSchema>;
