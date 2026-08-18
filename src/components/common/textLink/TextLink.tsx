import { Link } from "react-router-dom";

type TextLinkProps = {
	text: string;
	to: string;
};

export const TextLink = ({ text, to, ...props }: TextLinkProps) => {
	return (
		<Link
			to={to}
			className="hover:underline focus:underline underline-offset-4"
			{...props}
		>
			{text}
		</Link>
	);
};
