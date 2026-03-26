import { prisma } from "@voltaze/db";
import { createError } from "../../lib/middleware/error";

export async function createPayment(data: {
	orderId: string;
	amount: number;
	currency?: string;
	gateway: "RAZORPAY";
}) {
	const order = await prisma.order.findUnique({ where: { id: data.orderId } });
	if (!order) {
		throw createError("Order not found", 404, "NOT_FOUND");
	}

	const existingPayment = await prisma.payment.findUnique({
		where: { orderId: data.orderId },
	});
	if (existingPayment) {
		throw createError(
			"Payment already exists for this order",
			400,
			"PAYMENT_EXISTS",
		);
	}

	return prisma.payment.create({
		data: {
			orderId: data.orderId,
			amount: data.amount,
			currency: data.currency ?? "INR",
			gateway: data.gateway,
		},
		include: { order: true },
	});
}

export async function getPaymentById(id: string) {
	const payment = await prisma.payment.findUnique({
		where: { id },
		include: {
			order: { include: { tickets: true, attendee: true, event: true } },
		},
	});
	if (!payment) {
		throw createError("Payment not found", 404, "NOT_FOUND");
	}
	return payment;
}

export async function getPaymentByOrderId(orderId: string) {
	const payment = await prisma.payment.findUnique({
		where: { orderId },
		include: {
			order: { include: { tickets: true, attendee: true, event: true } },
		},
	});
	return payment;
}

export async function updatePaymentStatus(
	id: string,
	status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED",
	transactionId?: string,
	gatewayMeta?: Record<string, unknown>,
) {
	const payment = await prisma.payment.findUnique({ where: { id } });
	if (!payment) {
		throw createError("Payment not found", 404, "NOT_FOUND");
	}

	const updateData: Record<string, unknown> = { status };
	if (transactionId) updateData.transactionId = transactionId;
	if (gatewayMeta) updateData.gatewayMeta = gatewayMeta as any;

	return prisma.payment.update({
		where: { id },
		data: updateData as any,
	});
}

export async function processWebhook(
	gateway: string,
	payload: Record<string, unknown>,
) {
	if (gateway === "razorpay") {
		return processRazorpayWebhook(payload);
	}
	throw createError("Unknown payment gateway", 400, "UNKNOWN_GATEWAY");
}

async function processRazorpayWebhook(payload: Record<string, unknown>) {
	const event = payload.event as string;
	const payloadData = payload.payload as
		| { payment?: { entity?: Record<string, unknown> } }
		| undefined;
	const paymentEntity = payloadData?.payment?.entity;

	if (!paymentEntity) {
		throw createError("Invalid webhook payload", 400, "INVALID_PAYLOAD");
	}

	const orderId = paymentEntity.order_id as string;
	const razorpayPaymentId = paymentEntity.id as string;

	const existingPayment = await prisma.payment.findFirst({
		where: { order: { id: orderId } },
	});

	if (!existingPayment) {
		throw createError("Payment not found for webhook", 404, "NOT_FOUND");
	}

	const meta = payload as any;

	switch (event) {
		case "payment.success":
			await prisma.payment.update({
				where: { id: existingPayment.id },
				data: {
					status: "SUCCESS",
					transactionId: razorpayPaymentId,
					gatewayMeta: meta,
				} as any,
			});
			await prisma.order.update({
				where: { id: orderId },
				data: { status: "COMPLETED" },
			});
			break;
		case "payment.failed":
			await prisma.payment.update({
				where: { id: existingPayment.id },
				data: {
					status: "FAILED",
					transactionId: razorpayPaymentId,
					gatewayMeta: meta,
				} as any,
			});
			break;
		case "payment.refunded":
			await prisma.payment.update({
				where: { id: existingPayment.id },
				data: {
					status: "REFUNDED",
					transactionId: razorpayPaymentId,
					gatewayMeta: meta,
				} as any,
			});
			break;
	}

	return { received: true };
}

export async function refundPayment(id: string) {
	const payment = await prisma.payment.findUnique({ where: { id } });
	if (!payment) {
		throw createError("Payment not found", 404, "NOT_FOUND");
	}
	if (payment.status !== "SUCCESS") {
		throw createError(
			"Can only refund successful payments",
			400,
			"INVALID_STATUS",
		);
	}

	return prisma.payment.update({
		where: { id },
		data: { status: "REFUNDED", deletedAt: new Date() },
	});
}
