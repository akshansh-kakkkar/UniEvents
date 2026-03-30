import {
	attendeeFilterSchema,
	createAttendeeSchema,
	idParamSchema,
	updateAttendeeSchema,
} from "@voltaze/schema";
import { Router } from "express";

import { requireAuth } from "@/common/middlewares/auth.middleware";
import { validatePipe } from "@/common/pipes/validate.pipe";
import { asyncHandler } from "@/common/utils/async-handler";

import { attendeesController } from "./attendees.controller";

export function createAttendeesRouter(): Router {
	const router = Router();

	router.get(
		"/",
		requireAuth,
		validatePipe({ query: attendeeFilterSchema }),
		asyncHandler((req, res) => attendeesController.list(req, res)),
	);
	router.get(
		"/:id",
		requireAuth,
		validatePipe({ params: idParamSchema }),
		asyncHandler((req, res) => attendeesController.getById(req, res)),
	);
	router.post(
		"/",
		requireAuth,
		validatePipe({ body: createAttendeeSchema }),
		asyncHandler((req, res) => attendeesController.create(req, res)),
	);
	router.patch(
		"/:id",
		requireAuth,
		validatePipe({ params: idParamSchema, body: updateAttendeeSchema }),
		asyncHandler((req, res) => attendeesController.update(req, res)),
	);

	return router;
}
