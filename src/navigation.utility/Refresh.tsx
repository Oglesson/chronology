import { useNavigate } from "react-router-dom";
import { RenderIcon } from "../utilities.common/RenderIcon";
import Icons from "../config.common/Icons";
import { Tooltip } from "../components/common/tooltip/Tooltip";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { NavigationContext } from "../context.common/NavigationContext";

export const Refresh = () => {
	const navigate = useNavigate();
	const { isLoading } = useContext(NavigationContext);
	const { t } = useTranslation();

	return (
		<Tooltip
			content={t("tooltipRefreshDescription")}
			className={"!z-100 pointer-events-auto"}
			strategy="hover"
		>
			<button
				className="flex items-center disabled:opacity-50"
				disabled={isLoading}
				type="button"
				onClick={() => {
					navigate("refresh");
				}}
			>
				<RenderIcon
					classes="text-black dark:text-white"
					icon={Icons.Interface.ArrowRefresh}
				/>
				<span className="sr-only">Refresh</span>
			</button>
		</Tooltip>
	);
};
