import type { Account, Session, User, Verification } from "@voltaze/db";
import { z } from "zod";

export type { Account, Session, User, Verification };

export const userSchema = z.object({
	id: z.string().cuid(),
	name: z.string().nullable(),
	email: z.string().email(),
	emailVerified: z.boolean(),
	image: z.string().nullable(),
	role: z.enum(["ADMIN", "HOST", "USER"]),
	createdAt: z.date(),
	updatedAt: z.date(),
}) satisfies z.ZodType<User>;

export const createUserSchema = userSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		emailVerified: true,
	})
	.extend({
		email: z.string().email(),
		name: z.string().optional(),
		role: z.enum(["ADMIN", "HOST", "USER"]).default("USER"),
	});

export const updateUserSchema = userSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	})
	.partial()
	.extend({
		email: z.string().email().optional(),
		name: z.string().nullable().optional(),
		role: z.enum(["ADMIN", "HOST", "USER"]).optional(),
	});

export const sessionSchema = z.object({
	id: z.string().cuid(),
	userId: z.string().cuid(),
	token: z.string(),
	expiresAt: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
	ipAddress: z.string().nullable(),
	userAgent: z.string().nullable(),
}) satisfies z.ZodType<Session>;

export const createSessionSchema = sessionSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const accountSchema = z.object({
	id: z.string().cuid(),
	userId: z.string().cuid(),
	accountId: z.string(),
	providerId: z.string(),
	refreshToken: z.string().nullable(),
	accessToken: z.string().nullable(),
	accessTokenExpiresAt: z.date().nullable(),
	refreshTokenExpiresAt: z.date().nullable(),
	scope: z.string().nullable(),
	idToken: z.string().nullable(),
	password: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
}) satisfies z.ZodType<Account>;

export const createAccountSchema = accountSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const verificationSchema = z.object({
	id: z.string().cuid(),
	identifier: z.string(),
	value: z.string(),
	expiresAt: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
}) satisfies z.ZodType<Verification>;

export const createVerificationSchema = verificationSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type CreateVerificationInput = z.infer<typeof createVerificationSchema>;
