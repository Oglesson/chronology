import { Link } from "react-router-dom";
import Icons from "../config.common/Icons";
import { useTheme } from "../context.common/ThemeContext";

export const UnauthorizedNavigation = ({ ...props }) => {
	const [theme] = useTheme();

	return (
		<header className="fixed top-0 left-0 py-6.5 pl-6.5 z-10" {...props}>
			<Link to="/">
				<img
					src={
						theme.useDarkTheme
							? Icons.Logo.ChronologyWhite.path
							: Icons.Logo.ChronologyBlack.path
					}
					className="h-[50px]"
					alt="Chronology logo"
				/>
			</Link>
		</header>
	);
};
