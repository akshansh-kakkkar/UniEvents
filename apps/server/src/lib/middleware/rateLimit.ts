import type { NextFunction, Request, Response } from "express";

import { createError } from "./error.js";

type Bucket = { windowStart: number; count: number };

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 100;
const buckets = new Map<string, Bucket>();

function getBucket(key: string, now: number): Bucket {
	const bucket = buckets.get(key);
	if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
		const fresh: Bucket = { windowStart: now, count: 0 };
		buckets.set(key, fresh);
		return fresh;
	}
	return bucket;
}

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
	const now = Date.now();
	const key = req.ip ?? "unknown";
	const bucket = getBucket(key, now);

	bucket.count += 1;

	const remaining = Math.max(0, MAX_REQUESTS - bucket.count);
	res.setHeader("X-RateLimit-Limit", MAX_REQUESTS.toString());
	res.setHeader("X-RateLimit-Remaining", remaining.toString());

	if (bucket.count > MAX_REQUESTS) {
		const retryAfter = Math.ceil((bucket.windowStart + WINDOW_MS - now) / 1000);
		res.setHeader("Retry-After", retryAfter.toString());
		next(createError("Too many requests", 429, "RATE_LIMIT"));
		return;
	}

	next();
}

export function rateLimitMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	rateLimiter(req, res, next);
}
