import type {
	CheckInMethod,
	EventMode,
	EventStatus,
	EventType,
	EventVisibility,
	OrderStatus,
	PassStatus,
	PassType,
	PaymentGateway,
	PaymentStatus,
	UserRole,
} from "@voltaze/db";

export type {
	CheckInMethod,
	EventMode,
	EventStatus,
	EventType,
	EventVisibility,
	OrderStatus,
	PassStatus,
	PassType,
	PaymentGateway,
	PaymentStatus,
	UserRole,
};

export const UserRoleSchema = {
	ADMIN: "ADMIN",
	HOST: "HOST",
	USER: "USER",
} as const;

export const EventTypeSchema = {
	FREE: "FREE",
	PAID: "PAID",
} as const;

export const EventModeSchema = {
	ONLINE: "ONLINE",
	OFFLINE: "OFFLINE",
} as const;

export const EventVisibilitySchema = {
	PUBLIC: "PUBLIC",
	PRIVATE: "PRIVATE",
} as const;

export const EventStatusSchema = {
	DRAFT: "DRAFT",
	PUBLISHED: "PUBLISHED",
	CANCELLED: "CANCELLED",
	COMPLETED: "COMPLETED",
} as const;

export const OrderStatusSchema = {
	PENDING: "PENDING",
	COMPLETED: "COMPLETED",
	CANCELLED: "CANCELLED",
} as const;

export const PassTypeSchema = {
	GENERAL: "GENERAL",
	VIP: "VIP",
	BACKSTAGE: "BACKSTAGE",
	SPEAKER: "SPEAKER",
} as const;

export const PassStatusSchema = {
	ACTIVE: "ACTIVE",
	USED: "USED",
	CANCELLED: "CANCELLED",
} as const;

export const CheckInMethodSchema = {
	QR_SCAN: "QR_SCAN",
	MANUAL: "MANUAL",
} as const;

export const PaymentStatusSchema = {
	PENDING: "PENDING",
	SUCCESS: "SUCCESS",
	FAILED: "FAILED",
	REFUNDED: "REFUNDED",
} as const;

export const PaymentGatewaySchema = {
	RAZORPAY: "RAZORPAY",
} as const;
