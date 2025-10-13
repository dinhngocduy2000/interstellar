import { useEffect, useRef } from "react";

type Props = {
	func: () => void;
	searchText: string;
};
export const useDebounce = ({ func, searchText }: Props) => {
	const isMounted = useRef<boolean>(false);
	useEffect(() => {
		let timeout: NodeJS.Timeout;
		if (isMounted.current) {
			timeout = setTimeout(() => func(), 500);
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [searchText]);

	return { isMounted };
};
