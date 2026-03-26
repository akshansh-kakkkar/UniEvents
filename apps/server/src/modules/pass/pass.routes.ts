import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import {
	createPass,
	getPass,
	getPassesByEvent,
	verifyPass,
} from "./pass.controller";

const router: Router = Router();

router.post("/passes", requireAuth, createPass);
router.get("/passes/:id", requireAuth, getPass);
router.get("/passes/event/:eventId", requireAuth, getPassesByEvent);
router.post("/passes/verify/:id", requireAuth, verifyPass);

export default router;
