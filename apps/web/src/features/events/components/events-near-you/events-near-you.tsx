"use client";

import type { EventFilterInput } from "@voltaze/schema";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { useEvents } from "../../hooks/use-events";

const FILTERS = [
	{ id: "all", label: "All Events" },
	{ id: "weekend", label: "This Weekend" },
	{ id: "free", label: "Free" },
	{ id: "paid", label: "Paid" },
	{ id: "tech", label: "Tech" },
	{ id: "workshop", label: "Workshop" },
	{ id: "hackathon", label: "Hackathon" },
];

export function EventsNearYou() {
	const [activeFilter, setActiveFilter] = useState("all");

	// Prepare filters for API
	const getApiFilters = () => {
		const filters: EventFilterInput = {
			page: 1,
			limit: 6,
			sortBy: "startDate",
			sortOrder: "asc",
		};

		if (activeFilter === "free") filters.type = "FREE";
		if (activeFilter === "paid") filters.type = "PAID";

		if (activeFilter === "weekend") {
			const now = new Date();
			const friday = new Date(now.setDate(now.getDate() + (5 - now.getDay())));
			friday.setHours(18, 0, 0, 0);
			const sunday = new Date(friday);
			sunday.setDate(friday.getDate() + 2);
			sunday.setHours(23, 59, 59, 999);

			filters.startDateFrom = friday;
			filters.startDateTo = sunday;
		}

		if (["tech", "workshop", "hackathon"].includes(activeFilter)) {
			filters.search = activeFilter;
		}

		return filters;
	};

	const { data, isLoading } = useEvents(getApiFilters());
	const events = (data?.data || []).slice(0, 6);

	const formatDate = (date: Date | string) => {
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<section className="w-full bg-[#EBF3FF] py-20">
			<div className="mx-auto max-w-[1280px] px-6">
				<div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
					<div className="text-center md:text-left">
						<h2 className="mb-3 font-extrabold text-4xl text-black tracking-tighter md:text-6xl">
							Events Happening <span className="text-[#030370]">Near You</span>
						</h2>
						<p className="font-semibold text-lg text-slate-400 md:text-xl">
							Handpicked Events Across The Cities For You. All For You Mood And
							Vibes.
						</p>
					</div>
					<div className="flex justify-center md:justify-end">
						<Button
							asChild
							variant="outline"
							className="rounded-full border-slate-200 bg-white px-6 font-bold text-slate-600 transition-all hover:border-[#030370] hover:text-[#030370]"
						>
							<Link href="/events">
								Explore All Events
								<ArrowRight size={16} className="ml-2" />
							</Link>
						</Button>
					</div>
				</div>

				<div className="mb-12 flex flex-wrap gap-3">
					{FILTERS.map((filter) => (
						<Button
							key={filter.id}
							variant={activeFilter === filter.id ? "default" : "outline"}
							className={cn(
								"rounded-full px-6 font-bold text-base transition-all",
								activeFilter === filter.id
									? "border-[#030370] bg-[#030370] text-white hover:bg-[#030370]/90"
									: "border-slate-200 bg-white text-slate-600 hover:border-[#030370] hover:text-[#030370]",
							)}
							onClick={() => setActiveFilter(filter.id)}
						>
							{filter.label}
						</Button>
					))}
				</div>

				<div className="max-h-[250px]">
					{isLoading ? (
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							{[...Array(6)].map((_, i) => (
								<Skeleton key={i} className="h-[450px] w-full rounded-[32px]" />
							))}
						</div>
					) : events.length > 0 ? (
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							{events.map((event) => (
								<Card
									key={event.id}
									className="group overflow-hidden rounded-[32px] border-none bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
								>
									<div className="relative aspect-video w-full overflow-hidden bg-slate-100">
										<div
											role="img"
											aria-label={event.name}
											className="h-full w-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
											style={{
												backgroundImage: `url(${event.coverUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80"})`,
											}}
										/>
										{event.type === "FREE" && (
											<Badge className="absolute top-4 right-4 bg-green-500 px-3 py-1 font-bold text-xs hover:bg-green-600">
												Free
											</Badge>
										)}
										<Badge
											variant="secondary"
											className="absolute bottom-4 left-4 border-none bg-black/50 px-3 py-1 font-bold text-white text-xs backdrop-blur-md"
										>
											{event.mode === "ONLINE" ? "Online" : "Offline"}
										</Badge>
									</div>

									<CardContent className="p-6">
										<h3 className="mb-4 font-extrabold text-black text-xl leading-tight transition-colors group-hover:text-[#030370]">
											{event.name}
										</h3>

										<div className="mb-6 flex flex-wrap items-center gap-4">
											<div className="flex items-center gap-1.5 font-semibold text-slate-500 text-sm">
												<Calendar size={16} className="text-slate-400" />
												<span>{formatDate(event.startDate)}</span>
											</div>
											<div className="flex items-center gap-1.5 font-semibold text-slate-500 text-sm">
												<MapPin size={16} className="text-slate-400" />
												<span className="max-w-[150px] truncate">
													{event.venueName}
												</span>
											</div>
											<div className="flex items-center gap-1.5 font-semibold text-slate-500 text-sm">
												<Users size={16} className="text-slate-400" />
												<span>Multiple Seats</span>
											</div>
										</div>

										<div className="flex items-center justify-between border-slate-100 border-t pt-6">
											<div className="font-extrabold text-2xl text-black">
												{event.type === "FREE" ? "FREE" : "₹399"}
											</div>
											<Button
												asChild
												variant="secondary"
												className="group/btn rounded-full bg-slate-100 px-6 font-bold text-[#030370] transition-all hover:bg-[#030370] hover:text-white"
											>
												<Link href={`/events/${event.slug}` as Route}>
													Book Now{" "}
													<ArrowRight
														size={16}
														className="ml-2 transition-transform group-hover/btn:translate-x-1"
													/>
												</Link>
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className="rounded-[32px] bg-white py-20 text-center shadow-sm">
							<p className="font-bold text-lg text-slate-400">
								No events found for this filter.
							</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
