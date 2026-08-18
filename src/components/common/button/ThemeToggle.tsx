import Icons from "../../../config.common/Icons";
import { useTheme } from "../../../context.common/ThemeContext";
import { RenderIcon } from "../../../utilities.common/RenderIcon";

export const ThemeToggle = ({ ...props }) => {
	const [theme, dispatch] = useTheme();

	return (
		<button type="button" onClick={dispatch} {...props}>
			<span className="sr-only">
				Activate {theme.useDarkTheme ? "light" : "dark"} mode
			</span>
			<div className="flex items-center">
				<RenderIcon
					icon={Icons.Menu.LightMode}
					classes={theme.useDarkTheme ? "text-grey-light" : ""}
				/>
				<RenderIcon
					icon={Icons.Menu.DarkMode}
					classes={`ml-4.5 ${
						theme.useDarkTheme ? "" : " text-grey-light"
					}`}
				/>
			</div>
		</button>
	);
};
