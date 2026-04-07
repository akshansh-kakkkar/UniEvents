"use client";

import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "@voltaze/schema";

export interface EventCardProps {
	event: Event;
	className?: string;
}

export function EventCard({ event, className = "" }: EventCardProps) {
	const formatDate = (date: Date | string) => {
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const getTag = (name: string) => {
		const lower = name.toLowerCase();
		if (lower.includes("tech") || lower.includes("workshop") || lower.includes("code")) return "Tech";
		if (lower.includes("music") || lower.includes("concert")) return "Music";
		if (lower.includes("art") || lower.includes("culture") || lower.includes("fest")) return "Cultural";
		return "Meetup";
	};

	return (
		<Card
			className={`group w-full overflow-hidden rounded-[24px] border-none bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
		>
			<div className="relative h-44 w-full overflow-hidden bg-slate-100">
				<div
					role="img"
					aria-label={event.name}
					className="h-full w-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
					style={{
						backgroundImage: `url(${event.coverUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80"})`,
					}}
				/>
				{event.type === "FREE" && (
					<Badge className="absolute top-3 right-3 rounded-full bg-green-500 px-3 py-0.5 text-[10px] font-bold text-white hover:bg-green-600">
						Free
					</Badge>
				)}
				<Badge
					variant="secondary"
					className="absolute bottom-3 left-3 rounded-full border-none bg-white/90 px-3 py-1 text-[10px] font-bold text-black shadow-sm"
				>
					{getTag(event.name)}
				</Badge>
			</div>

			<CardContent className="p-5">
				<h3 className="mb-3 truncate font-bold text-black text-base transition-colors group-hover:text-[#030370]">
					{event.name}
				</h3>

				<div className="mb-5 flex items-center justify-between gap-2">
					<div className="flex items-center gap-1 font-semibold text-slate-500 text-[10px]">
						<Calendar size={12} className="text-slate-400" />
						<span>{formatDate(event.startDate)}</span>
					</div>
					<div className="flex items-center gap-1 font-semibold text-slate-500 text-[10px]">
						<MapPin size={12} className="text-slate-400" />
						<span className="max-w-[80px] truncate">
							{event.venueName}
						</span>
					</div>
					<div className="flex items-center gap-1 font-semibold text-slate-500 text-[10px]">
						<Users size={12} className="text-slate-400" />
						<span>120 Seats</span>
					</div>
				</div>

				<div className="flex items-center justify-between pt-2">
					<div className="font-extrabold text-black text-sm">
						{event.type === "FREE" ? "Free" : "₹399"} // Default to 399 for paid if no tiers parsed yet
					</div>
					<Button
						asChild
						size="sm"
						variant="secondary"
						className="h-8 rounded-full bg-blue-50 px-4 font-bold text-blue-600 text-xs transition-all hover:bg-blue-100"
					>
						{/* Workaround for Turbopack inline type casting bug */}
						<Link href={(`/events/${event.slug}`) as any}>
							Book Now{" "}
							<ArrowRight
								size={14}
								className="ml-1 transition-transform group-hover:translate-x-1"
							/>
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
