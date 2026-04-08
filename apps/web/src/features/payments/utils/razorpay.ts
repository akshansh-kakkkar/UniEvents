let razorpayScriptPromise: Promise<void> | null = null;

export function loadRazorpayCheckoutScript() {
	if (typeof window === "undefined") {
		return Promise.reject(
			new Error("Razorpay is only available in the browser"),
		);
	}

	if (window.Razorpay) {
		return Promise.resolve();
	}

	if (razorpayScriptPromise) {
		return razorpayScriptPromise;
	}

	razorpayScriptPromise = new Promise<void>((resolve, reject) => {
		const existingScript = document.getElementById("razorpay-checkout-js");
		if (existingScript) {
			resolve();
			return;
		}

		const script = document.createElement("script");
		script.id = "razorpay-checkout-js";
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => {
			razorpayScriptPromise = null;
			reject(new Error("Failed to load Razorpay checkout script"));
		};

		document.body.appendChild(script);
	});

	return razorpayScriptPromise;
}
