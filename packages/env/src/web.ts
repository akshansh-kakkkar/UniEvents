import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		NEON_AUTH_BASE_URL: z.url(),
		NEON_AUTH_COOKIE_SECRET: z.string().min(32),
	},
	client: {
		NEXT_PUBLIC_SERVER_URL: z.url(),
	},
	runtimeEnv: {
		NEON_AUTH_BASE_URL: process.env.NEON_AUTH_BASE_URL,
		NEON_AUTH_COOKIE_SECRET: process.env.NEON_AUTH_COOKIE_SECRET,
		NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
	},
	emptyStringAsUndefined: true,
});
