import type { Event, TicketTier } from "@voltaze/db";
import { z } from "zod";

export type { Event, TicketTier };

export const eventSchema = z.object({
	id: z.string().cuid(),
	name: z.string(),
	slug: z.string(),
	userId: z.string().cuid().nullable(),
	coverUrl: z.string(),
	thumbnail: z.string(),
	venueName: z.string(),
	address: z.string(),
	latitude: z.string(),
	longitude: z.string(),
	timezone: z.string(),
	startDate: z.date(),
	endDate: z.date(),
	type: z.enum(["FREE", "PAID"]),
	mode: z.enum(["ONLINE", "OFFLINE"]),
	visibility: z.enum(["PUBLIC", "PRIVATE"]),
	status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]),
	description: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
}) satisfies z.ZodType<Event>;

export const createEventSchema = eventSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		slug: true,
	})
	.extend({
		name: z.string().min(1).max(200),
		coverUrl: z.string().url(),
		thumbnail: z.string().url(),
		venueName: z.string().min(1).max(200),
		address: z.string().min(1).max(500),
		latitude: z.string(),
		longitude: z.string(),
		timezone: z.string(),
		startDate: z.coerce.date(),
		endDate: z.coerce.date(),
		type: z.enum(["FREE", "PAID"]),
		mode: z.enum(["ONLINE", "OFFLINE"]),
		visibility: z.enum(["PUBLIC", "PRIVATE"]),
		description: z.string().min(1).max(5000),
	});

export const updateEventSchema = createEventSchema.partial().extend({
	name: z.string().min(1).max(200).optional(),
	coverUrl: z.string().url().optional(),
	thumbnail: z.string().url().optional(),
	venueName: z.string().min(1).max(200).optional(),
	address: z.string().min(1).max(500).optional(),
	latitude: z.string().optional(),
	longitude: z.string().optional(),
	timezone: z.string().optional(),
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
	type: z.enum(["FREE", "PAID"]).optional(),
	mode: z.enum(["ONLINE", "OFFLINE"]).optional(),
	visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
	status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]).optional(),
	description: z.string().min(1).max(5000).optional(),
});

export const eventFilterSchema = z.object({
	userId: z.string().cuid().optional(),
	status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]).optional(),
	type: z.enum(["FREE", "PAID"]).optional(),
	mode: z.enum(["ONLINE", "OFFLINE"]).optional(),
	visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
	search: z.string().optional(),
	startDateFrom: z.coerce.date().optional(),
	startDateTo: z.coerce.date().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
	sortBy: z.enum(["createdAt", "startDate", "name"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const eventTicketTierParamsSchema = z.object({
	eventId: z.string().cuid(),
});

export const eventTicketTierIdParamsSchema = z.object({
	eventId: z.string().cuid(),
	tierId: z.string().cuid(),
});

export const ticketTierFilterSchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
	sortBy: z.enum(["createdAt", "price", "name"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const ticketTierSchema = z.object({
	id: z.string().cuid(),
	eventId: z.string().cuid(),
	name: z.string(),
	description: z.string().nullable(),
	price: z.number().int(),
	maxQuantity: z.number().int(),
	soldCount: z.number().int(),
	salesStart: z.date().nullable(),
	salesEnd: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
}) satisfies z.ZodType<TicketTier>;

export const createTicketTierSchema = ticketTierSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		soldCount: true,
	})
	.extend({
		name: z.string().min(1).max(100),
		description: z.string().max(500).optional(),
		price: z.number().int().min(0),
		maxQuantity: z.number().int().positive(),
		salesStart: z.coerce.date().optional(),
		salesEnd: z.coerce.date().optional(),
	});

export const updateTicketTierSchema = createTicketTierSchema.partial().extend({
	name: z.string().min(1).max(100).optional(),
	description: z.string().max(500).optional(),
	price: z.number().int().min(0).optional(),
	maxQuantity: z.number().int().positive().optional(),
	salesStart: z.coerce.date().optional(),
	salesEnd: z.coerce.date().optional(),
});

export const createEventTicketTierSchema = createTicketTierSchema.omit({
	eventId: true,
});

export const updateEventTicketTierSchema = updateTicketTierSchema.omit({
	eventId: true,
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventFilterInput = z.infer<typeof eventFilterSchema>;
export type TicketTierFilterInput = z.infer<typeof ticketTierFilterSchema>;
export type CreateTicketTierInput = z.infer<typeof createTicketTierSchema>;
export type UpdateTicketTierInput = z.infer<typeof updateTicketTierSchema>;
export type CreateEventTicketTierInput = z.infer<
	typeof createEventTicketTierSchema
>;
export type UpdateEventTicketTierInput = z.infer<
	typeof updateEventTicketTierSchema
>;
