import { useEffect, useRef } from "react";

type Props = {
	onPageChange: VoidFunction;
	hasMore: boolean;
	isFetchingData: boolean;
	dependencyKeys?: unknown[];
};
export const useInfiniteScroll = ({
	onPageChange,
	hasMore,
	isFetchingData,
	dependencyKeys = [],
}: Props) => {
	const observerRef = useRef<IntersectionObserver | null>(null);
	const loaderRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!loaderRef.current) return;
		observerRef.current = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !isFetchingData) {
					onPageChange();
				}
			},
			{ root: null, rootMargin: "0px", threshold: 0.5 },
		);

		observerRef.current.observe(loaderRef.current);

		return () => {
			observerRef.current?.disconnect();
		};
	}, [...dependencyKeys, hasMore, isFetchingData, onPageChange]);

	return { loaderRef };
};
