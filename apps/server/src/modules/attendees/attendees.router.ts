import type { Router } from "express";
import * as attendeesController from "./attendees.controller";

export function createAttendeesRouter(router: Router) {
	router.post(
		"/attendees",
		attendeesController.validateBody(attendeesController.createAttendeeSchema),
		attendeesController.createAttendee,
	);
	router.get("/attendees", attendeesController.listAttendees);
	router.get("/attendees/:id", attendeesController.getAttendee);
	router.get(
		"/attendees/event/:eventId/email/:email",
		attendeesController.getAttendeeByEmail,
	);
	router.patch(
		"/attendees/:id",
		attendeesController.validateBody(attendeesController.updateAttendeeSchema),
		attendeesController.updateAttendee,
	);
	router.delete("/attendees/:id", attendeesController.deleteAttendee);
}
