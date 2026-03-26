import type { Request, RequestHandler, Response } from "express";
import { z } from "zod";
import { controller, created, ok, validateBody } from "../../lib/controller.js";
import * as ticketsService from "./tickets.service.js";

const generatePassSchema = z.object({
	passType: z.enum(["GENERAL", "VIP", "BACKSTAGE", "SPEAKER"]).optional(),
});

export const getTicket: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const ticket = await ticketsService.getTicketById(req.params.id as string);
		ok(res, ticket);
	},
);

export const getTicketsByOrderId: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const tickets = await ticketsService.getTicketsByOrderId(
			req.params.orderId as string,
		);
		ok(res, tickets);
	},
);

export const getTicketsByAttendeeId: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const tickets = await ticketsService.getTicketsByAttendeeId(
			req.params.attendeeId as string,
		);
		ok(res, tickets);
	},
);

export const getTicketsByEventId: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const tickets = await ticketsService.getTicketsByEventId(
			req.params.eventId as string,
		);
		ok(res, tickets);
	},
);

export const generatePass: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const pass = await ticketsService.generatePass(
			req.params.ticketId as string,
			req.body.passType,
		);
		created(res, pass);
	},
);

export const getPassByCode: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const pass = await ticketsService.getPassByCode(req.params.code as string);
		if (!pass) {
			res.status(404).json({
				success: false,
				error: { message: "Pass not found", code: "NOT_FOUND" },
			});
			return;
		}
		ok(res, pass);
	},
);

export const getPassesByEventId: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const passes = await ticketsService.getPassesByEventId(
			req.params.eventId as string,
		);
		ok(res, passes);
	},
);

export const getPassesByAttendeeId: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const passes = await ticketsService.getPassesByAttendeeId(
			req.params.attendeeId as string,
		);
		ok(res, passes);
	},
);

export { generatePassSchema, validateBody };
