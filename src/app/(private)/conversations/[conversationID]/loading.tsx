import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="mt-6 h-full w-full flex flex-col gap-4 md:max-w-4xl max-w-full mx-auto">
			{Array.from({ length: 8 }).map((_, index) => (
				<Skeleton key={index} className="h-8 w-full" />
			))}
		</div>
	);
}
