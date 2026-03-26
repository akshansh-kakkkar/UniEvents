import {
	attendeeFilterSchema,
	createAttendeeSchema,
	updateAttendeeSchema,
} from "@voltaze/schema";
import type { Request, RequestHandler, Response } from "express";
import { controller, created, ok, validateBody } from "../../lib/controller";
import * as attendeesService from "./attendees.service";

export const createAttendee: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const attendee = await attendeesService.createAttendee(req.body);
		created(res, attendee);
	},
);

export const getAttendee: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const attendee = await attendeesService.getAttendeeById(
			req.params.id as string,
		);
		ok(res, attendee);
	},
);

export const getAttendeeByEmail: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const attendee = await attendeesService.getAttendeeByEmail(
			req.params.eventId as string,
			req.params.email as string,
		);
		if (!attendee) {
			res.status(404).json({
				success: false,
				error: { message: "Attendee not found", code: "NOT_FOUND" },
			});
			return;
		}
		ok(res, attendee);
	},
);

export const listAttendees: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const result = await attendeesService.listAttendees(req.query as any);
		ok(res, result);
	},
);

export const updateAttendee: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const attendee = await attendeesService.updateAttendee(
			req.params.id as string,
			req.body,
		);
		ok(res, attendee);
	},
);

export const deleteAttendee: RequestHandler = controller(
	async (req: Request, res: Response) => {
		await attendeesService.deleteAttendee(req.params.id as string);
		ok(res, { deleted: true });
	},
);

export {
	attendeeFilterSchema,
	createAttendeeSchema,
	updateAttendeeSchema,
	validateBody,
};
