import {
	checkInFilterSchema,
	createCheckInSchema,
	idParamSchema,
} from "@voltaze/schema";
import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "@/common/types/auth-request";

import { checkInsService } from "./check-ins.service";

export class CheckInsController {
	private getActor(req: Request) {
		const authReq = req as AuthenticatedRequest;
		return {
			userId: authReq.auth.userId,
			role: authReq.auth.role,
		};
	}

	async list(req: Request, res: Response) {
		const query = checkInFilterSchema.parse(req.query);
		const checkIns = await checkInsService.list(query, this.getActor(req));
		res.status(200).json(checkIns);
	}

	async getById(req: Request, res: Response) {
		const params = idParamSchema.parse(req.params);
		const checkIn = await checkInsService.getById(
			params.id,
			this.getActor(req),
		);
		res.status(200).json(checkIn);
	}

	async create(req: Request, res: Response) {
		const body = createCheckInSchema.parse(req.body);
		const checkIn = await checkInsService.create(body, this.getActor(req));
		res.status(201).json(checkIn);
	}
}

export const checkInsController = new CheckInsController();
