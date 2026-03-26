import { betterAuth } from "better-auth";
import type { Session, User } from "better-auth/types";

const auth = betterAuth({
	database: {
		provider: "postgresql",
		url: process.env.DATABASE_URL,
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
	},
});

export type AuthSession = Session;
export type AuthUser = User;
export const getAuth = () => auth;
export const getAuthApi = () => auth.api;
export { auth };
