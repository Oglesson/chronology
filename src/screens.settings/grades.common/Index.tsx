import { useTranslation } from "react-i18next";
import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import { Details } from "./partials/_Details";
import { Tooltip } from "../../components/common/tooltip/Tooltip";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import Icons from "../../config.common/Icons";

export const Grades = () => {
	const { t } = useTranslation();

	return (
		<AwaitLoaderData>
			<div className="flex items-baseline mb-8">
				<Tooltip content={t("tooltipSystemGrades")}>
					<RenderIcon icon={Icons.Interface.Info} />
				</Tooltip>
			</div>
			<Details />
		</AwaitLoaderData>
	);
};
