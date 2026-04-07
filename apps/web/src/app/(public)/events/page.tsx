import { MapPin, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AllEventsList } from "@/features/events/components/all-events-list/all-events-list";

import { Navbar } from "@/shared/ui/navbar";

export default async function EventsPage({
	searchParams,
}: {
	searchParams: Promise<{ search?: string; location?: string }>;
}) {
	const params = await searchParams;
	return (
		<div className="min-h-screen bg-[#f8fbff]">
			<Navbar />
			<div className="container mx-auto px-4 pt-24 pb-12">
				<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-2">
					<h1 className="font-bold text-3xl tracking-tight">Search Results</h1>
					<p className="text-muted-foreground">
						Showing events matching your criteria
					</p>
				</div>

				<Card className="p-4">
					<CardContent className="p-0">
						<div className="flex flex-wrap items-center gap-8">
							<div className="flex items-center gap-2">
								<Search className="h-5 w-5 text-muted-foreground" />
								<span className="font-semibold">Search:</span>
								<Badge variant="secondary" className="px-3 py-1">
									{params.search || "All Events"}
								</Badge>
							</div>

							<div className="flex items-center gap-2 md:border-l md:pl-8">
								<MapPin className="h-5 w-5 text-muted-foreground" />
								<span className="font-semibold">Location:</span>
								<Badge variant="secondary" className="px-3 py-1">
									{params.location || "Anywhere"}
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				<AllEventsList searchParams={await searchParams} />
				</div>
			</div>
		</div>
	);
}
