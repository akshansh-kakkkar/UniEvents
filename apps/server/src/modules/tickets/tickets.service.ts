import { type Prisma, prisma, type UserRole } from "@voltaze/db";
import type {
	CreateTicketInput,
	TicketFilterInput,
	UpdateTicketInput,
} from "@voltaze/schema";

import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "@/common/exceptions/app-error";

type TicketActor = {
	userId: string;
	role: UserRole;
};

export class TicketsService {
	private canManageAll(actor: TicketActor) {
		return actor.role === "ADMIN";
	}

	private buildAccessWhere(actor: TicketActor): Prisma.TicketWhereInput {
		if (this.canManageAll(actor)) {
			return {};
		}

		if (actor.role === "HOST") {
			return {
				event: {
					userId: actor.userId,
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

	private ensureCanUseOrder(
		order: {
			attendee: { userId: string | null };
			event: { userId: string | null };
		},
		actor: TicketActor,
	) {
		if (this.canManageAll(actor)) {
			return;
		}

		if (actor.role === "HOST") {
			if (!order.event.userId || order.event.userId !== actor.userId) {
				throw new ForbiddenError("You can only manage tickets for your events");
			}

			return;
		}

		if (!order.attendee.userId || order.attendee.userId !== actor.userId) {
			throw new ForbiddenError("You can only manage your own tickets");
		}
	}

	async list(input: TicketFilterInput, actor: TicketActor) {
		const { page, limit, sortBy, sortOrder, ...filters } = input;
		const skip = (page - 1) * limit;
		return prisma.ticket.findMany({
			where: {
				...filters,
				...this.buildAccessWhere(actor),
			},
			orderBy: { [sortBy]: sortOrder },
			skip,
			take: limit,
		});
	}

	async getById(id: string, actor: TicketActor) {
		const ticket = await prisma.ticket.findFirst({
			where: {
				id,
				...this.buildAccessWhere(actor),
			},
		});

		if (!ticket) throw new NotFoundError("Ticket not found");
		return ticket;
	}

	async create(input: CreateTicketInput, actor: TicketActor) {
		const [order, event, tier] = await Promise.all([
			prisma.order.findUnique({
				where: { id: input.orderId },
				include: {
					attendee: {
						select: {
							userId: true,
						},
					},
					event: {
						select: {
							userId: true,
						},
					},
				},
			}),
			prisma.event.findUnique({ where: { id: input.eventId } }),
			prisma.ticketTier.findUnique({ where: { id: input.tierId } }),
		]);
		if (!order) throw new NotFoundError("Order not found");
		if (!event) throw new NotFoundError("Event not found");
		if (!tier) throw new NotFoundError("Ticket tier not found");
		if (order.deletedAt) {
			throw new BadRequestError("Order is no longer active");
		}
		if (order.eventId !== input.eventId) {
			throw new BadRequestError("Order does not belong to event");
		}
		if (order.status === "CANCELLED") {
			throw new BadRequestError("Cannot issue ticket for cancelled order");
		}
		if (tier.eventId !== input.eventId) {
			throw new BadRequestError("Ticket tier does not belong to event");
		}

		this.ensureCanUseOrder(order, actor);

		if (tier.soldCount >= tier.maxQuantity) {
			throw new BadRequestError("Ticket tier sold out");
		}

		return prisma.$transaction(async (tx) => {
			const ticket = await tx.ticket.create({
				data: {
					...input,
					pricePaid: tier.price,
				},
			});
			await tx.ticketTier.update({
				where: { id: input.tierId },
				data: { soldCount: { increment: 1 } },
			});
			return ticket;
		});
	}

	async update(id: string, input: UpdateTicketInput, actor: TicketActor) {
		const ticket = await this.getById(id, actor);

		if (
			actor.role === "USER" &&
			(input.orderId !== undefined ||
				input.eventId !== undefined ||
				input.tierId !== undefined)
		) {
			throw new BadRequestError("Users cannot reassign tickets");
		}

		const nextOrderId = input.orderId ?? ticket.orderId;
		const nextEventId = input.eventId ?? ticket.eventId;
		const nextTierId = input.tierId ?? ticket.tierId;

		const relationChanged =
			nextOrderId !== ticket.orderId ||
			nextEventId !== ticket.eventId ||
			nextTierId !== ticket.tierId;

		if (!relationChanged) {
			return prisma.ticket.update({ where: { id }, data: input });
		}

		const [order, event, tier] = await Promise.all([
			prisma.order.findUnique({
				where: { id: nextOrderId },
				include: {
					attendee: {
						select: {
							userId: true,
						},
					},
					event: {
						select: {
							userId: true,
						},
					},
				},
			}),
			prisma.event.findUnique({ where: { id: nextEventId } }),
			prisma.ticketTier.findUnique({ where: { id: nextTierId } }),
		]);

		if (!order) throw new NotFoundError("Order not found");
		if (!event) throw new NotFoundError("Event not found");
		if (!tier) throw new NotFoundError("Ticket tier not found");
		if (order.deletedAt) {
			throw new BadRequestError("Order is no longer active");
		}
		if (order.eventId !== nextEventId) {
			throw new BadRequestError("Order does not belong to event");
		}
		if (tier.eventId !== nextEventId) {
			throw new BadRequestError("Ticket tier does not belong to event");
		}

		this.ensureCanUseOrder(order, actor);

		if (nextTierId === ticket.tierId) {
			return prisma.ticket.update({ where: { id }, data: input });
		}

		if (tier.soldCount >= tier.maxQuantity) {
			throw new BadRequestError("Ticket tier sold out");
		}

		return prisma.$transaction(async (tx) => {
			await tx.ticketTier.update({
				where: { id: ticket.tierId },
				data: { soldCount: { decrement: 1 } },
			});

			await tx.ticketTier.update({
				where: { id: nextTierId },
				data: { soldCount: { increment: 1 } },
			});

			return tx.ticket.update({
				where: { id },
				data: {
					...input,
					pricePaid: tier.price,
				},
			});
		});
	}
}

export const ticketsService = new TicketsService();
