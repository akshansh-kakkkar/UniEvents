import { prisma } from "@voltaze/db";
import { createError } from "../../lib/middleware/error";

export async function createEvent(data: {
	name: string;
	slug: string;
	coverUrl: string;
	thumbnail: string;
	venueName: string;
	address: string;
	latitude: string;
	longitude: string;
	timezone: string;
	startDate: Date;
	endDate: Date;
	type: "FREE" | "PAID";
	mode: "ONLINE" | "OFFLINE";
	visibility: "PUBLIC" | "PRIVATE";
	description: string;
	userId?: string;
}) {
	const existing = await prisma.event.findUnique({
		where: { slug: data.slug },
	});
	if (existing) {
		throw createError(
			"Event with this slug already exists",
			400,
			"SLUG_EXISTS",
		);
	}

	return prisma.event.create({ data });
}

export async function getEventById(id: string) {
	const event = await prisma.event.findUnique({
		where: { id },
		include: { ticketTiers: true },
	});
	if (!event) {
		throw createError("Event not found", 404, "NOT_FOUND");
	}
	return event;
}

export async function getEventBySlug(slug: string) {
	const event = await prisma.event.findUnique({
		where: { slug },
		include: { ticketTiers: true },
	});
	if (!event) {
		throw createError("Event not found", 404, "NOT_FOUND");
	}
	return event;
}

export async function listEvents(filters?: {
	status?: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
	visibility?: "PUBLIC" | "PRIVATE";
	userId?: string;
	limit?: number;
	offset?: number;
}) {
	const where: Record<string, unknown> = {};
	if (filters?.status) where.status = filters.status;
	if (filters?.visibility) where.visibility = filters.visibility;
	if (filters?.userId) where.userId = filters.userId;

	const [events, total] = await Promise.all([
		prisma.event.findMany({
			where,
			include: { ticketTiers: true },
			take: filters?.limit ?? 20,
			skip: filters?.offset ?? 0,
			orderBy: { createdAt: "desc" },
		}),
		prisma.event.count({ where }),
	]);

	return { events, total };
}

export async function updateEvent(
	id: string,
	data: Partial<{
		name: string;
		slug: string;
		coverUrl: string;
		thumbnail: string;
		venueName: string;
		address: string;
		latitude: string;
		longitude: string;
		timezone: string;
		startDate: Date;
		endDate: Date;
		type: "FREE" | "PAID";
		mode: "ONLINE" | "OFFLINE";
		visibility: "PUBLIC" | "PRIVATE";
		status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
		description: string;
	}>,
) {
	const event = await prisma.event.findUnique({ where: { id } });
	if (!event) {
		throw createError("Event not found", 404, "NOT_FOUND");
	}

	if (data.slug && data.slug !== event.slug) {
		const existing = await prisma.event.findUnique({
			where: { slug: data.slug },
		});
		if (existing) {
			throw createError(
				"Event with this slug already exists",
				400,
				"SLUG_EXISTS",
			);
		}
	}

	return prisma.event.update({ where: { id }, data });
}

export async function deleteEvent(id: string) {
	const event = await prisma.event.findUnique({ where: { id } });
	if (!event) {
		throw createError("Event not found", 404, "NOT_FOUND");
	}

	return prisma.event.delete({ where: { id } });
}

export async function createTicketTier(data: {
	eventId: string;
	name: string;
	description?: string;
	price: number;
	maxQuantity: number;
	salesStart?: Date;
	salesEnd?: Date;
}) {
	const event = await prisma.event.findUnique({ where: { id: data.eventId } });
	if (!event) {
		throw createError("Event not found", 404, "NOT_FOUND");
	}

	return prisma.ticketTier.create({ data });
}

export async function updateTicketTier(
	id: string,
	data: Partial<{
		name: string;
		description: string;
		price: number;
		maxQuantity: number;
		salesStart: Date;
		salesEnd: Date;
	}>,
) {
	const tier = await prisma.ticketTier.findUnique({ where: { id } });
	if (!tier) {
		throw createError("Ticket tier not found", 404, "NOT_FOUND");
	}

	return prisma.ticketTier.update({ where: { id }, data });
}

export async function deleteTicketTier(id: string) {
	const tier = await prisma.ticketTier.findUnique({ where: { id } });
	if (!tier) {
		throw createError("Ticket tier not found", 404, "NOT_FOUND");
	}

	return prisma.ticketTier.delete({ where: { id } });
}

export async function getTicketTiers(eventId: string) {
	return prisma.ticketTier.findMany({
		where: { eventId },
		orderBy: { price: "asc" },
	});
}
