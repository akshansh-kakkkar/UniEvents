import {
	GraduationCap,
	Laptop,
	Music,
	Palette,
	UserPlus,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
	{
		id: "tech-dev",
		title: "Tech & Dev",
		keywords: ["tech", "dev", "hackathon", "code"],
		defaultCount: "234 events",
		Icon: Laptop,
		bg: "bg-slate-100",
		color: "text-slate-900",
	},
	{
		id: "music",
		title: "Music",
		keywords: ["music", "concert", "dj", "band", "festival"],
		defaultCount: "187 events",
		Icon: Music,
		bg: "bg-white",
		color: "text-slate-900",
	},
	{
		id: "college-fests",
		title: "College Fests",
		keywords: ["fest", "college", "university", "campus"],
		defaultCount: "40 events",
		Icon: GraduationCap,
		bg: "bg-orange-50",
		color: "text-orange-500",
	},
	{
		id: "workshops",
		title: "Workshops",
		keywords: ["workshop", "masterclass", "learn", "training", "course"],
		defaultCount: "158 events",
		Icon: Users,
		bg: "bg-gray-100",
		color: "text-gray-600",
	},
	{
		id: "art-culture",
		title: "Art & Culture",
		keywords: ["art", "culture", "comedy", "standup", "theater", "exhibition"],
		defaultCount: "80 events",
		Icon: Palette,
		bg: "bg-pink-50",
		color: "text-pink-500",
	},
	{
		id: "meetups",
		title: "Meetups",
		keywords: ["meetup", "networking", "community", "social"],
		defaultCount: "108 events",
		Icon: UserPlus,
		bg: "bg-yellow-50",
		color: "text-yellow-600",
	},
];

export function EventCategories() {
	const scrollRef = useRef<HTMLDivElement>(null);

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const offset = window.innerWidth < 640 ? 240 : 280; // card width + gap
			const scrollAmount = direction === "left" ? -offset : offset;
			scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	return (
		<section className="w-full bg-[#EBF3FF] py-20">
			<div className="mx-auto max-w-[1280px] px-6">
				<h2 className="mb-12 text-center font-extrabold text-4xl text-black tracking-tight md:text-left md:text-5xl">
					What are you into?
				</h2>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
					{CATEGORIES.map((category) => (
						<Link
							key={category.id}
							href={`/events?category=${category.id}`}
							className="group flex aspect-square w-56 shrink-0 snap-center flex-col items-center justify-center rounded-[32px] border border-gray-100 bg-white p-4 transition-all duration-300 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl sm:w-64"
						>
							<div
								className={`mb-6 rounded-2xl p-6 transition-transform duration-300 group-hover:scale-110 ${category.bg}`}
							>
								<category.Icon
									className={`h-10 w-10 stroke-[1.5] sm:h-12 sm:w-12 ${category.color}`}
								/>
							</div>
							<h3 className="mb-2 font-bold text-black text-xl">
								{category.title}
							</h3>
							<span className="text-center font-semibold text-gray-400 text-xs sm:text-sm">
								{category.count}
							</span>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
