import type { Router } from "express";
import * as eventsController from "./events.controller.js";

export function createEventsRouter(router: Router) {
	router.post(
		"/events",
		eventsController.validateBody(eventsController.createEventSchema),
		eventsController.createEvent,
	);
	router.get("/events", eventsController.listEvents);
	router.get("/events/slug/:slug", eventsController.getEventBySlug);
	router.get("/events/:id", eventsController.getEvent);
	router.patch("/events/:id", eventsController.updateEvent);
	router.delete("/events/:id", eventsController.deleteEvent);

	router.post(
		"/events/:eventId/ticket-tiers",
		eventsController.validateBody(eventsController.createTicketTierSchema),
		eventsController.createTicketTier,
	);
	router.get("/events/:eventId/ticket-tiers", eventsController.getTicketTiers);
	router.patch(
		"/ticket-tiers/:id",
		eventsController.validateBody(eventsController.updateTicketTierSchema),
		eventsController.updateTicketTier,
	);
	router.delete("/ticket-tiers/:id", eventsController.deleteTicketTier);
}
