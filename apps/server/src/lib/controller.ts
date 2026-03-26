import type { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncController = (
	req: Request,
	res: Response,
	next: NextFunction,
) => Promise<void>;

export function controller(fn: AsyncController): RequestHandler {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

export function validateBody<T>(schema: { parse: (data: unknown) => T }) {
	return (req: Request, _res: Response, next: NextFunction) => {
		try {
			req.body = schema.parse(req.body);
			next();
		} catch (err) {
			next(err);
		}
	};
}

export function validateParams<T>(schema: { parse: (data: unknown) => T }) {
	return (req: Request, _res: Response, next: NextFunction) => {
		try {
			const parsed = schema.parse(req.params);
			(req as any).params = parsed;
			next();
		} catch (err) {
			next(err);
		}
	};
}

export function validateQuery<T>(schema: { parse: (data: unknown) => T }) {
	return (req: Request, _res: Response, next: NextFunction) => {
		try {
			const parsed = schema.parse(req.query);
			(req as any).query = parsed;
			next();
		} catch (err) {
			next(err);
		}
	};
}

export function ok<T>(res: Response, data: T, status = 200) {
	res.status(status).json({ success: true, data });
}

export function created<T>(res: Response, data: T) {
	ok(res, data, 201);
}

export function noContent(res: Response) {
	res.status(204).json({ success: true });
}

export function error(
	res: Response,
	message: string,
	status = 400,
	code?: string,
) {
	res.status(status).json({ success: false, error: { message, code } });
}
