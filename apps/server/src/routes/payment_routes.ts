import { Router } from "express";
import {
	createPayment,
	getPayment,
	getPaymentByOrder,
	updatePayment,
} from "../controller/payment_controller";

const router: Router = Router();

router.post("/payments", createPayment);
router.get("/payments/:id", getPayment);
router.get("/payments/order/:orderId", getPaymentByOrder);
router.patch("/payments/:id", updatePayment);

export default router;
