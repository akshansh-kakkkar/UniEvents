import { type Prisma, prisma, type UserRole } from "@voltaze/db";
import type {
	CreateOrderInput,
	OrderFilterInput,
	UpdateOrderInput,
} from "@voltaze/schema";

import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "@/common/exceptions/app-error";

type OrderActor = {
	userId: string;
	role: UserRole;
};

export class OrdersService {
	private canManageAll(actor: OrderActor) {
		return actor.role === "ADMIN";
	}

	private buildAccessWhere(actor: OrderActor): Prisma.OrderWhereInput {
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
			attendee: {
				userId: actor.userId,
			},
		};
	}

	private ensureCanUseAttendee(
		attendee: { userId: string | null; event: { userId: string | null } },
		actor: OrderActor,
	) {
		if (this.canManageAll(actor)) {
			return;
		}

		if (actor.role === "HOST") {
			if (!attendee.event.userId || attendee.event.userId !== actor.userId) {
				throw new ForbiddenError("You can only manage orders for your events");
			}

			return;
		}

		if (!attendee.userId || attendee.userId !== actor.userId) {
			throw new ForbiddenError("You can only manage your own orders");
		}
	}

	private ensureCanUseStatusUpdate(input: UpdateOrderInput, actor: OrderActor) {
		if (actor.role !== "USER") {
			return;
		}

		if (input.status && input.status !== "CANCELLED") {
			throw new ForbiddenError("Users can only cancel their own orders");
		}
	}

	async list(input: OrderFilterInput, actor: OrderActor) {
		const { page, limit, sortBy, sortOrder, ...filters } = input;
		const skip = (page - 1) * limit;
		return prisma.order.findMany({
			where: {
				...filters,
				deletedAt: null,
				...this.buildAccessWhere(actor),
			},
			orderBy: { [sortBy]: sortOrder },
			skip,
			take: limit,
		});
	}

	async getById(id: string, actor: OrderActor) {
		const order = await prisma.order.findFirst({
			where: {
				id,
				deletedAt: null,
				...this.buildAccessWhere(actor),
			},
		});
		if (!order || order.deletedAt) throw new NotFoundError("Order not found");
		return order;
	}

	async create(input: CreateOrderInput, actor: OrderActor) {
		const attendee = await prisma.attendee.findUnique({
			where: { id: input.attendeeId },
			include: {
				event: {
					select: {
						userId: true,
					},
				},
			},
		});
		if (!attendee) throw new NotFoundError("Attendee not found");
		if (attendee.eventId !== input.eventId) {
			throw new BadRequestError("Attendee does not belong to event");
		}
		this.ensureCanUseAttendee(attendee, actor);

		const event = await prisma.event.findUnique({
			where: { id: input.eventId },
		});
		if (!event) throw new NotFoundError("Event not found");

		return prisma.order.create({ data: input });
	}

	async update(id: string, input: UpdateOrderInput, actor: OrderActor) {
		const order = await this.getById(id, actor);
		this.ensureCanUseStatusUpdate(input, actor);

		if (
			actor.role === "USER" &&
			(input.eventId !== undefined || input.attendeeId !== undefined)
		) {
			throw new BadRequestError("Users cannot reassign orders");
		}

		const nextEventId = input.eventId ?? order.eventId;
		const nextAttendeeId = input.attendeeId ?? order.attendeeId;

		if (nextEventId !== order.eventId || nextAttendeeId !== order.attendeeId) {
			const attendee = await prisma.attendee.findUnique({
				where: { id: nextAttendeeId },
				include: {
					event: {
						select: {
							userId: true,
						},
					},
				},
			});

			if (!attendee) {
				throw new NotFoundError("Attendee not found");
			}

			if (attendee.eventId !== nextEventId) {
				throw new BadRequestError("Attendee does not belong to event");
			}

			this.ensureCanUseAttendee(attendee, actor);
		}

		return prisma.order.update({ where: { id }, data: input });
	}
}

export const ordersService = new OrdersService();
