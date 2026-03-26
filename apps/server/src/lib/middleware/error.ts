import type { NextFunction, Request, Response } from "express";

export interface AppError extends Error {
	statusCode?: number;
	code?: string;
}

export function errorHandler(
	err: AppError,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	const statusCode = err.statusCode ?? 500;
	const message = err.message ?? "Internal Server Error";

	console.error(`[Error] ${err.message}`, {
		stack: err.stack,
		statusCode,
	});

	res.status(statusCode).json({
		success: false,
		error: {
			message,
			code: err.code ?? "INTERNAL_ERROR",
		},
	});
}

export function createError(
	message: string,
	statusCode: number,
	code?: string,
): AppError {
	const error: AppError = new Error(message);
	error.statusCode = statusCode;
	error.code = code;
	return error;
}
