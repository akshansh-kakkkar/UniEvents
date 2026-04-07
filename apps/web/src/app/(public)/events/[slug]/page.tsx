import { EventDetailsClient } from "@/features/events/components/event-details/event-details-client";

export default async function EventPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	return <EventDetailsClient slug={slug} />;
}
