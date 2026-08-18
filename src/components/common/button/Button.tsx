import { InputHTMLAttributes } from "react";
import classNames from "classnames";
import { Icon } from "../../../config.common/Icons";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import "./button.scss";

type ButtonProps = InputHTMLAttributes<HTMLButtonElement> & {
	disabled?: boolean;
	icon?: Icon;
	iconOnly?: boolean;
	txtOnly?: boolean;
	onClick?: () => void | Promise<void>;
	style?: "primary" | "secondary" | "tertiary";
	text: string;
	theme?: "default" | "decline" | "solid";
	type?: "button" | "submit";
	className?: string | undefined;
};

export const Button = ({
	icon,
	iconOnly = false,
	style,
	text,
	theme,
	type,
	className,
	txtOnly = false,
	...props
}: ButtonProps) => {
	return (
		<button
			type={type ?? "button"}
			className={classNames(
				`interaction:bg-white button button--${
					style ?? "primary"
				} button--${
					theme ?? "default"
				} disabled:opacity-30 disabled:pointer-events-none`,
				className ?? "",
				icon && !txtOnly && !iconOnly && "button--has-icon",
				iconOnly && "button--circle  mt-6"
			)}
			{...props}
		>
			{icon && !txtOnly && (
				<RenderIcon
					icon={icon}
					classes={classNames("button__icon", iconOnly && "!mr-0")}
					sizes="w-3.5 h-3.5"
				/>
			)}
			<span className={classNames(iconOnly && "sr-only")}>{text}</span>
		</button>
	);
};
