import {
	DetailedHTMLProps,
	DetailsHTMLAttributes,
	useRef,
	useState,
} from "react";
import useEventListener from "../../hooks.common/useEventListener";

type ScrollDragProps = DetailedHTMLProps<
	DetailsHTMLAttributes<HTMLDivElement>,
	HTMLDivElement
> & {
	showScrollbar?: boolean;
	windowHorizontal?: boolean;
	windowVertical?: boolean;
};

export const ScrollDrag = ({
	className,
	showScrollbar,
	windowHorizontal,
	windowVertical,
	...props
}: ScrollDragProps) => {
	const [startPosition, setStartPosition] = useState<
		{ x: number; y: number } | undefined
	>();
	const containerRef = useRef<HTMLDivElement>(null);

	const getScrollPosition = () => {
		const container = containerRef?.current as HTMLElement;
		return {
			x: windowHorizontal ? window.scrollX : container.scrollLeft,
			y: windowVertical ? window.scrollY : container.scrollTop,
		};
	};

	useEventListener(
		"mousemove",
		(event) => {
			if (startPosition) {
				const container = containerRef?.current as HTMLElement;
				const clientX = (event as MouseEvent).clientX;
				const clientY = (event as MouseEvent).clientY;
				const x = startPosition.x - clientX;
				const y = startPosition.y - clientY;

				(windowHorizontal ? window : container).scrollTo({
					left: x,
				});
				(windowVertical ? window : container).scrollTo({
					top: y,
				});

				setStartPosition((oldPosition) => {
					const scrollPostion = getScrollPosition();
					return oldPosition
						? {
								x:
									x !== scrollPostion.x
										? clientX + scrollPostion.x
										: oldPosition.x,
								y:
									y !== scrollPostion.y
										? clientY + scrollPostion.y
										: oldPosition.y,
						  }
						: oldPosition;
				});
			}
		},
		document
	);

	useEventListener(
		"mouseup",
		(event) => {
			if (!startPosition || (event as MouseEvent).button !== 1) {
				return;
			}
			setStartPosition(undefined);
		},
		document
	);

	return (
		<div
			ref={containerRef}
			className={`overflow-auto ${
				showScrollbar ? "" : "scrollbar-hide"
			} ${
				startPosition ? "cursor-grabbing [&>*]:pointer-events-none" : ""
			} ${className ?? ""}`}
			onMouseDown={(event) => {
				if (event.button === 1) {
					event.preventDefault();
					const scrollPostion = getScrollPosition();
					setStartPosition({
						x: event.clientX + scrollPostion.x,
						y: event.clientY + scrollPostion.y,
					});
				}
			}}
			{...props}
		></div>
	);
};
