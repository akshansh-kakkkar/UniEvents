import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodIssue, type ZodSchema } from "zod";
import { createError } from "./error.js";

function formatZodError(errors: ZodIssue[]): string {
	return errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
}

export function validate(schema: ZodSchema) {
	return (req: Request, _res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body);
			next();
		} catch (err) {
			if (err instanceof ZodError) {
				next(createError(formatZodError(err.issues), 400, "VALIDATION_ERROR"));
				return;
			}
			next(err);
		}
	};
}

export function validateParams(schema: ZodSchema) {
	return (req: Request, _res: Response, next: NextFunction) => {
		try {
			schema.parse(req.params);
			next();
		} catch (err) {
			if (err instanceof ZodError) {
				next(createError(formatZodError(err.issues), 400, "VALIDATION_ERROR"));
				return;
			}
			next(err);
		}
	};
}

export function validateQuery(schema: ZodSchema) {
	return (req: Request, _res: Response, next: NextFunction) => {
		try {
			schema.parse(req.query);
			next();
		} catch (err) {
			if (err instanceof ZodError) {
				next(createError(formatZodError(err.issues), 400, "VALIDATION_ERROR"));
				return;
			}
			next(err);
		}
	};
}
