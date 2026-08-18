import { Dispatch, SetStateAction, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ItemActionsMenu } from "../../../components/ItemActionsMenu/ItemActionsMenu";
import Icons from "../../../config.common/Icons";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";
import { DefinitionContext } from "../../definition.index/partials/_DefinitionContext";

type PathTypeActionsProps = {
	pathTypeIndex: number;
	activePathType: number | undefined;
	setActivePathType: Dispatch<SetStateAction<number | undefined>>;
};

export const PathTypeActions = ({
	pathTypeIndex,
	activePathType,
	setActivePathType,
	...props
}: PathTypeActionsProps) => {
	const {
		setPathTypeActionIndex,
		setOpenEditPathTypeModal,
		setOpenRemovePathTypeModal,
	} = useContext(DefinitionContext);
	const definition = useProcessDefinition();
	const { t } = useTranslation();

	const handleEditClick = () => {
		setPathTypeActionIndex(pathTypeIndex);
		setOpenEditPathTypeModal();
	};

	const handleRemoveClick = () => {
		setPathTypeActionIndex(pathTypeIndex);
		setOpenRemovePathTypeModal();
	};

	return (
		<ItemActionsMenu
			actions={[
				{
					step: (
						<button
							type="button"
							onClick={handleEditClick}
							disabled={definition.IsInUseByOp}
						>
							{t("editPathType")}
							{definition.IsInUseByOp && <> ({t("inUse")})</>}
						</button>
					),
				},
				{
					step: (
						<button
							type="button"
							onClick={handleRemoveClick}
							disabled={definition.IsInUseByOp}
						>
							{t("removePathType")}
							{definition.IsInUseByOp && <> ({t("inUse")})</>}
						</button>
					),
				},
			]}
			buttonIcon={Icons.Interface.MoreHorizontal}
			buttonLabel={t("moreActions")}
			className={`ml-auto ${
				activePathType === pathTypeIndex
					? "opacity-100"
					: "opacity-0 group-hover:opacity-100"
			}`}
			toggle={(isOpen) => {
				if (isOpen) {
					setActivePathType(pathTypeIndex);
				} else if (pathTypeIndex === activePathType) {
					setActivePathType(undefined);
				}
			}}
			{...props}
		/>
	);
};
