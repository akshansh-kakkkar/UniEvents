import { Heart } from "lucide-react";
import { LikedEventsList } from "@/features/events/components/liked-events-list/liked-events-list";
import { Footer } from "@/shared/ui/footer";
import { Navbar } from "@/shared/ui/navbar";

export default function LikedEventsPage() {
	return (
		<div className="min-h-screen bg-[#f8fbff]">
			<Navbar />
			<main className="mx-auto w-full max-w-7xl px-4 pt-20 pb-12 sm:px-6 lg:px-8">
				<section className="mb-8 rounded-3xl border border-[#e5ebff] bg-white/85 p-6 shadow-sm backdrop-blur-sm">
					<div className="flex items-center gap-3">
						<div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
							<Heart className="h-5 w-5" />
						</div>
						<div>
							<p className="font-bold text-2xl text-[#0d1a55]">Liked Events</p>
							<p className="text-slate-600 text-sm">
								Your saved events in one place.
							</p>
						</div>
					</div>
				</section>

				<LikedEventsList />
			</main>
			<Footer />
		</div>
	);
}
