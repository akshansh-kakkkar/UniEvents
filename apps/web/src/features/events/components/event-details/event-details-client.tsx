"use client";

import { useEvent } from "../../hooks/use-events";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
	Calendar, 
	MapPin, 
	Users, 
	Info, 
	Languages, 
	Globe, 
	UserCircle2, 
	Mail, 
	Navigation,
	Footprints,
	Car,
	Train
} from "lucide-react";
import { Navbar } from "@/shared/ui/navbar";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

export function EventDetailsClient({ slug }: { slug: string }) {
	const { data: event, isLoading } = useEvent(slug);
	const [activeTab, setActiveTab] = useState("Details");

	if (isLoading) {
		return (
			<div className="flex flex-col min-h-screen bg-white">
				<Navbar />
				<div className="pt-24 container mx-auto px-6 space-y-12">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
						<div className="lg:col-span-2 space-y-8">
							<Skeleton className="h-[400px] w-full rounded-[24px]" />
							<Skeleton className="h-16 w-3/4" />
							<div className="grid grid-cols-2 gap-4">
								<Skeleton className="h-20 w-full rounded-2xl" />
								<Skeleton className="h-20 w-full rounded-2xl" />
							</div>
						</div>
						<div className="space-y-6">
							<Skeleton className="h-[500px] w-full rounded-[32px]" />
							<Skeleton className="h-24 w-full rounded-2xl" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!event) {
		return (
			<div className="w-full bg-white min-h-screen flex flex-col">
				<Navbar />
				<div className="container flex-1 flex items-center justify-center mx-auto px-6 pt-24 text-center">
					<div>
						<h2 className="text-4xl font-extrabold mb-4 text-[#030370]">Event not found</h2>
						<p className="text-slate-500 mb-8 text-lg font-medium">
							The event you are looking for does not exist or has been removed.
						</p>
						<Button asChild size="lg" className="rounded-full bg-[#030370] px-10">
							<a href="/events">Browse all events</a>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	const formatDate = (date: Date | string) => {
		const d = new Date(date);
		return d.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
		}) + " " + d.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
	};

	const formatDayMonth = (date: Date | string) => {
		const d = new Date(date);
		const day = d.getDate();
		const month = d.toLocaleDateString("en-US", { month: "short" });
		const year = d.getFullYear().toString().slice(-2);
		
		// Add ordinal suffix (st, nd, rd, th)
		const suffix = (day: number) => {
			if (day > 3 && day < 21) return 'th';
			switch (day % 10) {
				case 1: return "st";
				case 2: return "nd";
				case 3: return "rd";
				default: return "th";
			}
		};
		
		return `${month} ${day}${suffix(day)}'${year}`;
	};

	const TABS = ["Details", "Venue & Timeline", "Reviews", "FAQ", "Eligibility"];

	return (
		<div className="w-full bg-white min-h-screen pb-24">
			<Navbar />
			
			<div className="pt-24 container mx-auto px-6 lg:px-12 max-w-[1400px]">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
					
					{/* LEFT COLUMN: Overview */}
					<div className="lg:col-span-2 space-y-8">
						{/* Main Event Image */}
						<div className="relative aspect-[16/10] w-full overflow-hidden rounded-[24px] shadow-lg">
							<div
								className="h-full w-full bg-cover bg-center"
								role="img"
								aria-label={event.name}
								style={{ backgroundImage: `url(${event.coverUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80"})` }}
							/>
						</div>

						<div>
							<h1 className="text-5xl lg:text-[76px] font-extrabold text-black tracking-tight leading-[1.05] mb-10">
								{event.name}
							</h1>
							
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="flex items-center gap-4 p-5 rounded-[20px] border border-orange-500 bg-white">
									<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
										<Calendar className="w-6 h-6" />
									</div>
									<div className="flex flex-col">
										<span className="font-bold text-orange-600 text-lg">{formatDate(event.startDate)}</span>
										<span className="text-slate-400 font-semibold text-sm">Scheduled Date</span>
									</div>
								</div>

								<div className="flex items-center gap-4 p-5 rounded-[20px] border border-orange-500 bg-white">
									<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
										<MapPin className="w-6 h-6" />
									</div>
									<div className="flex flex-col">
										<span className="font-bold text-orange-600 text-lg">Bangalore, India</span>
										<span className="text-slate-400 font-semibold text-sm">Location</span>
									</div>
								</div>

								<div className="flex items-center gap-4 p-5 rounded-[20px] border border-orange-500 bg-white">
									<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
										<Users className="w-6 h-6" />
									</div>
									<div className="flex flex-col">
										<span className="font-bold text-orange-600 text-lg">150 Available Seats</span>
										<span className="text-slate-400 font-semibold text-sm">Capacity</span>
									</div>
								</div>

								<div className="flex items-center gap-4 p-5 rounded-[20px] border border-orange-500 bg-white">
									<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
										<Globe className="w-6 h-6" />
									</div>
									<div className="flex flex-col">
										<span className="font-bold text-orange-600 text-lg">Offline</span>
										<span className="text-slate-400 font-semibold text-sm">Event Mode</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* RIGHT COLUMN: Action Sidebar */}
					<div className="space-y-6 lg:sticky lg:top-24">
						{/* Registration Card */}
						<div className="rounded-[32px] bg-white p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col">
							<div className="flex justify-between items-start mb-8">
								<div className="flex flex-col">
									<span className="text-slate-500 font-semibold text-base mb-1">Registration Fee</span>
									<span className="text-3xl font-extrabold text-black">₹399</span>
								</div>
								<div className="flex flex-col items-end">
									<span className="text-slate-500 font-semibold text-base mb-1">Date</span>
									<span className="text-2xl font-extrabold text-black">{formatDayMonth(event.startDate)}</span>
								</div>
							</div>

							<div className="space-y-5 mb-10">
								<div className="flex items-center gap-3">
									<MapPin className="w-5 h-5 text-[#030370]" />
									<span className="font-bold text-slate-700 text-sm">Cafe, Indiranagar, Bangalore</span>
								</div>
								<div className="flex items-center gap-3">
									<Clock className="w-5 h-5 text-[#030370]" />
									<span className="font-bold text-slate-700 text-sm">Time: 2:00 - 5:00 PM</span>
								</div>
								<div className="flex items-center gap-3">
									<Languages className="w-5 h-5 text-[#030370]" />
									<span className="font-bold text-slate-700 text-sm">English</span>
								</div>
								<div className="flex items-center gap-3">
									<Globe className="w-5 h-5 text-[#030370]" />
									<span className="font-bold text-slate-700 text-sm">Offline</span>
								</div>
								<div className="flex items-center gap-3">
									<Users className="w-5 h-5 text-[#030370]" />
									<span className="font-bold text-slate-700 text-sm">13+ Years</span>
								</div>
							</div>

							<Button className="w-full h-16 rounded-[24px] bg-[#070190] hover:bg-[#030370] text-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-[0_12px_24px_rgba(7,1,144,0.3)]">
								Book Now
							</Button>
							<span className="text-slate-400 text-[10px] text-center mt-3 font-semibold uppercase tracking-wider">
								secure checkout powered by razorpay
							</span>
						</div>

						{/* Organizer Mini Card */}
						<div className="flex items-center gap-4 p-5 rounded-[24px] border border-slate-200 bg-white">
							<div className="h-16 w-16 rounded-2xl bg-blue-100/50 flex items-center justify-center overflow-hidden">
								<UserCircle2 className="w-10 h-10 text-blue-600/40" />
							</div>
							<div className="flex flex-col">
								<span className="text-xl font-bold text-black">Event Organizer Name</span>
								<span className="text-slate-400 font-semibold text-sm">Verified Organizer</span>
							</div>
						</div>
					</div>
				</div>

				<section className="mt-24">
					<h2 className="text-4xl font-extrabold text-black mb-8 uppercase tracking-tight">Manifesto</h2>
					<div className="rounded-[24px] border border-blue-200 bg-white overflow-hidden shadow-sm">
						<div className="flex overflow-x-auto border-b border-blue-100 px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
							{TABS.map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={cn(
										"px-8 py-5 font-bold text-lg transition-all relative shrink-0",
										activeTab === tab ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
									)}
								>
									{tab}
									{activeTab === tab && (
										<div className="absolute bottom-0 left-4 right-4 h-1 bg-blue-600 rounded-full" />
									)}
								</button>
							))}
						</div>
						<div className="p-8 md:p-12 min-h-[400px] flex items-center justify-center text-center">
							{activeTab === "Details" ? (
								<div className="max-w-4xl prose prose-slate">
									<p className="text-slate-600 font-medium text-xl leading-relaxed whitespace-pre-wrap">
										{event.description}
									</p>
								</div>
							) : (
								<div className="text-3xl font-bold text-black opacity-80">{activeTab}</div>
							)}
						</div>
					</div>
				</section>

				<section className="mt-24">
					<h2 className="text-4xl font-extrabold text-black mb-8 uppercase tracking-tight">How to reach this spot</h2>
					<div className="rounded-[32px] border border-slate-200 bg-white overflow-hidden shadow-md">
						<div 
							className="h-[400px] w-full bg-slate-100 flex items-center justify-center relative bg-cover bg-center"
							style={{ backgroundImage: `url(https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&q=80)` }}
						>
							<div className="absolute inset-0 bg-black/5" />
							<div className="relative bg-white p-4 rounded-xl shadow-2xl flex flex-col gap-1 max-w-[280px]">
								<span className="font-bold text-slate-800 text-xs">3275, Ground Floor, HAL 2nd Stage,</span>
								<span className="font-bold text-slate-800 text-xs">12th Main Road, Indiranagar,</span>
								<span className="font-bold text-slate-800 text-xs">Bangalore-560008, Karnataka</span>
								<div className="absolute -bottom-2 left-6 w-4 h-4 bg-white rotate-45" />
							</div>
							<MapPin className="absolute bottom-1/2 left-1/2 -translate-x-1/2 -translate-y-[20%] w-12 h-12 text-red-600 drop-shadow-xl fill-current" />
						</div>
						<div className="flex items-center justify-center gap-12 py-6 bg-white border-t border-slate-100">
							<button className="flex items-center gap-2 font-bold text-blue-600 transition-colors hover:text-blue-800">
								<Footprints className="w-5 h-5" /> Walking
							</button>
							<button className="flex items-center gap-2 font-bold text-blue-600 transition-colors hover:text-blue-800">
								<Car className="w-5 h-5" /> Drive
							</button>
							<button className="flex items-center gap-2 font-bold text-blue-600 transition-colors hover:text-blue-800">
								<Train className="w-5 h-5" /> Metro
							</button>
						</div>
					</div>
				</section>

				{/* ORGANIZER INFO SECTION */}
				<section className="mt-24">
					<h2 className="text-4xl font-extrabold text-black mb-8 uppercase tracking-tight">Organizer Info</h2>
					<div className="w-full rounded-[40px] p-10 md:p-16 bg-gradient-to-br from-[#1a1a5e] to-[#030330] text-white shadow-2xl relative overflow-hidden">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
							<div className="space-y-8">
								<h3 className="text-4xl font-extrabold tracking-tight">Roarclub Events</h3>
								<p className="text-slate-300 font-medium text-lg leading-relaxed max-w-xl">
									Welcome to The Vibrant Heart of Our Campus, Where
									High-Energy Events, Digital Culture, and Exciting
									Hackathons Come To Life! Join Us To Connect,
									Innovate, And Celebrate Creativity in A Dynamic
									Environment.
								</p>
								
								<div className="space-y-6">
									<h4 className="text-xl font-bold uppercase tracking-widest text-slate-100 flex items-center gap-3">
										Hosted By <div className="h-0.5 w-12 bg-white/30" />
									</h4>
									<div className="flex flex-wrap gap-8">
										{[
											{ name: "Abhinav Mishra", role: "Host" },
											{ name: "Ashish Solanki", role: "Manager" },
											{ name: "Samay Raina", role: "Co-Host" }
										].map((person, i) => (
											<div key={i} className="flex flex-col items-center gap-2">
												<div className="h-20 w-20 rounded-[20px] bg-blue-100/20 shadow-inner flex items-center justify-center">
													<UserCircle2 className="w-12 h-12 text-white/50" />
												</div>
												<span className="text-center font-bold text-xs whitespace-pre-wrap max-w-[80px]">
													{person.name}
												</span>
											</div>
										))}
									</div>
								</div>
							</div>

							<div className="flex flex-wrap gap-12 lg:justify-center">
								<div className="space-y-5">
									<h4 className="text-xl font-bold mb-6">Navigation</h4>
									<ul className="space-y-4 text-slate-300 font-semibold text-sm">
										<li>
											<Link 
												// biome-ignore lint/suspicious/noExplicitAny: Workaround for Next.js 15 static route typing
												href={"/events" as any} 
												className="hover:text-white cursor-pointer transition-colors"
											>
												All Events
											</Link>
										</li>
										<li className="hover:text-white cursor-pointer transition-colors">Venues</li>
										<li className="hover:text-white cursor-pointer transition-colors">Safety Policy</li>
										<li className="hover:text-white cursor-pointer transition-colors">Ticket FAQ</li>
									</ul>
								</div>
								<div className="space-y-5">
									<h4 className="text-xl font-bold mb-6">Support</h4>
									<ul className="space-y-4 text-slate-300 font-semibold text-sm">
										<li className="hover:text-white cursor-pointer transition-colors">Help Centre</li>
										<li>
											<Link 
												// biome-ignore lint/suspicious/noExplicitAny: Workaround for Next.js 15 static route typing
												href={"/refund" as any} 
												className="hover:text-white cursor-pointer transition-colors"
											>
												Refund Policy
											</Link>
										</li>
										<li>
											<Link 
												// biome-ignore lint/suspicious/noExplicitAny: Workaround for Next.js 15 static route typing
												href={"/privacy" as any} 
												className="hover:text-white cursor-pointer transition-colors"
											>
												Privacy Policy
											</Link>
										</li>
										<li>
											<Link 
												// biome-ignore lint/suspicious/noExplicitAny: Workaround for Next.js 15 static route typing
												href={"/terms" as any} 
												className="hover:text-white cursor-pointer transition-colors"
											>
												Terms of Service
											</Link>
										</li>
									</ul>
								</div>
								
								<div className="flex flex-col gap-4 w-full md:w-auto">
									<div className="flex gap-4">
										<Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white/10 hover:bg-white/20 border-white/10">
											<Share2 className="w-8 h-8" />
										</Button>
										<Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white/10 hover:bg-white/20 border-white/10">
											<Mail className="w-8 h-8" />
										</Button>
										<Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white/10 hover:bg-white/20 border-white/10">
											<Navigation className="w-8 h-8" />
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
