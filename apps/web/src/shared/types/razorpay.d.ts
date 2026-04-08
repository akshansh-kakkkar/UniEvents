export {};

declare global {
	interface RazorpayPaymentResponse {
		razorpay_payment_id: string;
		razorpay_order_id: string;
		razorpay_signature: string;
	}

	interface RazorpayCheckoutOptions {
		key: string;
		amount: number;
		currency: string;
		order_id: string;
		name: string;
		description?: string;
		image?: string;
		prefill?: {
			name?: string;
			email?: string;
			contact?: string;
		};
		notes?: Record<string, string>;
		theme?: {
			color?: string;
		};
		modal?: {
			ondismiss?: () => void;
		};
		handler?: (response: RazorpayPaymentResponse) => void | Promise<void>;
	}

	interface RazorpayInstance {
		open(): void;
		close(): void;
	}

	interface Window {
		Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
	}
}
