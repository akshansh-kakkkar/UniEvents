import { createPaymentSchema, updatePaymentSchema } from "@voltaze/schema";
import type { Request, RequestHandler, Response } from "express";
import { controller, created, ok, validateBody } from "../../lib/controller.js";
import * as paymentsService from "./payments.service.js";

export const createPayment: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const payment = await paymentsService.createPayment(req.body);
		created(res, payment);
	},
);

export const getPayment: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const payment = await paymentsService.getPaymentById(
			req.params.id as string,
		);
		ok(res, payment);
	},
);

export const getPaymentByOrderId: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const payment = await paymentsService.getPaymentByOrderId(
			req.params.orderId as string,
		);
		if (!payment) {
			res.status(404).json({
				success: false,
				error: { message: "Payment not found", code: "NOT_FOUND" },
			});
			return;
		}
		ok(res, payment);
	},
);

export const updatePaymentStatus: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const payment = await paymentsService.updatePaymentStatus(
			req.params.id as string,
			req.body.status,
			req.body.transactionId,
		);
		ok(res, payment);
	},
);

export const handleWebhook: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const result = await paymentsService.processWebhook(
			req.body.gateway,
			req.body,
		);
		ok(res, result);
	},
);

export const refundPayment: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const payment = await paymentsService.refundPayment(
			req.params.id as string,
		);
		ok(res, payment);
	},
);

export { createPaymentSchema, updatePaymentSchema, validateBody };
