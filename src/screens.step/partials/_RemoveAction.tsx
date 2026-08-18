import { UniqueIdentifier } from "@dnd-kit/core";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/common/button/Button";
import { Modal } from "../../components/modal/Modal";
import { useToggle } from "../../hooks.common/useToggle";
import { StepHandActionData } from "../../hooks.queries/useStep";
import { ItemsContext } from "./_ActionItemsContext";

interface RemoveActionProps {
	data: StepHandActionData | undefined;
	itemId: UniqueIdentifier;
	type: string;
}

export const RemoveAction = ({ data, itemId, type }: RemoveActionProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();
	const { setItems, setCanSave } = useContext(ItemsContext);
	const action = data?.Action;
	if (!action && type === "action") {
		return null;
	}
	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{type === "title" ? t("removeTitle") : t("removeAction")}
			</button>
			<Modal isOpen={openModal}>
				<div className="max-w-[21rem]">
					<h3 className="typo-h3">
						{type === "title"
							? `${t("removeTitle")}?`
							: `${t("removeAction")} ${action.Code} ?`}
					</h3>
					<p className="mt-5">
						{type === "title"
							? t("removeTitleFromStepSummary")
							: t("removeActionFromStepSummary")}
					</p>
				</div>
				<div className="flex justify-end items-end mt-16">
					<Button
						style="secondary"
						text={t("cancel")}
						onClick={setOpenModal}
					/>
					<form
						className="ml-6"
						onSubmit={(e) => {
							e.preventDefault();
							setItems((currentItems) => {
								const column = itemId
									?.toString()
									.includes("left")
									? "left"
									: "right";

								const oppositeColumn =
									column === "left" ? "right" : "left";

								const index = currentItems[column].findIndex(
									(i) => i.draggableId === itemId,
								);

								const oppositeIsEmpty = currentItems[
									oppositeColumn
								][index].droppableId
									.toString()
									.includes("-empty-");

								if (oppositeIsEmpty) {
									currentItems[column].splice(index - 1, 2);
									currentItems[oppositeColumn].splice(
										index - 1,
										2,
									);
									currentItems["link"].splice(index - 1, 2);

									return {
										...currentItems,
									};
								}

								currentItems[column][index] = {
									id: `${column}-empty-${currentItems[column].length}`,
									draggableId: `draggable-${column}-empty-${currentItems[column].length}`,
									droppableId: `droppable-${column}-empty-${currentItems[column].length}`,
									Comment: null,
									Quantity: null,
									ActionID: null,
									Action: null,
									isCounted: true,
								};

								return {
									...currentItems,
								};
							});

							setOpenModal();
							setCanSave(true);
						}}
					>
						<Button
							text={t("remove")}
							theme="decline"
							type="submit"
						/>
					</form>
				</div>
			</Modal>
		</>
	);
};
