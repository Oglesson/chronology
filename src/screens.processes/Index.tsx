import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AwaitLoaderData } from "../components/common/loader/AwaitLoaderData";
import { usePermissionsContext } from "../hooks.common/usePermissionsContext";
import { Create } from "./partials/_Create";
import { Listing } from "./partials/_Listing";
import { ProcessesContext } from "./partials/_ProcessesContext";
import { RenderIcon } from "../utilities.common/RenderIcon";
import Icons from "../config.common/Icons";
import { GenericModal } from "../components/modal/GenericModal";

export const Processes = () => {
	const { t } = useTranslation();
	const { openModalContent, setOpenModalContent, openModalSettings } =
		useContext(ProcessesContext);
	const { permissions } = usePermissionsContext();

	return (
		<AwaitLoaderData>
			<Listing />
			{(permissions?.edit || permissions?.edit || permissions?.edit) && (
				<button
					type="button"
					className="interaction:bg-white button button--primary button--circle mt-6"
					onClick={() => setOpenModalContent(<Create />)}
				>
					<span className="sr-only">{t("create")}</span>
					<RenderIcon
						icon={Icons.Edit.PlusSmall}
						sizes="w-3.5 h-3.5"
					/>
				</button>
			)}
			<GenericModal
				customContent={openModalContent}
				isOpen={openModalContent ? true : false}
				{...openModalSettings}
			/>
		</AwaitLoaderData>
	);
};
