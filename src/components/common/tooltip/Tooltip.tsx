import { Popper, PopperPlacementType } from "@mui/base";
import {
	DetailedHTMLProps,
	DetailsHTMLAttributes,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import useClickOutside from "../../../hooks.common/useClickOutside";
import "./tooltip.scss";

type TooltipThemeProps = "default" | "error" | "success" | "warning" | "none";

type TooltipProps = DetailedHTMLProps<
	DetailsHTMLAttributes<HTMLDetailsElement>,
	HTMLDetailsElement
> & {
	content: ReactNode;
	placement?: PopperPlacementType;
	popupClassName?: string;
	strategy?: "click" | "hover";
	theme?: TooltipThemeProps;
};

export const Tooltip = ({
	className,
	children,
	content,
	open,
	placement,
	popupClassName,
	strategy = "click",
	theme,
	...props
}: TooltipProps) => {
	const tooltipRef = useRef<HTMLDetailsElement>(null);
	const [prevOpenProp, setPrevOpenProp] = useState(open);
	const [isOpen, setIsOpen] = useState(!!open);
	const [refAvailable, setRefAvailable] = useState(false);

	if (prevOpenProp !== open) {
		setPrevOpenProp(open);
		setIsOpen(!!open);
	}

	const renderStyle = (theme?: TooltipThemeProps) => {
		switch (theme) {
			case "success":
				return "bg-green text-black";
			case "warning":
				return "bg-in-progress text-black";
			case "error":
				return "bg-decline text-white";
			case "none":
				return "";
			default:
				return "bg-grey-mid text-white";
		}
	};

	useClickOutside(tooltipRef, () => {
		if (isOpen && !open) {
			setIsOpen(false);
		}
	});

	useEffect(() => {
		if (tooltipRef.current) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setRefAvailable(true);
		}
	}, []);

	if (!content) {
		return <></>;
	}

	return (
		<details
			ref={tooltipRef}
			className={`tooltip ${className ?? ""}`}
			onToggle={(event) => {
				if (strategy === "click") {
					setIsOpen(tooltipRef.current?.open ?? false);
					props.onToggle?.(event);
				}
			}}
			onPointerDown={(event) => {
				if (strategy === "click") {
					event.stopPropagation();
				}
			}}
			onMouseEnter={() => {
				if (strategy === "hover" && !isOpen) {
					setIsOpen(true);
				}
			}}
			onMouseLeave={() => {
				if (strategy === "hover" && isOpen) {
					setIsOpen(false);
				}
			}}
			open={isOpen}
			{...props}
		>
			<summary className="tooltip__button">{children}</summary>
			{refAvailable && (
				<Popper
					anchorEl={() => tooltipRef.current!}
					disablePortal={true}
					keepMounted={true}
					open={isOpen}
					placement={placement ?? "top"}
					popperOptions={{
						strategy: "absolute",
					}}
				>
					<div
						className={`tooltip__content ${renderStyle(theme)} ${
							popupClassName ?? ""
						}`}
					>
						{content}
					</div>
				</Popper>
			)}
		</details>
	);
};
