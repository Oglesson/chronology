import { Icon } from "../config.common/Icons";

interface RenderIconProps {
	icon: Icon;
	classes?: string;
	sizes?: string;
}

// Renders an SVG sprite icon by deriving the symbol ID from the icon's file path
export const RenderIcon = ({
	icon,
	classes,
	sizes,
	...props
}: RenderIconProps) => {
	const iconPath = icon.path;

	return (
		<svg
			fill="currentColor"
			className={`${sizes ?? "w-6 h-6"} ${classes ?? ""}`}
			{...props}
		>
			<use
				href={`${iconPath}#${
					iconPath.split("/").pop()?.split(".svg")[0]
				}`}
			></use>
		</svg>
	);
};
