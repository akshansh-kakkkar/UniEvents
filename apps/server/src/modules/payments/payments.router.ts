import type { Router } from "express";
import * as paymentsController from "./payments.controller.js";

export function createPaymentsRouter(router: Router) {
	router.post(
		"/payments",
		paymentsController.validateBody(paymentsController.createPaymentSchema),
		paymentsController.createPayment,
	);
	router.get("/payments/:id", paymentsController.getPayment);
	router.get(
		"/payments/order/:orderId",
		paymentsController.getPaymentByOrderId,
	);
	router.patch(
		"/payments/:id/status",
		paymentsController.validateBody(paymentsController.updatePaymentSchema),
		paymentsController.updatePaymentStatus,
	);
	router.post("/payments/:id/refund", paymentsController.refundPayment);
	router.post("/webhooks/payment", paymentsController.handleWebhook);
}
