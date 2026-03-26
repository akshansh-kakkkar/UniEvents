import type { Request, RequestHandler, Response } from "express";
import { controller, ok } from "../../lib/controller";
import { getAuth } from "./auth.service";

const authRouter = getAuth() as any;

export const signUp: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const result = await authRouter.api.signUp({ body: req.body });
		ok(res, result);
	},
);

export const signIn: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const result = await authRouter.api.signIn({ body: req.body });
		ok(res, result);
	},
);

export const signOut: RequestHandler = controller(
	async (req: Request, res: Response) => {
		await authRouter.api.signOut({
			headers: req.headers as Record<string, string>,
		});
		ok(res, { success: true });
	},
);

export const getSession: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const result = await authRouter.api.getSession({
			headers: req.headers as Record<string, string>,
		});
		if (!result) {
			res.status(401).json({ user: null, session: null });
			return;
		}
		ok(res, result);
	},
);

export const listSessions: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const result = await authRouter.api.listSessions({
			headers: req.headers as Record<string, string>,
		});
		ok(res, result);
	},
);

export const deleteSession: RequestHandler = controller(
	async (req: Request, res: Response) => {
		await authRouter.api.deleteSession({
			headers: req.headers as Record<string, string>,
			body: { sessionId: req.params.sessionId },
		});
		ok(res, { success: true });
	},
);
