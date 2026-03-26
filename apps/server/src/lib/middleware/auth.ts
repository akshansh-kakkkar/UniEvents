import type { Session } from "better-auth/types";
import type { NextFunction, Request, Response } from "express";
import { auth } from "../auth.js";
import { createError } from "./error.js";

declare global {
	namespace Express {
		interface Request {
			session: Session | null;
			userId: string | null;
		}
	}
}

export async function authMiddleware(
	req: Request,
	_res: Response,
	next: NextFunction,
) {
	const cookieHeader = req.headers.cookie;
	if (!cookieHeader) {
		req.session = null;
		req.userId = null;
		next();
		return;
	}

	try {
		const session = await auth.api.getSession({
			headers: { cookie: cookieHeader },
		});

		if (session) {
			req.session = session.session;
			req.userId = session.user.id;
		} else {
			req.session = null;
			req.userId = null;
		}
		next();
	} catch {
		req.session = null;
		req.userId = null;
		next();
	}
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
	if (!req.session || !req.userId) {
		next(createError("Unauthorized", 401, "UNAUTHORIZED"));
		return;
	}
	next();
}
