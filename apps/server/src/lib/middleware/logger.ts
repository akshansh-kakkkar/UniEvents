import type { NextFunction, Request, Response } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
	const start = Date.now();

	res.on("finish", () => {
		const duration = Date.now() - start;
		const reqId = req.id ?? "-";
		console.log(
			`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms reqId=${reqId}`,
		);
	});

	next();
}
