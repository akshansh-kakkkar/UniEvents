import type { Router } from "express";
import * as ordersController from "./orders.controller.js";

export function createOrdersRouter(router: Router) {
	router.post(
		"/orders",
		ordersController.validateBody(ordersController.createOrderSchema),
		ordersController.createOrder,
	);
	router.get("/orders", ordersController.listOrders);
	router.get("/orders/:id", ordersController.getOrder);
	router.patch(
		"/orders/:id/status",
		ordersController.validateBody(ordersController.updateOrderSchema),
		ordersController.updateOrderStatus,
	);
	router.delete("/orders/:id", ordersController.cancelOrder);
}
