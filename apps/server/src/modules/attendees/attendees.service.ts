import { prisma } from "@voltaze/db";
import { createError } from "../../lib/middleware/error";

export async function createAttendee(data: {
	eventId: string;
	name: string;
	email: string;
	phone?: string;
	userId?: string;
}) {
	const existing = await prisma.attendee.findUnique({
		where: { eventId_email: { eventId: data.eventId, email: data.email } },
	});

	if (existing) {
		throw createError(
			"Attendee already registered for this event",
			400,
			"ALREADY_REGISTERED",
		);
	}

	return prisma.attendee.create({
		data,
		include: { user: true, event: true },
	});
}

export async function getAttendeeById(id: string) {
	const attendee = await prisma.attendee.findUnique({
		where: { id },
		include: {
			user: true,
			event: true,
			orders: true,
			checkIns: true,
			passes: true,
		},
	});
	if (!attendee) {
		throw createError("Attendee not found", 404, "NOT_FOUND");
	}
	return attendee;
}

export async function getAttendeeByEmail(eventId: string, email: string) {
	const attendee = await prisma.attendee.findUnique({
		where: { eventId_email: { eventId, email } },
		include: {
			user: true,
			event: true,
			orders: true,
			checkIns: true,
			passes: true,
		},
	});
	return attendee;
}

export async function listAttendees(filters?: {
	eventId?: string;
	userId?: string;
	limit?: number;
	offset?: number;
}) {
	const where: Record<string, unknown> = {};
	if (filters?.eventId) where.eventId = filters.eventId;
	if (filters?.userId) where.userId = filters.userId;

	const [attendees, total] = await Promise.all([
		prisma.attendee.findMany({
			where,
			include: { user: true, event: true },
			take: filters?.limit ?? 20,
			skip: filters?.offset ?? 0,
			orderBy: { createdAt: "desc" },
		}),
		prisma.attendee.count({ where }),
	]);

	return { attendees, total };
}

export async function updateAttendee(
	id: string,
	data: Partial<{
		name: string;
		email: string;
		phone: string;
	}>,
) {
	const attendee = await prisma.attendee.findUnique({ where: { id } });
	if (!attendee) {
		throw createError("Attendee not found", 404, "NOT_FOUND");
	}

	if (data.email && data.email !== attendee.email) {
		const existing = await prisma.attendee.findUnique({
			where: {
				eventId_email: { eventId: attendee.eventId, email: data.email },
			},
		});
		if (existing) {
			throw createError(
				"Email already registered for this event",
				400,
				"EMAIL_EXISTS",
			);
		}
	}

	return prisma.attendee.update({
		where: { id },
		data,
	});
}

export async function deleteAttendee(id: string) {
	const attendee = await prisma.attendee.findUnique({ where: { id } });
	if (!attendee) {
		throw createError("Attendee not found", 404, "NOT_FOUND");
	}

	return prisma.attendee.delete({ where: { id } });
}
