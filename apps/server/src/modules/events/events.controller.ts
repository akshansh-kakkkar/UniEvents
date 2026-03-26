import {
	createEventSchema,
	createTicketTierSchema,
	eventFilterSchema,
	updateEventSchema,
	updateTicketTierSchema,
} from "@voltaze/schema";
import type { Request, RequestHandler, Response } from "express";
import { controller, created, ok, validateBody } from "../../lib/controller.js";
import * as eventsService from "./events.service.js";

export const createEvent: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const event = await eventsService.createEvent(req.body);
		created(res, event);
	},
);

export const getEvent: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const event = await eventsService.getEventById(req.params.id as string);
		ok(res, event);
	},
);

export const getEventBySlug: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const event = await eventsService.getEventBySlug(req.params.slug as string);
		ok(res, event);
	},
);

export const listEvents: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const result = await eventsService.listEvents(req.query as any);
		ok(res, result);
	},
);

export const updateEvent: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const event = await eventsService.updateEvent(
			req.params.id as string,
			req.body,
		);
		ok(res, event);
	},
);

export const deleteEvent: RequestHandler = controller(
	async (req: Request, res: Response) => {
		await eventsService.deleteEvent(req.params.id as string);
		ok(res, { deleted: true });
	},
);

export const createTicketTier: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const tier = await eventsService.createTicketTier(req.body);
		created(res, tier);
	},
);

export const updateTicketTier: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const tier = await eventsService.updateTicketTier(
			req.params.id as string,
			req.body,
		);
		ok(res, tier);
	},
);

export const deleteTicketTier: RequestHandler = controller(
	async (req: Request, res: Response) => {
		await eventsService.deleteTicketTier(req.params.id as string);
		ok(res, { deleted: true });
	},
);

export const getTicketTiers: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const tiers = await eventsService.getTicketTiers(
			req.params.eventId as string,
		);
		ok(res, tiers);
	},
);

export {
	createEventSchema,
	createTicketTierSchema,
	eventFilterSchema,
	updateEventSchema,
	updateTicketTierSchema,
	validateBody,
};
