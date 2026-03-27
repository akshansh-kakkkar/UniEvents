"use client";

import { authClient } from "@/lib/auth/client";

export default function DashboardPage() {
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return (
			<main className="container mx-auto max-w-3xl px-4 py-6">
				Loading session...
			</main>
		);
	}

	return (
		<main className="container mx-auto max-w-3xl px-4 py-6">
			<h1 className="font-semibold text-2xl">Dashboard</h1>
			<p className="mt-2 text-muted-foreground text-sm">
				{session?.user
					? `Signed in as ${session.user.email}`
					: "No active session"}
			</p>
		</main>
	);
}
