import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import Icons from "../../../config.common/Icons";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";
import { DesignsContext } from "../../designs.index/partials/_DesignsContext";
import { Create } from "./_Create";

type CreateButtonProps = {
	txtStyle?: boolean;
};

export const CreateButton = ({ txtStyle }: CreateButtonProps) => {
	const { setOpenModalContent } = useContext(DesignsContext);
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();
	const canEdit = permissions?.edit || permissions?.admin;

	return (
		<Button
			text={t("createProcessSet", {
				defaultValue: "Create Process Set",
			})}
			onClick={() => setOpenModalContent(<Create />)}
			iconOnly={!txtStyle}
			icon={Icons.Edit.PlusSmall}
			txtOnly={txtStyle}
			disabled={!canEdit}
		/>
	);
};
