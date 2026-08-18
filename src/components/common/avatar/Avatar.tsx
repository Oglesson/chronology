import Icons from "../../../config.common/Icons";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import "./avatar.scss";

interface AvatarProps {
	altText?: string;
	size?: "xl" | "lg" | "md" | "sm" | "xs";
	src?: string;
}

export const Avatar = ({ altText, src, size, ...props }: AvatarProps) => {
	return (
		<div
			className={`avatar avatar--${size ?? "lg"}${
				src ? "" : " avatar--no-src"
			}`}
			{...props}
		>
			{src ? (
				<img
					src={src}
					alt={altText}
					className="object-cover w-full h-full block"
				/>
			) : (
				<RenderIcon
					icon={Icons.Interface.Media}
					classes="max-w-[45%] max-h-[45%] text-[#787878]"
				/>
			)}
		</div>
	);
};
