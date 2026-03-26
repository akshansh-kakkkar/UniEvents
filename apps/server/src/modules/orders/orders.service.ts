import { prisma } from "@voltaze/db";
import { createError } from "../../lib/middleware/error";

export async function createOrder(data: {
	attendeeId: string;
	eventId: string;
	items: Array<{ tierId: string; quantity: number; pricePaid: number }>;
}) {
	const event = await prisma.event.findUnique({ where: { id: data.eventId } });
	if (!event) {
		throw createError("Event not found", 404, "NOT_FOUND");
	}

	for (const item of data.items) {
		const tier = await prisma.ticketTier.findUnique({
			where: { id: item.tierId },
		});
		if (!tier) {
			throw createError(
				`Ticket tier ${item.tierId} not found`,
				404,
				"NOT_FOUND",
			);
		}
		if (tier.eventId !== data.eventId) {
			throw createError(
				"Ticket tier does not belong to this event",
				400,
				"INVALID_TIER",
			);
		}
		const available = tier.maxQuantity - tier.soldCount;
		if (item.quantity > available) {
			throw createError(
				`Only ${available} tickets available for ${tier.name}`,
				400,
				"INSUFFICIENT_TICKETS",
			);
		}
	}

	const totalAmount = data.items.reduce(
		(sum, item) => sum + item.pricePaid * item.quantity,
		0,
	);

	return prisma.order.create({
		data: {
			attendeeId: data.attendeeId,
			eventId: data.eventId,
			tickets: {
				create: data.items.flatMap((item) =>
					Array.from({ length: item.quantity }, () => ({
						eventId: data.eventId,
						tierId: item.tierId,
						pricePaid: item.pricePaid,
					})),
				),
			},
		},
		include: {
			tickets: true,
			attendee: true,
			event: true,
		},
	});
}

export async function getOrderById(id: string) {
	const order = await prisma.order.findUnique({
		where: { id },
		include: {
			tickets: { include: { tier: true } },
			attendee: true,
			event: true,
			payment: true,
		},
	});
	if (!order) {
		throw createError("Order not found", 404, "NOT_FOUND");
	}
	return order;
}

export async function listOrders(filters?: {
	eventId?: string;
	attendeeId?: string;
	status?: "PENDING" | "COMPLETED" | "CANCELLED";
	limit?: number;
	offset?: number;
}) {
	const where: Record<string, unknown> = {};
	if (filters?.eventId) where.eventId = filters.eventId;
	if (filters?.attendeeId) where.attendeeId = filters.attendeeId;
	if (filters?.status) where.status = filters.status;

	const [orders, total] = await Promise.all([
		prisma.order.findMany({
			where,
			include: {
				tickets: { include: { tier: true } },
				attendee: true,
				event: true,
				payment: true,
			},
			take: filters?.limit ?? 20,
			skip: filters?.offset ?? 0,
			orderBy: { createdAt: "desc" },
		}),
		prisma.order.count({ where }),
	]);

	return { orders, total };
}

export async function updateOrderStatus(
	id: string,
	status: "PENDING" | "COMPLETED" | "CANCELLED",
) {
	const order = await prisma.order.findUnique({ where: { id } });
	if (!order) {
		throw createError("Order not found", 404, "NOT_FOUND");
	}

	return prisma.order.update({
		where: { id },
		data: { status },
	});
}

export async function cancelOrder(id: string) {
	const order = await prisma.order.findUnique({ where: { id } });
	if (!order) {
		throw createError("Order not found", 404, "NOT_FOUND");
	}
	if (order.status === "COMPLETED") {
		throw createError("Cannot cancel completed order", 400, "INVALID_STATUS");
	}

	return prisma.order.update({
		where: { id },
		data: { status: "CANCELLED", deletedAt: new Date() },
	});
}
