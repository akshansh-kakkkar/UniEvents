import { Router } from "express";
import {
	createOrder,
	getOrder,
	getOrdersByEvent,
	updateOrder,
} from "../controller/order_controller";

const router: Router = Router();

router.post("/orders", createOrder);
router.get("/orders/:id", getOrder);
router.get("/orders/event/:eventId", getOrdersByEvent);
router.patch("/orders/:id", updateOrder);

export default router;
