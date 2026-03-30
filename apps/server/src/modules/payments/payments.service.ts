import { Prisma, prisma, type UserRole } from "@voltaze/db";
import type {
	CreatePaymentInput,
	PaymentFilterInput,
	RazorpayWebhookInput,
	UpdatePaymentInput,
} from "@voltaze/schema";

import {
	BadRequestError,
	ConflictError,
	ForbiddenError,
	NotFoundError,
} from "@/common/exceptions/app-error";

type PaymentActor = {
	userId: string;
	role: UserRole;
};

type WebhookMappedStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

const CUID_REGEX = /^c[a-z0-9]{24}$/i;

function isCuid(value: string) {
	return CUID_REGEX.test(value);
}

function mapWebhookEventToPaymentStatus(
	event: string,
): WebhookMappedStatus | null {
	if (event === "payment.authorized") {
		return "PENDING";
	}

	if (event === "payment.captured") {
		return "SUCCESS";
	}

	if (event === "payment.failed") {
		return "FAILED";
	}

	if (event === "payment.refunded") {
		return "REFUNDED";
	}

	return null;
}

export class PaymentsService {
	private canManageAll(actor: PaymentActor) {
		return actor.role === "ADMIN";
	}

	private buildAccessWhere(actor: PaymentActor): Prisma.PaymentWhereInput {
		if (this.canManageAll(actor)) {
			return {};
		}

		if (actor.role === "HOST") {
			return {
				order: {
					event: {
						userId: actor.userId,
					},
				},
			};
		}

		return {
			order: {
				attendee: {
					userId: actor.userId,
				},
			},
		};
	}

	async list(input: PaymentFilterInput, actor: PaymentActor) {
		const { page, limit, sortBy, sortOrder, ...filters } = input;
		const skip = (page - 1) * limit;

		const where: Prisma.PaymentWhereInput = {
			...filters,
			deletedAt: null,
			...this.buildAccessWhere(actor),
		};

		return prisma.payment.findMany({
			where,
			orderBy: { [sortBy]: sortOrder },
			skip,
			take: limit,
		});
	}

	async getById(id: string, actor: PaymentActor) {
		const payment = await prisma.payment.findFirst({
			where: {
				id,
				deletedAt: null,
				...this.buildAccessWhere(actor),
			},
		});

		if (!payment) {
			throw new NotFoundError("Payment not found");
		}

		return payment;
	}

	async create(input: CreatePaymentInput, actor: PaymentActor) {
		const orderWhere: Prisma.OrderWhereInput = {
			id: input.orderId,
			deletedAt: null,
		};

		if (actor.role === "HOST") {
			orderWhere.event = {
				userId: actor.userId,
			};
		} else if (actor.role === "USER") {
			orderWhere.attendee = {
				userId: actor.userId,
			};
		}

		const order = await prisma.order.findFirst({
			where: orderWhere,
		});

		if (!order) {
			throw new NotFoundError("Order not found");
		}

		if (order.status !== "PENDING") {
			throw new BadRequestError("Can only create payments for pending orders");
		}

		try {
			return await prisma.payment.create({ data: input });
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					throw new ConflictError(
						"A payment already exists for this order or transaction",
					);
				}
			}

			throw error;
		}
	}

	async update(id: string, input: UpdatePaymentInput, actor: PaymentActor) {
		if (actor.role === "USER") {
			throw new ForbiddenError("Users cannot update payment records directly");
		}

		await this.getById(id, actor);
		const { orderId: _ignoredOrderId, gatewayMeta, ...rest } = input;
		const data = {
			...rest,
			gatewayMeta: gatewayMeta as Prisma.InputJsonValue | undefined,
		};
		return prisma.payment.update({ where: { id }, data });
	}

	async handleWebhook(input: RazorpayWebhookInput) {
		const transactionId = input.payload.payment.id;
		const orderReference = input.payload.payment.order_id;
		const mappedStatus = mapWebhookEventToPaymentStatus(input.event);

		if (!mappedStatus) {
			throw new BadRequestError("Unsupported Razorpay webhook event");
		}

		let payment = await prisma.payment.findFirst({
			where: { transactionId },
			include: { order: true },
		});

		if (!payment && isCuid(orderReference)) {
			payment = await prisma.payment.findFirst({
				where: {
					orderId: orderReference,
					deletedAt: null,
				},
				include: { order: true },
			});
		}

		if (!payment || payment.deletedAt) {
			throw new BadRequestError("Payment transaction not found");
		}

		if (payment.transactionId && payment.transactionId !== transactionId) {
			throw new BadRequestError("Transaction ID mismatch for payment");
		}

		if (payment.amount !== input.payload.payment.amount) {
			throw new BadRequestError("Webhook payment amount mismatch");
		}

		if (
			payment.currency.toUpperCase() !==
			input.payload.payment.currency.toUpperCase()
		) {
			throw new BadRequestError("Webhook payment currency mismatch");
		}

		if (
			payment.status === mappedStatus &&
			payment.transactionId === transactionId
		) {
			return payment;
		}

		if (payment.status === "REFUNDED") {
			return payment;
		}

		if (payment.status === "SUCCESS" && mappedStatus !== "REFUNDED") {
			return payment;
		}

		const normalizedGatewayMeta = input as Prisma.InputJsonValue;

		return prisma.$transaction(async (tx) => {
			const updatedPayment = await tx.payment.update({
				where: { id: payment.id },
				data: {
					status: mappedStatus,
					transactionId,
					gatewayMeta: normalizedGatewayMeta,
				},
			});

			if (mappedStatus === "SUCCESS") {
				await tx.order.update({
					where: { id: payment.orderId },
					data: { status: "COMPLETED" },
				});
			}

			if (mappedStatus === "REFUNDED") {
				await tx.order.update({
					where: { id: payment.orderId },
					data: { status: "CANCELLED" },
				});
			}

			if (mappedStatus === "FAILED" && payment.order.status !== "COMPLETED") {
				await tx.order.update({
					where: { id: payment.orderId },
					data: { status: "CANCELLED" },
				});
			}

			return updatedPayment;
		});
	}
}

export const paymentsService = new PaymentsService();
