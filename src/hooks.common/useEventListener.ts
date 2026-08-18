import { useEffect, useRef } from "react";

export default function useEventListener(
	eventType: keyof ElementEventMap | string,
	callback: (e: Event) => void,
	step: Document | HTMLElement | Window = window
) {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		if (!step) {
			return;
		}

		const handler = (e: Event) => callbackRef.current(e);

		step.addEventListener(eventType, handler);

		return () => step.removeEventListener(eventType, handler);
	}, [eventType, step]);
}
