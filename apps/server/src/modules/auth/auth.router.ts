import type { Router } from "express";
import * as authController from "./auth.controller.js";

export function createAuthRouter(router: Router) {
	router.post("/auth/sign-up", authController.signUp);
	router.post("/auth/sign-in", authController.signIn);
	router.post("/auth/sign-out", authController.signOut);
	router.get("/auth/session", authController.getSession);
	router.get("/auth/sessions", authController.listSessions);
	router.delete("/auth/sessions/:sessionId", authController.deleteSession);
}
