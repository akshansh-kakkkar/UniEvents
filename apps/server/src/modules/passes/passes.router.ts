import {
	createPassSchema,
	idParamSchema,
	passFilterSchema,
	updatePassSchema,
	validatePassSchema,
} from "@voltaze/schema";
import { Router } from "express";

import { requireAuth } from "@/common/middlewares/auth.middleware";
import { validatePipe } from "@/common/pipes/validate.pipe";
import { asyncHandler } from "@/common/utils/async-handler";

import { passesController } from "./passes.controller";

export function createPassesRouter(): Router {
	const router = Router();

	router.get(
		"/",
		requireAuth,
		validatePipe({ query: passFilterSchema }),
		asyncHandler((req, res) => passesController.list(req, res)),
	);
	router.get(
		"/:id",
		requireAuth,
		validatePipe({ params: idParamSchema }),
		asyncHandler((req, res) => passesController.getById(req, res)),
	);
	router.post(
		"/",
		requireAuth,
		validatePipe({ body: createPassSchema }),
		asyncHandler((req, res) => passesController.create(req, res)),
	);
	router.patch(
		"/:id",
		requireAuth,
		validatePipe({ params: idParamSchema, body: updatePassSchema }),
		asyncHandler((req, res) => passesController.update(req, res)),
	);
	router.post(
		"/validate",
		requireAuth,
		validatePipe({ body: validatePassSchema }),
		asyncHandler((req, res) => passesController.validate(req, res)),
	);

	return router;
}
