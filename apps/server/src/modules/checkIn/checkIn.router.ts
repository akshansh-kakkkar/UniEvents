import type { Router } from "express";
import * as checkInController from "./checkIn.controller.js";

export function createCheckInRouter(router: Router) {
	router.post(
		"/check-in",
		checkInController.validateBody(checkInController.createCheckInSchema),
		checkInController.checkIn,
	);
	router.get(
		"/check-in/event/:eventId",
		checkInController.getCheckInsByEventId,
	);
	router.get(
		"/check-in/attendee/:attendeeId",
		checkInController.getCheckInsByAttendeeId,
	);
	router.post(
		"/check-in/validate",
		checkInController.validateBody(checkInController.validatePassSchema),
		checkInController.validatePass,
	);
}
