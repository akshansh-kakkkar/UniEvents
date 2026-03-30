import {
	createOrderSchema,
	idParamSchema,
	orderFilterSchema,
	updateOrderSchema,
} from "@voltaze/schema";
import { Router } from "express";

import { requireAuth } from "@/common/middlewares/auth.middleware";
import { validatePipe } from "@/common/pipes/validate.pipe";
import { asyncHandler } from "@/common/utils/async-handler";

import { ordersController } from "./orders.controller";

export function createOrdersRouter(): Router {
	const router = Router();

	router.get(
		"/",
		requireAuth,
		validatePipe({ query: orderFilterSchema }),
		asyncHandler((req, res) => ordersController.list(req, res)),
	);
	router.get(
		"/:id",
		requireAuth,
		validatePipe({ params: idParamSchema }),
		asyncHandler((req, res) => ordersController.getById(req, res)),
	);
	router.post(
		"/",
		requireAuth,
		validatePipe({ body: createOrderSchema }),
		asyncHandler((req, res) => ordersController.create(req, res)),
	);
	router.patch(
		"/:id",
		requireAuth,
		validatePipe({ params: idParamSchema, body: updateOrderSchema }),
		asyncHandler((req, res) => ordersController.update(req, res)),
	);

	return router;
}
