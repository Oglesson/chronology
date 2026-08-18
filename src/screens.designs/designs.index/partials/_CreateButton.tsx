import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import Icons from "../../../config.common/Icons";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";
import { Create } from "./_Create";
import { DesignsContext } from "./_DesignsContext";

type CreateProps = {
	txtStyle?: boolean;
	openAction?: () => void;
};

export const CreateButton = ({ txtStyle, openAction }: CreateProps) => {
	const { t } = useTranslation();
	const { setOpenModalContent } = useContext(DesignsContext);
	const { permissions } = usePermissionsContext();
	const canEdit = permissions?.edit || permissions?.admin;

	return (
		<Button
			text={t("createADesign", {
				defaultValue: "Create a Style",
			})}
			onClick={
				openAction
					? () => openAction()
					: () => {
							setOpenModalContent(
								<Create
									closeAction={() =>
										setOpenModalContent(null)
									}
								/>
							);
					  }
			}
			iconOnly={!txtStyle}
			icon={Icons.Edit.PlusSmall}
			txtOnly={txtStyle}
			disabled={!canEdit}
		/>
	);
};
