import { env } from "@voltaze/env/server";
import cors from "cors";
import express, { Router } from "express";

import { errorHandler } from "./lib/middleware/error.js";
import { logger } from "./lib/middleware/logger.js";
import { rateLimiter } from "./lib/middleware/rateLimit.js";
import { requestId } from "./lib/middleware/requestId.js";
import { createAttendeesRouter } from "./modules/attendees/attendees.router.js";
import { createAuthRouter } from "./modules/auth/auth.router.js";
import { createCheckInRouter } from "./modules/checkIn/checkIn.router.js";
import { createEventsRouter } from "./modules/events/events.router.js";
import { createOrdersRouter } from "./modules/orders/orders.router.js";
import { createPaymentsRouter } from "./modules/payments/payments.router.js";
import { createTicketsRouter } from "./modules/tickets/tickets.router.js";

const app = express();

app.use(
	cors({
		origin: env.CORS_ORIGIN,
		methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
		credentials: true,
	}),
);

app.use(express.json());
app.use(requestId);
app.use(logger);
app.use(rateLimiter);

const router = Router();

createAuthRouter(router);
createEventsRouter(router);
createOrdersRouter(router);
createPaymentsRouter(router);
createTicketsRouter(router);
createCheckInRouter(router);
createAttendeesRouter(router);

app.use(router);

app.get("/health", (_req, res) => {
	res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});

process.on("SIGTERM", () => {
	console.log("SIGTERM received, shutting down gracefully...");
	server.close(() => {
		console.log("Server closed");
		process.exit(0);
	});
});

process.on("SIGINT", () => {
	console.log("SIGINT received, shutting down gracefully...");
	server.close(() => {
		console.log("Server closed");
		process.exit(0);
	});
});
