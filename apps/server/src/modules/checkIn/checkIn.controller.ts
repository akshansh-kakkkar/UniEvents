import { checkInFilterSchema, createCheckInSchema } from "@voltaze/schema";
import type { Request, RequestHandler, Response } from "express";
import { z } from "zod";
import { controller, created, ok, validateBody } from "../../lib/controller.js";
import * as checkInService from "./checkIn.service.js";

const validatePassSchema = z.object({
	passCode: z.string(),
	eventId: z.string(),
});

export const checkIn: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const result = await checkInService.checkIn(req.body);
		created(res, result);
	},
);

export const getCheckInsByEventId: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const checkIns = await checkInService.getCheckInsByEventId(
			req.params.eventId as string,
		);
		ok(res, checkIns);
	},
);

export const getCheckInsByAttendeeId: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const checkIns = await checkInService.getCheckInsByAttendeeId(
			req.params.attendeeId as string,
		);
		ok(res, checkIns);
	},
);

export const validatePass: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const result = await checkInService.validatePass(
			req.body.passCode,
			req.body.eventId,
		);
		ok(res, result);
	},
);

export {
	checkInFilterSchema,
	createCheckInSchema,
	validateBody,
	validatePassSchema,
};
