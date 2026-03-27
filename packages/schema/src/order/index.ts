import type { Order } from "@voltaze/db";
import { z } from "zod";

export type { Order };

export const orderSchema = z.object({
	id: z.string().cuid(),
	attendeeId: z.string().cuid(),
	eventId: z.string().cuid(),
	status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
	deletedAt: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
}) satisfies z.ZodType<Order>;

export const createOrderSchema = orderSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		deletedAt: true,
		status: true,
	})
	.extend({
		attendeeId: z.string().cuid(),
		eventId: z.string().cuid(),
	});

export const updateOrderSchema = createOrderSchema.partial().extend({
	status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
});

export const orderFilterSchema = z.object({
	eventId: z.string().cuid().optional(),
	attendeeId: z.string().cuid().optional(),
	status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(20),
	sortBy: z.enum(["createdAt"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type OrderFilterInput = z.infer<typeof orderFilterSchema>;
