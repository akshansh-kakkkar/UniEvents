import { prisma } from "@voltaze/db";
import { createError } from "../../lib/middleware/error";

export async function checkIn(data: {
	passCode: string;
	eventId: string;
	method: "QR_SCAN" | "MANUAL";
}) {
	const pass = await prisma.pass.findUnique({
		where: { code: data.passCode },
		include: {
			event: true,
			attendee: true,
			ticket: { include: { tier: true } },
		},
	});

	if (!pass) {
		throw createError("Invalid pass code", 404, "INVALID_PASS");
	}

	if (pass.eventId !== data.eventId) {
		throw createError(
			"Pass does not belong to this event",
			400,
			"INVALID_EVENT",
		);
	}

	if (pass.status === "USED") {
		throw createError("Pass already used", 400, "PASS_ALREADY_USED");
	}

	if (pass.status === "CANCELLED") {
		throw createError("Pass is cancelled", 400, "PASS_CANCELLED");
	}

	const checkIn = await prisma.checkIn.create({
		data: {
			attendeeId: pass.attendeeId,
			eventId: data.eventId,
			method: data.method,
		},
		include: { attendee: true },
	});

	await prisma.pass.update({
		where: { id: pass.id },
		data: { status: "USED" },
	});

	return { checkIn, pass };
}

export async function getCheckInsByEventId(eventId: string) {
	return prisma.checkIn.findMany({
		where: { eventId },
		include: { attendee: true },
		orderBy: { timestamp: "desc" },
	});
}

export async function getCheckInsByAttendeeId(attendeeId: string) {
	return prisma.checkIn.findMany({
		where: { attendeeId },
		include: { attendee: true },
		orderBy: { timestamp: "desc" },
	});
}

export async function validatePass(passCode: string, eventId: string) {
	const pass = await prisma.pass.findUnique({
		where: { code: passCode },
		include: {
			event: true,
			attendee: true,
			ticket: { include: { tier: true } },
		},
	});

	if (!pass) {
		return { valid: false, reason: "INVALID_PASS" };
	}

	if (pass.eventId !== eventId) {
		return { valid: false, reason: "INVALID_EVENT" };
	}

	if (pass.status === "USED") {
		return { valid: false, reason: "PASS_ALREADY_USED" };
	}

	if (pass.status === "CANCELLED") {
		return { valid: false, reason: "PASS_CANCELLED" };
	}

	return { valid: true, pass };
}
