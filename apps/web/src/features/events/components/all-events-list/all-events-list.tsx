"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { EventFilterInput } from "@voltaze/schema";
import { EventCard } from "../event-card/event-card";
import { useEvents } from "../../hooks/use-events";

interface AllEventsListProps {
	searchParams: { search?: string; location?: string; category?: string };
}

export function AllEventsList({ searchParams }: AllEventsListProps) {
	const filters: EventFilterInput = {
		page: 1,
		limit: 50,
		sortBy: "startDate",
		sortOrder: "asc",
	};

	if (searchParams.search) {
		filters.search = searchParams.search;
	}
	
	if (searchParams.category) {
		const categoryStr = searchParams.category.toLowerCase().replace("-", " ");
		filters.search = filters.search ? `${filters.search} ${categoryStr}` : categoryStr;
	}

	const { data, isLoading } = useEvents(filters);
	const events = data?.data || [];

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{[...Array(6)].map((_, i) => (
					<Skeleton key={i} className="h-[350px] w-full rounded-[24px]" />
				))}
			</div>
		);
	}

	if (events.length === 0) {
		return (
			<div className="flex flex-col items-center gap-4 py-12">
				<p className="text-muted-foreground italic">
					No events found matching your criteria.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{events.map((event) => (
				<EventCard key={event.id} event={event} />
			))}
		</div>
	);
}
