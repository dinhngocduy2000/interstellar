import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTE_PATH } from "../enum/route-path";

export const useKeyboardShortcut = () => {
	const router = useRouter();

	useEffect(() => {
		const isMac = /Mac|iPhone|iPod|iPad/i.test(navigator.platform);

		const handleKeyDown = (event: KeyboardEvent) => {
			const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;
			// Listen for Ctrl + K
			if (cmdOrCtrl && event.key.toLowerCase() === "k") {
				event.preventDefault(); // Prevent default browser behavior
				router.push(`${ROUTE_PATH.HISTORY}?search=`);
			}

			if (cmdOrCtrl && event.shiftKey && event.key.toLowerCase() === "j") {
				event.preventDefault(); // Prevent default browser behavior
				router.push(`${ROUTE_PATH.HOME}?private=true`);
			}

			// Listen for Ctrl + J
			if (cmdOrCtrl && !event.shiftKey && event.key.toLowerCase() === "j") {
				event.preventDefault(); // Prevent default browser behavior
				router.push(`${ROUTE_PATH.HOME}`);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);
};
