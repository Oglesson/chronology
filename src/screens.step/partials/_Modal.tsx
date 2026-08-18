import { UniqueIdentifier } from "@dnd-kit/core";
import { useContext, Dispatch, SetStateAction } from "react";
import { ActionData } from "../../api.common/types";
import Icons from "../../config.common/Icons";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import { AddAction } from "./_AddAction";
import { AddTitle } from "./_AddTitle";
import { useTranslation } from "react-i18next";
import { ItemsContext } from "./_ActionItemsContext";

type AddButtonProps = {
	action?: () => void;
	classNames?: string;
	label?: string;
};

export type ActionColSectionData = {
	Comment: string;
	Quantity: number;
	ActionID: number | undefined;
	Action: null | ActionData;
};

export const AddButton = ({
	action,
	classNames,
	label,
	...props
}: AddButtonProps) => {
	return (
		<button
			className={`flex items-center justify-center h-[66px] rounded-md ease-hover duration-100 ${
				classNames ?? ""
			}`}
			type="button"
			onClick={() => {
				action?.();
			}}
			{...props}
		>
			<RenderIcon icon={Icons.Edit.Plus} classes="mr-3" />
			{label ? label : `Add something`}
		</button>
	);
};

type AddModalProps = {
	emptyId: UniqueIdentifier | undefined;
	type: string | null;
	setAddFormType: Dispatch<SetStateAction<string | null>>;
};

export const AddModal = ({ emptyId, type, setAddFormType }: AddModalProps) => {
	const { t } = useTranslation();

	const { setItems, setIsModalOpen, isModalOpen, setCanSave } =
		useContext(ItemsContext);

	const handleModalClose = () => {
		setIsModalOpen(false);
		setAddFormType(null);
	};

	const settingItemsToAdd = (sectionData: ActionColSectionData) => {
		setItems((currentItems) => {
			const column = emptyId?.toString().includes("left")
				? "left"
				: "right";

			const emptyCell = currentItems[column].find(
				(i) => i.droppableId === emptyId
			);

			if (emptyCell) {
				const index = currentItems[column].indexOf(emptyCell);

				currentItems[column][index] = {
					...currentItems[column][index],
					id: currentItems[column][index].id
						.toString()
						.replace("empty", sectionData.ActionID?.toString() ?? ""),
					draggableId: currentItems[column][index].draggableId
						.toString()
						.replace("empty", sectionData.ActionID?.toString() ?? ""),
					droppableId: currentItems[column][index].droppableId
						.toString()
						.replace("empty", sectionData.ActionID?.toString() ?? ""),
					hand: column,
					...sectionData,
				};

				return {
					...currentItems,
				};
			}

			const oppositeColumn = column === "left" ? "right" : "left";

			const random = Math.random();

			currentItems[column].push({
				id: `${column}-${sectionData.ActionID}-${currentItems[column].length}`,
				draggableId: `draggable-${column}-${sectionData.ActionID}-${currentItems[column].length}`,
				droppableId: `droppable-${column}-${sectionData.ActionID}-${currentItems[column].length}`,
				isCounted: true,
				...sectionData,
			});

			currentItems[column].push({
				id: `${column}-collapsed-${currentItems[column].length}-${random}`,
				draggableId: `draggable-${column}-collapsed-${currentItems[column].length}-${random}`,
				droppableId: `droppable-${column}-collapsed-${currentItems[column].length}-${random}`,
				isCounted: true,
			});

			currentItems[oppositeColumn].push({
				id: `${oppositeColumn}-empty-${currentItems[oppositeColumn].length}`,
				draggableId: `draggable-${oppositeColumn}-empty-${currentItems[oppositeColumn].length}`,
				droppableId: `droppable-${oppositeColumn}-empty-${currentItems[oppositeColumn].length}`,
				Comment: null,
				Quantity: null,
				ActionID: null,
				Action: null,
				isCounted: true,
			});

			currentItems[oppositeColumn].push({
				id: `${oppositeColumn}-collapsed-${currentItems[oppositeColumn].length}-${random}`,
				draggableId: `draggable-${oppositeColumn}-collapsed-${currentItems[oppositeColumn].length}-${random}`,
				droppableId: `droppable-${oppositeColumn}-collapsed-${currentItems[oppositeColumn].length}-${random}`,
				isCounted: true,
			});

			currentItems["link"].push({
				collapsed: false,
				ID: random + currentItems["link"].length,
				Seq: 0,
				SimoLinkPrev: false,
			});

			currentItems["link"].push({
				collapsed: true,
				ID: random + currentItems["link"].length,
				Seq: 0,
				SimoLinkPrev: false,
			});

			return {
				...currentItems,
			};
		});

		setCanSave(true);
		handleModalClose();
	};

	return (
		<>
			{type === "title" ? (
				<AddTitle
					isOpen={isModalOpen}
					settingItemsToAdd={settingItemsToAdd}
					handleModalClose={handleModalClose}
					content={{
						titleActionID: t("addATitle"),
						button: t("createTitle"),
					}}
				/>
			) : (
				<AddAction
					isOpen={isModalOpen}
					settingItemsToAdd={settingItemsToAdd}
					handleModalClose={handleModalClose}
					content={{
						titleActionID: t("addAAction"),
						button: t("createAction"),
					}}
				/>
			)}
		</>
	);
};
