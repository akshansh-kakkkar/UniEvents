import type { Ticket } from "@voltaze/db";
import { z } from "zod";

export type { Ticket };

export const ticketSchema = z.object({
	id: z.string().cuid(),
	orderId: z.string().cuid(),
	eventId: z.string().cuid(),
	tierId: z.string().cuid(),
	pricePaid: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
}) satisfies z.ZodType<Ticket>;

export const createTicketSchema = ticketSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		pricePaid: true,
	})
	.extend({
		orderId: z.string().cuid(),
		eventId: z.string().cuid(),
		tierId: z.string().cuid(),
	});

export const updateTicketSchema = createTicketSchema.partial();

export const ticketFilterSchema = z.object({
	orderId: z.string().cuid().optional(),
	eventId: z.string().cuid().optional(),
	tierId: z.string().cuid().optional(),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(20),
	sortBy: z.enum(["createdAt"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type TicketFilterInput = z.infer<typeof ticketFilterSchema>;
