import { prisma } from "@voltaze/db";
import { createError } from "../../lib/middleware/error";

export async function getTicketById(id: string) {
	const ticket = await prisma.ticket.findUnique({
		where: { id },
		include: {
			tier: true,
			event: true,
			order: { include: { attendee: true } },
			pass: true,
		},
	});
	if (!ticket) {
		throw createError("Ticket not found", 404, "NOT_FOUND");
	}
	return ticket;
}

export async function getTicketsByOrderId(orderId: string) {
	return prisma.ticket.findMany({
		where: { orderId },
		include: { tier: true, event: true, pass: true },
	});
}

export async function getTicketsByAttendeeId(attendeeId: string) {
	return prisma.ticket.findMany({
		where: { order: { attendeeId } },
		include: { tier: true, event: true, pass: true },
	});
}

export async function getTicketsByEventId(eventId: string) {
	return prisma.ticket.findMany({
		where: { eventId },
		include: { tier: true, order: { include: { attendee: true } }, pass: true },
	});
}

export async function generatePass(
	ticketId: string,
	passType?: "GENERAL" | "VIP" | "BACKSTAGE" | "SPEAKER",
) {
	const ticket = await prisma.ticket.findUnique({
		where: { id: ticketId },
		include: {
			pass: true,
			event: true,
			order: { include: { attendee: true } },
		},
	});

	if (!ticket) {
		throw createError("Ticket not found", 404, "NOT_FOUND");
	}

	if (ticket.pass) {
		throw createError(
			"Pass already generated for this ticket",
			400,
			"PASS_EXISTS",
		);
	}

	const code = generatePassCode();

	return prisma.pass.create({
		data: {
			eventId: ticket.eventId,
			attendeeId: ticket.order.attendeeId,
			ticketId: ticket.id,
			type: passType ?? "GENERAL",
			code,
		},
		include: {
			event: true,
			attendee: true,
			ticket: { include: { tier: true } },
		},
	});
}

function generatePassCode(): string {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let code = "";
	for (let i = 0; i < 12; i++) {
		if (i > 0 && i % 4 === 0) code += "-";
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return code;
}

export async function getPassByCode(code: string) {
	const pass = await prisma.pass.findUnique({
		where: { code },
		include: {
			event: true,
			attendee: true,
			ticket: { include: { tier: true } },
		},
	});
	return pass;
}

export async function getPassesByEventId(eventId: string) {
	return prisma.pass.findMany({
		where: { eventId },
		include: { attendee: true, ticket: { include: { tier: true } } },
	});
}

export async function getPassesByAttendeeId(attendeeId: string) {
	return prisma.pass.findMany({
		where: { attendeeId },
		include: { event: true, ticket: { include: { tier: true } } },
	});
}
