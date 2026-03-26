import {
	createOrderSchema,
	orderFilterSchema,
	updateOrderSchema,
} from "@voltaze/schema";
import type { Request, RequestHandler, Response } from "express";
import { controller, created, ok, validateBody } from "../../lib/controller.js";
import * as ordersService from "./orders.service.js";

export const createOrder: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const order = await ordersService.createOrder(req.body);
		created(res, order);
	},
);

export const getOrder: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const order = await ordersService.getOrderById(req.params.id as string);
		ok(res, order);
	},
);

export const listOrders: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const result = await ordersService.listOrders(req.query as any);
		ok(res, result);
	},
);

export const updateOrderStatus: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const order = await ordersService.updateOrderStatus(
			req.params.id as string,
			req.body.status,
		);
		ok(res, order);
	},
);

export const cancelOrder: RequestHandler = controller(
	async (req: Request, res: Response) => {
		const order = await ordersService.cancelOrder(req.params.id as string);
		ok(res, order);
	},
);

export {
	createOrderSchema,
	orderFilterSchema,
	updateOrderSchema,
	validateBody,
};
