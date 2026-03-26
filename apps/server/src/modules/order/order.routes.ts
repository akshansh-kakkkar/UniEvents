import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import {
	createOrder,
	getOrder,
	getOrdersByEvent,
	updateOrder,
} from "./order.controller";

const router: Router = Router();

router.post("/orders", requireAuth, createOrder);
router.get("/orders/:id", requireAuth, getOrder);
router.get("/orders/event/:eventId", requireAuth, getOrdersByEvent);
router.patch("/orders/:id", requireAuth, updateOrder);

export default router;
