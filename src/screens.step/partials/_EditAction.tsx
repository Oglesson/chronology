import { UniqueIdentifier } from "@dnd-kit/core";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../../components/modal/Modal";
import { useToggle } from "../../hooks.common/useToggle";
import { StepHandActionData } from "../../hooks.queries/useStep";
import { ItemsContext } from "./_ActionItemsContext";
import { AddAction } from "./_AddAction";
import { AddTitle } from "./_AddTitle";
import { ActionColSectionData } from "./_Modal";

type EditModalProps = {
	data: StepHandActionData | undefined;
	itemId: UniqueIdentifier;
	type: string;
};

export const EditAction = ({ itemId, data, type }: EditModalProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	const { setItems, setCanSave } = useContext(ItemsContext);

	const settingItemsToAdd = (sectionData: ActionColSectionData) => {
		setItems((currentItems) => {
			const column = itemId?.toString().includes("left")
				? "left"
				: "right";

			const item = currentItems[column].find(
				(i) => i.draggableId === itemId
			);

			if (item) {
				const index = currentItems[column].indexOf(item);

				currentItems[column][index] = {
					...currentItems[column][index],
					id: `${column}-${sectionData.ActionID}-${index}`,
					draggableId: `draggable-${column}-${sectionData.ActionID}-${index}`,
					droppableId: `droppable-${column}-${sectionData.ActionID}-${index}`,
					Time_Minutes: null,
					Time_Seconds: null,
					...sectionData,
				};
			}

			return {
				...currentItems,
			};
		});

		setOpenModal();
		setCanSave(true);
	};

	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{type === "title" ? t("editTitle") : t("editAction")}
			</button>
			<Modal isOpen={openModal}>
				{type === "title" ? (
					<AddTitle
						handleModalClose={() => setOpenModal()}
						data={data}
						settingItemsToAdd={settingItemsToAdd}
						content={{
							titleActionID: t("editTitle"),
							button: t("edit"),
						}}
					/>
				) : (
					<AddAction
						handleModalClose={() => setOpenModal()}
						data={data}
						settingItemsToAdd={settingItemsToAdd}
						content={{
							titleActionID: t("editAction"),
							button: t("edit"),
						}}
					/>
				)}
			</Modal>
		</>
	);
};
