import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import {
	createPayment,
	getPayment,
	getPaymentByOrder,
	updatePayment,
} from "./payment.controller";

const router: Router = Router();

router.post("/payments", requireAuth, createPayment);
router.get("/payments/:id", requireAuth, getPayment);
router.get("/payments/order/:orderId", requireAuth, getPaymentByOrder);
router.patch("/payments/:id", requireAuth, updatePayment);

export default router;
