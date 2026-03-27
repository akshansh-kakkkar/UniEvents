import type { Payment } from "@voltaze/db";
import { z } from "zod";

export type { Payment };

export const paymentSchema = z.object({
	id: z.string().cuid(),
	orderId: z.string().cuid(),
	amount: z.number().int(),
	currency: z.string(),
	gateway: z.enum(["RAZORPAY"]),
	transactionId: z.string().nullable(),
	gatewayMeta: z.any().nullable(),
	status: z.enum(["PENDING", "SUCCESS", "FAILED", "REFUNDED"]),
	deletedAt: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const createPaymentSchema = paymentSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		deletedAt: true,
		transactionId: true,
		gatewayMeta: true,
		status: true,
	})
	.extend({
		orderId: z.string().cuid(),
		amount: z.number().int().positive(),
		currency: z.string().default("INR"),
		gateway: z.enum(["RAZORPAY"]),
	});

export const updatePaymentSchema = createPaymentSchema.partial().extend({
	status: z.enum(["PENDING", "SUCCESS", "FAILED", "REFUNDED"]).optional(),
	transactionId: z.string().optional(),
	gatewayMeta: z.unknown().optional(),
});

export const razorpayWebhookSchema = z.object({
	event: z.string(),
	payload: z.object({
		payment: z.object({
			id: z.string(),
			order_id: z.string(),
			amount: z.number().int(),
			currency: z.string(),
			status: z.string(),
		}),
	}),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type RazorpayWebhookInput = z.infer<typeof razorpayWebhookSchema>;
