import prisma from "@voltaze/db";
import type { Request, Response } from "express";
import { z } from "zod";

const eventSchema = z.object({
	name: z.string(),
	slug: z.string().optional(),
	userId: z.string().optional(),
	coverUrl: z.string().url(),
	thumbnail: z.string().url(),
	venueName: z.string(),
	address: z.string(),
	latitude: z.string(),
	longitude: z.string(),
	timezone: z.coerce.date(),
	startDate: z.coerce.date(),
	endDate: z.coerce.date(),
	type: z.enum(["FREE", "PAID"]),
	mode: z.enum(["ONLINE", "OFFLINE"]),
	visibility: z.enum(["PUBLIC", "PRIVATE"]),
	status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]).optional(),
	description: z.string(),
});

const slugify = (text: string) => {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^\w-]+/g, "")
		.replace(/--+/g, "-");
};

const updateEventSchema = eventSchema.partial();

export const createEvent = async (req: Request, res: Response) => {
	try {
		const validation = eventSchema.safeParse(req.body);
		if (!validation.success) {
			return res.status(400).json({
				message: "Invalid input",
				errors: validation.error.issues,
			});
		}

		const { userId, ...eventData } = validation.data;
		const data: any = {
			...eventData,
			slug: validation.data.slug || slugify(validation.data.name),
		};

		if (userId) {
			data.user = { connect: { id: userId } };
		}

		const event = await prisma.event.create({
			data,
		});
		res.status(201).json(event);
	} catch (error) {
		res.status(500).json({
			message: "Error creating event",
			error,
		});
	}
};

export const getEvents = async (_req: Request, res: Response) => {
	try {
		const events = await prisma.event.findMany({
			include: {
				_count: {
					select: { tickets: true, attendees: true },
				},
			},
		});
		res.json(events);
	} catch (error) {
		res.status(500).json({
			message: "Error fetching events",
			error,
		});
	}
};

export const getEventById = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	try {
		const event = await prisma.event.findUnique({
			where: { id },
			include: {
				tickets: true,
				_count: {
					select: { attendees: true },
				},
			},
		});
		if (!event) {
			return res.status(404).json({
				message: "Event not found",
			});
		}
		res.json(event);
	} catch (error) {
		res.status(500).json({
			message: "Error fetching event",
			error,
		});
	}
};

export const getEventBySlug = async (req: Request, res: Response) => {
	const slug = req.params.slug as string;
	try {
		const whereBySlug = { slug } as unknown as Record<string, string>;
		const event = await prisma.event.findFirst({
			where: whereBySlug,
			include: {
				tickets: true,
				_count: {
					select: { attendees: true },
				},
			},
		});

		if (!event) {
			return res.status(404).json({
				message: "Event not found",
			});
		}
		res.json(event);
	} catch (error) {
		res.status(500).json({
			message: "Error fetching event by slug",
			error,
		});
	}
};

export const updateEvent = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	try {
		const validation = updateEventSchema.safeParse(req.body);
		if (!validation.success) {
			return res.status(400).json({
				message: "Invalid input",
				errors: validation.error.issues,
			});
		}

		const { userId, ...updateData } = validation.data;
		const data: any = { ...updateData };

		if (userId) {
			data.user = { connect: { id: userId } };
		}

		const event = await prisma.event.update({
			where: { id },
			data,
		});
		res.json(event);
	} catch (error) {
		res.status(500).json({
			message: "Error updating event",
			error,
		});
	}
};

export const deleteEvent = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	try {
		await prisma.event.delete({
			where: { id },
		});
		res.status(204).send();
	} catch (error) {
		res.status(500).json({
			message: "Error deleting event",
			error,
		});
	}
};
