import {
	createPaymentSchema,
	idParamSchema,
	paymentFilterSchema,
	razorpayWebhookSchema,
	updatePaymentSchema,
} from "@voltaze/schema";
import { Router } from "express";

import {
	requireAuth,
	requireRoles,
} from "@/common/middlewares/auth.middleware";
import { verifyRazorpayWebhookSignature } from "@/common/middlewares/payments.middleware";
import { validatePipe } from "@/common/pipes/validate.pipe";
import { asyncHandler } from "@/common/utils/async-handler";

import { paymentsController } from "./payments.controller";

export function createPaymentsRouter(): Router {
	const router = Router();

	router.get(
		"/",
		requireAuth,
		requireRoles("ADMIN", "HOST"),
		validatePipe({ query: paymentFilterSchema }),
		asyncHandler((req, res) => paymentsController.list(req, res)),
	);
	router.get(
		"/:id",
		requireAuth,
		requireRoles("ADMIN", "HOST"),
		validatePipe({ params: idParamSchema }),
		asyncHandler((req, res) => paymentsController.getById(req, res)),
	);
	router.post(
		"/",
		requireAuth,
		requireRoles("ADMIN", "HOST"),
		validatePipe({ body: createPaymentSchema }),
		asyncHandler((req, res) => paymentsController.create(req, res)),
	);
	router.patch(
		"/:id",
		requireAuth,
		requireRoles("ADMIN", "HOST"),
		validatePipe({ params: idParamSchema, body: updatePaymentSchema }),
		asyncHandler((req, res) => paymentsController.update(req, res)),
	);
	router.post(
		"/webhook/razorpay",
		verifyRazorpayWebhookSignature,
		validatePipe({ body: razorpayWebhookSchema }),
		asyncHandler((req, res) => paymentsController.webhook(req, res)),
	);

	return router;
}
