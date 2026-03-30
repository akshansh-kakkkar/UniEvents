import {
	createPaymentSchema,
	idParamSchema,
	paymentFilterSchema,
	razorpayWebhookSchema,
	updatePaymentSchema,
} from "@voltaze/schema";
import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "@/common/types/auth-request";

import { paymentsService } from "./payments.service";

export class PaymentsController {
	private getActor(req: Request) {
		const authReq = req as AuthenticatedRequest;
		return {
			userId: authReq.auth.userId,
			role: authReq.auth.role,
		};
	}

	async list(req: Request, res: Response) {
		const query = paymentFilterSchema.parse(req.query);
		const payments = await paymentsService.list(query, this.getActor(req));
		res.status(200).json(payments);
	}

	async getById(req: Request, res: Response) {
		const params = idParamSchema.parse(req.params);
		const payment = await paymentsService.getById(
			params.id,
			this.getActor(req),
		);
		res.status(200).json(payment);
	}

	async create(req: Request, res: Response) {
		const body = createPaymentSchema.parse(req.body);
		const payment = await paymentsService.create(body, this.getActor(req));
		res.status(201).json(payment);
	}

	async update(req: Request, res: Response) {
		const params = idParamSchema.parse(req.params);
		const body = updatePaymentSchema.parse(req.body);
		const payment = await paymentsService.update(
			params.id,
			body,
			this.getActor(req),
		);
		res.status(200).json(payment);
	}

	async webhook(req: Request, res: Response) {
		const body = razorpayWebhookSchema.parse(req.body);
		const payment = await paymentsService.handleWebhook(body);
		res.status(200).json(payment);
	}
}

export const paymentsController = new PaymentsController();
