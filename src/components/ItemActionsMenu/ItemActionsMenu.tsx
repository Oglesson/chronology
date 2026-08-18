import { Popper } from "@mui/base";
import {
	DetailedHTMLProps,
	DetailsHTMLAttributes,
	ReactNode,
	useRef,
	useState,
} from "react";
import { Link } from "react-router-dom";
import Icons, { Icon } from "../../config.common/Icons";
import useClickOutside from "../../hooks.common/useClickOutside";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import { ResultOrSelf } from "../../utilities.common/ResultOrSelf";
import { toLinkUrl } from "../../utilities.common/StringUtilities";
import "./itemActionsMenu.scss";

export type ActionProps = {
	step?: ReactNode | ((data: unknown) => ReactNode | null);
	label?: string;
	method?: (data: unknown) => void;
	url?: string;
};

type ItemActionsMenuProps<T> = DetailedHTMLProps<
	DetailsHTMLAttributes<HTMLDetailsElement>,
	HTMLDetailsElement
> & {
	actions: ActionProps[];
	buttonClasses?: string;
	buttonIcon?: Icon;
	buttonLabel: string;
	data?: T;
	interactionIntent?: () => void | (() => Promise<void>);
	style?: "default" | "select";
	toggle?: (isOpen: boolean) => void;
};

export const ItemActionsMenu = <T,>({
	actions,
	buttonClasses,
	buttonIcon,
	buttonLabel,
	className,
	data,
	interactionIntent,
	open,
	style,
	toggle,
	...props
}: ItemActionsMenuProps<T>) => {
	const itemActionsMenuRef = useRef<HTMLDetailsElement>(null);
	const itemActionsMenuArray: ReactNode[] = [];
	const [prevOpenProp, setPrevOpenProp] = useState(open);
	const [isOpen, setIsOpen] = useState(!!open);

	if (prevOpenProp !== open) {
		setPrevOpenProp(open);
		setIsOpen(!!open);
	}

	useClickOutside(itemActionsMenuRef, () => {
		if (isOpen) {
			setIsOpen(false);
		}
	});

	const handleClick = () => {
		setIsOpen(false);
	};

	actions.forEach(({ step, label, method, url }, index) => {
		let action;

		if (step) {
			action = ResultOrSelf(step, data);
		} else if (method) {
			action = (
				<button
					onClick={
						method
							? () => {
									method(data);
									if (itemActionsMenuRef.current) {
										itemActionsMenuRef.current.open = false;
									}
								}
							: undefined
					}
					type="button"
				>
					{label}
				</button>
			);
		} else if (url) {
			action = <Link to={toLinkUrl(url, data)}>{label}</Link>;
		}

		if (!action) {
			return;
		}

		itemActionsMenuArray.push(
			action && (
				<li
					key={label ?? index}
					className="item-actions-menu__item"
					onClick={() => !url && handleClick()}
				>
					{action}
				</li>
			),
		);
	});

	if (!itemActionsMenuArray.length) {
		return <></>;
	}

	return (
		<details
			ref={itemActionsMenuRef}
			className={`item-actions-menu ${className ?? ""}`}
			onToggle={(event) => {
				if (itemActionsMenuRef.current) {
					setIsOpen(itemActionsMenuRef.current.open);
					toggle?.(itemActionsMenuRef.current.open);
				}
				props.onToggle?.(event);
			}}
			onMouseEnter={async () => {
				if (interactionIntent) {
					await interactionIntent();
				}
			}}
			open={isOpen}
			{...props}
		>
			<summary className={`item-actions-menu__summary`}>
				<div
					className={`item-actions-menu__button item-actions-menu__button--${
						style ?? "default"
					} ${buttonClasses ?? ""}`}
				>
					<RenderIcon
						icon={buttonIcon ?? Icons.Interface.MoreVertical}
					/>
					<span
						className={`item-actions-menu__label item-actions-menu__label--${
							style ?? "default"
						}`}
					>
						{buttonLabel}
					</span>
				</div>
			</summary>
			<Popper
				anchorEl={() => itemActionsMenuRef.current!}
				disablePortal={true}
				keepMounted={true}
				open={isOpen}
				placement="bottom-end"
				slotProps={{
					root: {
						className: "item-actions-menu__popper",
					},
				}}
			>
				<ul
					className={`item-actions-menu__menu item-actions-menu__menu--${
						style ?? "default"
					}`}
				>
					{actions && itemActionsMenuArray}
				</ul>
			</Popper>
		</details>
	);
};
