import { useTranslation } from "react-i18next";
import { AwaitLoaderData } from "../components/common/loader/AwaitLoaderData";
import { Create, CreatePlus } from "./partials/_Create";
import { Listing } from "./partials/_Listing";
import { ActionsContextProvider } from "./partials/_ActionsContext";
import { Tooltip } from "../components/common/tooltip/Tooltip";
import { RenderIcon } from "../utilities.common/RenderIcon";
import Icons from "../config.common/Icons";
import { usePermissionsContext } from "../hooks.common/usePermissionsContext";

export const Actions = () => {
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	return (
		<AwaitLoaderData>
			<ActionsContextProvider>
				<div className="flex justify-between items-baseline mb-16">
					<div className="flex items-baseline">
						<h1 className="typo-large mr-5">Actions</h1>
						<Tooltip content={t("tooltipActions")}>
							<RenderIcon icon={Icons.Interface.Info} />
						</Tooltip>
					</div>
					{(permissions?.edit || permissions?.admin) && <Create />}
				</div>
				<Listing />
				{(permissions?.edit || permissions?.admin) && <CreatePlus className="mt-6" />}
			</ActionsContextProvider>
		</AwaitLoaderData>
	);
};
