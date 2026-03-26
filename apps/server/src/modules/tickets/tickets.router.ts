import type { Router } from "express";
import * as ticketsController from "./tickets.controller.js";

export function createTicketsRouter(router: Router) {
	router.get("/tickets/:id", ticketsController.getTicket);
	router.get("/tickets/order/:orderId", ticketsController.getTicketsByOrderId);
	router.get(
		"/tickets/attendee/:attendeeId",
		ticketsController.getTicketsByAttendeeId,
	);
	router.get("/tickets/event/:eventId", ticketsController.getTicketsByEventId);
	router.post(
		"/tickets/:ticketId/pass",
		ticketsController.validateBody(ticketsController.generatePassSchema),
		ticketsController.generatePass,
	);

	router.get("/passes/code/:code", ticketsController.getPassByCode);
	router.get("/passes/event/:eventId", ticketsController.getPassesByEventId);
	router.get(
		"/passes/attendee/:attendeeId",
		ticketsController.getPassesByAttendeeId,
	);
}
