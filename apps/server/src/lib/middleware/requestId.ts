import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

declare global {
	namespace Express {
		interface Request {
			id: string;
		}
	}
}

export function requestId(req: Request, res: Response, next: NextFunction) {
	const headerId = req.header("x-request-id");
	const id = headerId ?? randomUUID();
	req.id = id;
	res.setHeader("X-Request-ID", id);
	next();
}
