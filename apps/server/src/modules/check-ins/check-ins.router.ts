import {
	checkInFilterSchema,
	createCheckInSchema,
	idParamSchema,
} from "@voltaze/schema";
import { Router } from "express";

import { requireAuth } from "@/common/middlewares/auth.middleware";
import { validatePipe } from "@/common/pipes/validate.pipe";
import { asyncHandler } from "@/common/utils/async-handler";

import { checkInsController } from "./check-ins.controller";

export function createCheckInsRouter(): Router {
	const router = Router();

	router.get(
		"/",
		requireAuth,
		validatePipe({ query: checkInFilterSchema }),
		asyncHandler((req, res) => checkInsController.list(req, res)),
	);
	router.get(
		"/:id",
		requireAuth,
		validatePipe({ params: idParamSchema }),
		asyncHandler((req, res) => checkInsController.getById(req, res)),
	);
	router.post(
		"/",
		requireAuth,
		validatePipe({ body: createCheckInSchema }),
		asyncHandler((req, res) => checkInsController.create(req, res)),
	);

	return router;
}
