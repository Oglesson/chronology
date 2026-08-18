import { useTranslation } from "react-i18next";
import { useToggle } from "../hooks.common/useToggle";
import { Create, CreatePlus } from "./partials/_Create";
import { Tooltip } from "../components/common/tooltip/Tooltip";
import { RenderIcon } from "../utilities.common/RenderIcon";
import Icons from "../config.common/Icons";
import { usePermissionsContext } from "../hooks.common/usePermissionsContext";
import { AwaitLoaderData } from "../components/common/loader/AwaitLoaderData";
import { Listing } from "./partials/_Listing";
import { ModalContext } from "./partials/_ModalContext";

export const Steps = () => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	return (
		<AwaitLoaderData>
			<ModalContext.Provider value={{ openModal, setOpenModal }}>
				<div className="flex justify-between items-baseline mb-16">
					<div className="flex items-baseline">
						<h1 className="typo-large mr-5">Steps</h1>
						<Tooltip content={t("tooltipSteps")}>
							<RenderIcon icon={Icons.Interface.Info} />
						</Tooltip>
					</div>
					{(permissions?.edit || permissions?.admin) && <Create />}
				</div>
				<Listing />
				{(permissions?.edit || permissions?.admin) && <CreatePlus className="mt-6" />}
			</ModalContext.Provider>
		</AwaitLoaderData>
	);
};
