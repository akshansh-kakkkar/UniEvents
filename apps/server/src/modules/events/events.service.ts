import { prisma, type UserRole } from "@voltaze/db";
import type {
	CreateEventInput,
	CreateEventTicketTierInput,
	EventFilterInput,
	TicketTierFilterInput,
	UpdateEventInput,
	UpdateEventTicketTierInput,
} from "@voltaze/schema";

import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "@/common/exceptions/app-error";

type EventActor = {
	userId: string;
	role: UserRole;
};

export class EventsService {
	async list(input: EventFilterInput) {
		const {
			page,
			limit,
			sortBy,
			sortOrder,
			search,
			startDateFrom,
			startDateTo,
			...filters
		} = input;
		const skip = (page - 1) * limit;

		return prisma.event.findMany({
			where: {
				...filters,
				startDate:
					startDateFrom || startDateTo
						? {
								gte: startDateFrom,
								lte: startDateTo,
							}
						: undefined,
				name: search
					? {
							contains: search,
							mode: "insensitive",
						}
					: undefined,
			},
			orderBy: { [sortBy]: sortOrder },
			skip,
			take: limit,
		});
	}

	async getById(id: string) {
		const event = await prisma.event.findUnique({ where: { id } });
		if (!event) {
			throw new NotFoundError("Event not found");
		}
		return event;
	}

	async create(input: CreateEventInput, hostUserId: string) {
		const slug = input.name.toLowerCase().trim().replaceAll(/\s+/g, "-");
		return prisma.event.create({
			data: {
				...input,
				userId: hostUserId,
				slug: `${slug}-${Date.now()}`,
			},
		});
	}

	private ensureCanManageEvent(eventUserId: string | null, actor: EventActor) {
		if (actor.role === "ADMIN") {
			return;
		}

		if (!eventUserId || eventUserId !== actor.userId) {
			throw new ForbiddenError("You can only manage events you host");
		}
	}

	private validateSalesWindow(
		salesStart?: Date | null,
		salesEnd?: Date | null,
	) {
		if (salesStart && salesEnd && salesStart > salesEnd) {
			throw new BadRequestError(
				"Ticket tier salesStart must be before or equal to salesEnd",
			);
		}
	}

	async update(id: string, input: UpdateEventInput, actor: EventActor) {
		const event = await this.getById(id);
		this.ensureCanManageEvent(event.userId, actor);

		return prisma.event.update({
			where: { id },
			data: input,
		});
	}

	async listTicketTiers(eventId: string, input: TicketTierFilterInput) {
		await this.getById(eventId);
		const { page, limit, sortBy, sortOrder } = input;
		const skip = (page - 1) * limit;

		return prisma.ticketTier.findMany({
			where: { eventId },
			orderBy: { [sortBy]: sortOrder },
			skip,
			take: limit,
		});
	}

	async getTicketTierById(eventId: string, tierId: string) {
		const ticketTier = await prisma.ticketTier.findFirst({
			where: {
				id: tierId,
				eventId,
			},
		});

		if (!ticketTier) {
			throw new NotFoundError("Ticket tier not found");
		}

		return ticketTier;
	}

	async createTicketTier(
		eventId: string,
		input: CreateEventTicketTierInput,
		actor: EventActor,
	) {
		const event = await this.getById(eventId);
		this.ensureCanManageEvent(event.userId, actor);
		this.validateSalesWindow(input.salesStart, input.salesEnd);

		return prisma.ticketTier.create({
			data: {
				...input,
				eventId,
			},
		});
	}

	async updateTicketTier(
		eventId: string,
		tierId: string,
		input: UpdateEventTicketTierInput,
		actor: EventActor,
	) {
		const event = await this.getById(eventId);
		this.ensureCanManageEvent(event.userId, actor);

		const ticketTier = await this.getTicketTierById(eventId, tierId);
		this.validateSalesWindow(
			input.salesStart ?? ticketTier.salesStart,
			input.salesEnd ?? ticketTier.salesEnd,
		);

		if (
			input.maxQuantity !== undefined &&
			input.maxQuantity < ticketTier.soldCount
		) {
			throw new BadRequestError(
				"Ticket tier maxQuantity cannot be less than soldCount",
			);
		}

		return prisma.ticketTier.update({
			where: { id: tierId },
			data: input,
		});
	}

	async deleteTicketTier(eventId: string, tierId: string, actor: EventActor) {
		const event = await this.getById(eventId);
		this.ensureCanManageEvent(event.userId, actor);

		const ticketTier = await this.getTicketTierById(eventId, tierId);
		if (ticketTier.soldCount > 0) {
			throw new BadRequestError(
				"Cannot delete ticket tier after tickets have been sold",
			);
		}

		const existingTickets = await prisma.ticket.count({
			where: { tierId: ticketTier.id },
		});
		if (existingTickets > 0) {
			throw new BadRequestError(
				"Cannot delete ticket tier that is linked to issued tickets",
			);
		}

		await prisma.ticketTier.delete({ where: { id: tierId } });
	}
}

export const eventsService = new EventsService();
