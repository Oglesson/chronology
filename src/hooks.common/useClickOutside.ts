import { RefObject } from "react";
import useEventListener from "./useEventListener";

export default function useClickOutside(
	ref: RefObject<Element | null>,
	cb: (e: Event) => void,
) {
	useEventListener(
		"click",
		(e) => {
			if (!ref.current || ref.current?.contains(e.target)) {
				return;
			}
			cb(e);
		},
		document,
	);
}
