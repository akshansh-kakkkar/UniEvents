import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@voltaze/env/server";
import type { Request, RequestHandler } from "express";

import { UnauthorizedError } from "@/common/exceptions/app-error";

function signaturesMatch(actual: string, expected: string) {
	const actualBuffer = Buffer.from(actual, "utf8");
	const expectedBuffer = Buffer.from(expected, "utf8");

	if (actualBuffer.length !== expectedBuffer.length) {
		return false;
	}

	return timingSafeEqual(actualBuffer, expectedBuffer);
}

export const verifyRazorpayWebhookSignature: RequestHandler = (
	req,
	_res,
	next,
) => {
	const rawBody = (req as Request & { rawBody?: string }).rawBody;
	const signature = req.get("x-razorpay-signature");
	if (!signature) {
		return next(new UnauthorizedError("Missing Razorpay webhook signature"));
	}

	if (!rawBody) {
		return next(
			new UnauthorizedError(
				"Missing raw webhook body for signature validation",
			),
		);
	}

	const expectedSignature = createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
		.update(rawBody)
		.digest("hex");

	if (!signaturesMatch(signature, expectedSignature)) {
		return next(new UnauthorizedError("Invalid Razorpay webhook signature"));
	}

	next();
};
