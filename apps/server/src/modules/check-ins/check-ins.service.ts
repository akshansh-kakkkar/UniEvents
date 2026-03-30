import { type Prisma, prisma, type UserRole } from "@voltaze/db";
import type { CheckInFilterInput, CreateCheckInInput } from "@voltaze/schema";

import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "@/common/exceptions/app-error";

type CheckInActor = {
	userId: string;
	role: UserRole;
};

export class CheckInsService {
	private canManageAll(actor: CheckInActor) {
		return actor.role === "ADMIN";
	}

	private buildAccessWhere(actor: CheckInActor): Prisma.CheckInWhereInput {
		if (this.canManageAll(actor)) {
			return {};
		}

		if (actor.role === "HOST") {
			return {
				attendee: {
					event: {
						userId: actor.userId,
					},
				},
			};
		}

		return {
			attendee: {
				userId: actor.userId,
			},
		};
	}

	private ensureCanCreateCheckIn(
		attendee: { event: { userId: string | null } },
		actor: CheckInActor,
	) {
		if (this.canManageAll(actor)) {
			return;
		}

		if (actor.role === "USER") {
			throw new ForbiddenError("Only organizers can create check-ins");
		}

		if (!attendee.event.userId || attendee.event.userId !== actor.userId) {
			throw new ForbiddenError("You can only create check-ins for your events");
		}
	}

	async list(input: CheckInFilterInput, actor: CheckInActor) {
		const { page, limit, sortBy, sortOrder, dateFrom, dateTo, ...filters } =
			input;
		const skip = (page - 1) * limit;
		return prisma.checkIn.findMany({
			where: {
				...filters,
				...this.buildAccessWhere(actor),
				timestamp:
					dateFrom || dateTo
						? {
								gte: dateFrom,
								lte: dateTo,
							}
						: undefined,
			},
			orderBy: { [sortBy]: sortOrder },
			skip,
			take: limit,
		});
	}

	async getById(id: string, actor: CheckInActor) {
		const checkIn = await prisma.checkIn.findFirst({
			where: {
				id,
				...this.buildAccessWhere(actor),
			},
		});

		if (!checkIn) throw new NotFoundError("Check-in not found");
		return checkIn;
	}

	async create(input: CreateCheckInInput, actor: CheckInActor) {
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
			throw new BadRequestError("Attendee does not belong to this event");
		}

		this.ensureCanCreateCheckIn(attendee, actor);

		return prisma.checkIn.create({ data: input });
	}
}

export const checkInsService = new CheckInsService();
