"use client";

import { useMemo } from "react";
import { useEvents, useFavoriteEvents } from "../../hooks";
import { EventCard } from "../event-card/event-card";
import { EventCardSkeleton } from "../event-card/event-card-skeleton";

export function LikedEventsList() {
	const { favoriteIds } = useFavoriteEvents();
	const { data, isLoading } = useEvents({
		page: 1,
		limit: 100,
		sortBy: "startDate",
		sortOrder: "asc",
	});

	const events = data?.data || [];
	const favoriteEvents = useMemo(
		() => events.filter((event) => favoriteIds.has(event.id)),
		[events, favoriteIds],
	);

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
				{[...Array(6)].map((_, i) => (
					<EventCardSkeleton key={i} />
				))}
			</div>
		);
	}

	if (favoriteEvents.length === 0) {
		return (
			<div className="rounded-3xl border border-slate-300 border-dashed bg-white/80 px-8 py-14 text-center shadow-sm">
				<p className="font-bold text-2xl text-[#0d1a55]">No liked events yet</p>
				<p className="mt-2 text-slate-600 text-sm">
					Tap the heart on any event card and it will show up here.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
			{favoriteEvents.map((event) => (
				<EventCard key={event.id} event={event} className="h-full" />
			))}
		</div>
	);
}
