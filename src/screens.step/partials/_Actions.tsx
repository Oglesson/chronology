import {
	defaultDropAnimationSideEffects,
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	DropAnimation,
	pointerWithin,
	UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { BlockNavigation } from "../../components/modal/BlockNavigation";
import {
	StepHandActionData,
	StepLinkActionData,
} from "../../hooks.queries/useStep";
import { AddModal } from "./_Modal";
import { Column } from "./_Column";
import { Draggable } from "./_Draggable";
import { Links } from "./_Links";
import { Save } from "./_Save";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { ItemsContext } from "./_ActionItemsContext";
import { GenericModal } from "../../components/modal/GenericModal";

type ActionsProps = {
	linkActions: StepLinkActionData[];
	leftHandActions: StepHandActionData[];
	rightHandActions: StepHandActionData[];
};
export type Items = {
	link: StepLinkActionData[];
	left: StepHandActionData[];
	right: StepHandActionData[];
};
type ActiveItem = {
	activeContainer: UniqueIdentifier;
	activeId: UniqueIdentifier;
	activeIndex: number;
};
type OverItem = {
	overContainer: UniqueIdentifier;
	overId: UniqueIdentifier;
	overIndex: number;
};

export const Actions = ({
	linkActions,
	leftHandActions,
	rightHandActions,
	...props
}: ActionsProps) => {
	const { t } = useTranslation();

	const {
		items,
		setItems,
		isModalOpen,
		setIsModalOpen,
		canSave,
		setCanSave,
	} = useContext(ItemsContext);

	const constructInitialItems = (): Items => {
		const link = linkActions.reduce((list: StepLinkActionData[], item) => {
			const random = Math.random();
			list.push(item);
			list.push({
				collapsed: true,
				ID: random,
				Seq: 0,
				SimoLinkPrev: false,
			});
			return list;
		}, []);
		const left = leftHandActions
			.map((l) => l)
			.reduce((list: StepHandActionData[], item, i) => {
				const random = Math.random();
				list.push(item);
				list.push({
					id: `left-collapsed-${i}-${random}`,
					draggableId: `draggable-left-collapsed-${i}-${random}`,
					droppableId: `droppable-left-collapsed-${i}-${random}`,
					isCounted: true,
				});
				return list;
			}, []);
		const right = rightHandActions
			.map((l) => l)
			.reduce((list: StepHandActionData[], item, i) => {
				const random = Math.random();
				list.push(item);
				list.push({
					id: `right-collapsed-${i}-${random}`,
					draggableId: `draggable-right-collapsed-${i}-${random}`,
					droppableId: `droppable-right-collapsed-${i}-${random}`,
					isCounted: true,
				});
				return list;
			}, []);
		link.unshift({
			collapsed: true,
			ID: -1,
			Seq: 0,
			SimoLinkPrev: false,
		});
		left.unshift({
			id: "left-collapsed-first",
			draggableId: "draggable-left-collapsed-first",
			droppableId: "droppable-left-collapsed-first",
			isCounted: true,
		});
		right.unshift({
			id: "right-collapsed-first",
			draggableId: "draggable-right-collapsed-first",
			droppableId: "droppable-right-collapsed-first",
			isCounted: true,
		});
		return { link, left, right };
	};
	const [activeItem, setActiveItem] = useState<ActiveItem | null>(null);
	const [overItem, setOverItem] = useState<OverItem | null>(null);
	const [emptyId, setEmptyId] = useState<UniqueIdentifier>();
	const [addFormType, setAddFormType] = useState<string | null>(null);
	const { permissions } = usePermissionsContext();

	useEffect(() => {
		if (emptyId && !isModalOpen) {
			setEmptyId(undefined);
		}
	}, [emptyId, isModalOpen]);

	useEffect(() => {
		setItems(constructInitialItems());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [linkActions, leftHandActions, rightHandActions]);
	const findContainer = (id: UniqueIdentifier) => {
		if (id in items) {
			return id;
		}
		return Object.keys(items).find((item) => id.toString().includes(item));
	};
	const getItems = (items: Items, id: UniqueIdentifier) => {
		return items[id as keyof Items] as StepHandActionData[];
	};
	const isCollapsed = (id: UniqueIdentifier) =>
		id.toString().includes("-collapsed-");
	const isEmpty = (id: UniqueIdentifier) => id.toString().includes("-empty-");
	const handleDragStart = ({ active }: DragStartEvent) => {
		const activeId = active.id;
		const activeContainer = findContainer(activeId) as UniqueIdentifier;
		const activeIndex = getItems(items, activeContainer).findIndex(
			(i) => i.draggableId === activeId,
		);
		setActiveItem({
			activeContainer: activeContainer,
			activeId: activeId,
			activeIndex: activeIndex,
		});
	};
	const handleDragOver = ({ over }: DragEndEvent) => {
		if (!over) {
			setOverItem(null);
			return;
		}
		const overId = over.id;
		const overContainer = findContainer(overId) as UniqueIdentifier;
		const overIndex = getItems(items, overContainer).findIndex(
			(i) => i.droppableId === overId,
		);
		setOverItem({
			overContainer: overContainer,
			overId: overId,
			overIndex: overIndex,
		});
	};
	const handleDragEnd = () => {
		if (!activeItem || !overItem) {
			setActiveItem(null);
			setOverItem(null);
			return;
		}
		const { activeContainer, activeIndex } = activeItem;
		const { overContainer, overId, overIndex } = overItem;
		const activeIdentifier = `${activeContainer}-${activeIndex}`;
		const overIdentifier = `${overContainer}-${overIndex}`;
		if (activeIdentifier !== overIdentifier) {
			setItems((currentItems) => {
				const newId = `${overContainer}-${
					getItems(currentItems, activeContainer)[activeIndex]
						.ActionID
				}-${overIndex}`;
				const random = Math.random();
				const newDraggableId = `draggable-${overContainer}-${overIndex}-${random}`;
				const newDroppableId = `droppable-${overContainer}-${overIndex}-${random}`;
				const activeNullId = `${activeContainer}-empty-${activeIndex}-${random}`;
				const activeNullDraggableId = `draggable-${activeContainer}-empty-${activeIndex}-${random}`;
				const activeNullDroppableId = `droppable-${activeContainer}-empty-${activeIndex}-${random}`;
				getItems(currentItems, overContainer)[overIndex] = {
					...getItems(currentItems, activeContainer)[activeIndex],
					id: newId,
					draggableId: newDraggableId,
					droppableId: newDroppableId,
				};
				getItems(currentItems, activeContainer)[activeIndex] = {
					id: activeNullId,
					draggableId: activeNullDraggableId,
					droppableId: activeNullDroppableId,
					Comment: null,
					Action: null,
					ActionID: null,
					Quantity: null,
					Time_Minutes: null,
					Time_Seconds: null,
					isCounted: true,
				};
				// * Index modifier determined by the direction we have dragged and dropped
				const isTraversingDown = overIndex > activeIndex;
				const modifier = isTraversingDown ? 1 : 0;
				// * A draggable item has been dropped over a droppable item
				// * Both cells of its previous row are now empty and need removing
				if (
					isEmpty(overId) &&
					isEmpty(currentItems["left"][activeIndex]?.id) &&
					isEmpty(currentItems["right"][activeIndex]?.id)
				) {
					currentItems["link"].splice(activeIndex, 1);
					currentItems["left"].splice(activeIndex, 1);
					currentItems["right"].splice(activeIndex, 1);
					const itemInPlaceOfPrevious = getItems(
						currentItems,
						overContainer,
					)[activeIndex];
					const adjacent = getItems(currentItems, overContainer)[
						activeIndex - modifier
					];
					// * The item in its place is collapsable
					// * The item adjacent to it, determined by direction is also collapsable
					// * Delete the adjacent collapsable item
					if (
						adjacent &&
						isCollapsed(itemInPlaceOfPrevious.id) &&
						isCollapsed(adjacent.id)
					) {
						currentItems["link"].splice(activeIndex - modifier, 1);
						currentItems["left"].splice(activeIndex - modifier, 1);
						currentItems["right"].splice(activeIndex - modifier, 1);
					}
					return { ...currentItems };
				}
				const oppositeContainerId =
					overContainer === "left" ? "right" : "left";
				const adjacentItemIsEmpty = isEmpty(
					currentItems[
						activeContainer !== oppositeContainerId
							? oppositeContainerId
							: activeContainer === "left"
								? "right"
								: "left"
					][activeIndex].id,
				);
				// * A draggable item has been dropped over a collapsed item
				// * Its adjacent cell from its original position is empty
				// * The original row needs to be removed
				if (isCollapsed(overId) && adjacentItemIsEmpty) {
					currentItems["link"].splice(activeIndex, 1);
					currentItems["left"].splice(activeIndex, 1);
					currentItems["right"].splice(activeIndex, 1);
					const modifiedOverIndex = overIndex - modifier;
					currentItems["link"][modifiedOverIndex] = {
						...currentItems["link"][modifiedOverIndex],
						collapsed: false,
					};
					currentItems[oppositeContainerId][modifiedOverIndex] = {
						...currentItems[oppositeContainerId][modifiedOverIndex],
						id: currentItems[oppositeContainerId][
							modifiedOverIndex
						].id
							.toString()
							.replace("-collapsed-", "-empty-"),
						draggableId: currentItems[oppositeContainerId][
							modifiedOverIndex
						].id
							.toString()
							.replace("-collapsed-", "-empty-"),
						droppableId: currentItems[oppositeContainerId][
							modifiedOverIndex
						].id
							.toString()
							.replace("-collapsed-", "-empty-"),
					};
					if (
						!isCollapsed(
							currentItems["left"][modifiedOverIndex].id,
						) &&
						!isCollapsed(
							currentItems["right"][modifiedOverIndex].id,
						)
					) {
						const random = Math.random();
						currentItems["link"].splice(overIndex, 0, {
							collapsed: true,
							ID: random,
							Seq: 0,
							SimoLinkPrev: false,
						});
						currentItems["left"].splice(overIndex, 0, {
							id: `left-collapsed-${overIndex}-${random}`,
							draggableId: `draggable-left-collapsed-${overIndex}-${random}`,
							droppableId: `droppable-left-collapsed-${overIndex}-${random}`,
							isCounted: true,
						});
						currentItems["right"].splice(overIndex, 0, {
							id: `right-collapsed-${overIndex}-${random}`,
							draggableId: `draggable-right-collapsed-${overIndex}-${random}`,
							droppableId: `droppable-right-collapsed-${overIndex}-${random}`,
							isCounted: true,
						});
						const newActiveItem = getItems(
							currentItems,
							overContainer,
						)[activeIndex];
						const itemParallelToNewActive = getItems(
							currentItems,
							overContainer,
						)[activeIndex - modifier];
						if (
							itemParallelToNewActive &&
							isCollapsed(newActiveItem.id) &&
							isCollapsed(itemParallelToNewActive.id)
						) {
							currentItems["link"].splice(
								activeIndex - modifier,
								1,
							);
							currentItems["left"].splice(
								activeIndex - modifier,
								1,
							);
							currentItems["right"].splice(
								activeIndex - modifier,
								1,
							);
						}
						const anItem = getItems(currentItems, overContainer)[
							overIndex + (isTraversingDown ? 0 : 1)
						];
						const anotherItem = getItems(
							currentItems,
							oppositeContainerId,
						)[overIndex + (isTraversingDown ? 0 : 1)];
						// * An item has been dragged and dropped  downwards greater than 1 index away
						// * A new collapsed row needs to be inserted above/underneath
						if (
							Math.abs(overIndex - activeIndex) > 1 &&
							anItem &&
							anotherItem &&
							!isCollapsed(anItem.id) &&
							!isCollapsed(anotherItem.id)
						) {
							const random = Math.random();
							const index =
								overIndex + (isTraversingDown ? -2 : 2);
							currentItems["link"].splice(index, 0, {
								collapsed: true,
								ID: random,
								Seq: 0,
								SimoLinkPrev: false,
							});
							currentItems["left"].splice(index, 0, {
								id: `left-collapsed-${index}-${random}`,
								draggableId: `draggable-left-collapsed-${index}-${random}`,
								droppableId: `droppable-left-collapsed-${index}-${random}`,
								isCounted: true,
							});
							currentItems["right"].splice(index, 0, {
								id: `right-collapsed-${index}-${random}`,
								draggableId: `draggable-right-collapsed-${index}-${random}`,
								droppableId: `droppable-right-collapsed-${index}-${random}`,
								isCounted: true,
							});
						}
						if (
							Math.abs(overIndex - activeIndex) > 1 &&
							!anItem &&
							!anotherItem
						) {
							const random = Math.random();
							const index = overIndex - 2;
							currentItems["link"].splice(index, 0, {
								collapsed: true,
								ID: random,
								Seq: 0,
								SimoLinkPrev: false,
							});
							currentItems["left"].splice(index, 0, {
								id: `left-collapsed-${index}-${random}`,
								draggableId: `draggable-left-collapsed-${index}-${random}`,
								droppableId: `droppable-left-collapsed-${index}-${random}`,
								isCounted: true,
							});
							currentItems["right"].splice(index, 0, {
								id: `right-collapsed-${index}-${random}`,
								draggableId: `draggable-right-collapsed-${index}-${random}`,
								droppableId: `droppable-right-collapsed-${index}-${random}`,
								isCounted: true,
							});
						}
					}
				}
				// * A draggable item has been dropped over a collapsed item
				// * Its adjacent cell from its original position is not empty
				// * The original row needs to be retained
				if (isCollapsed(overId) && !adjacentItemIsEmpty) {
					currentItems["link"][overIndex] = {
						...currentItems["link"][overIndex],
						collapsed: false,
					};
					currentItems[oppositeContainerId][overIndex] = {
						...currentItems[oppositeContainerId][overIndex],
						id: currentItems[oppositeContainerId][overIndex].id
							.toString()
							.replace("-collapsed-", "-empty-"),
						draggableId: currentItems[oppositeContainerId][
							overIndex
						].id
							.toString()
							.replace("-collapsed-", "-empty-"),
						droppableId: currentItems[oppositeContainerId][
							overIndex
						].id
							.toString()
							.replace("-collapsed-", "-empty-"),
					};
					if (
						!isCollapsed(currentItems["left"][overIndex].id) &&
						!isCollapsed(currentItems["right"][overIndex].id)
					) {
						const random = Math.random();
						const modifiedOverIndex = overIndex + modifier;
						currentItems["link"].splice(modifiedOverIndex, 0, {
							collapsed: true,
							ID: random,
							Seq: 0,
							SimoLinkPrev: false,
						});
						currentItems["left"].splice(modifiedOverIndex, 0, {
							id: `left-collapsed-${modifiedOverIndex}-${random}`,
							draggableId: `draggable-left-collapsed-${modifiedOverIndex}-${random}`,
							droppableId: `droppable-left-collapsed-${modifiedOverIndex}-${random}`,
							isCounted: true,
						});
						currentItems["right"].splice(modifiedOverIndex, 0, {
							id: `right-collapsed-${modifiedOverIndex}-${random}`,
							draggableId: `draggable-right-collapsed-${modifiedOverIndex}-${random}`,
							droppableId: `droppable-right-collapsed-${modifiedOverIndex}-${random}`,
							isCounted: true,
						});
						currentItems["link"].splice(
							modifiedOverIndex + (isTraversingDown ? -1 : 2),
							0,
							{
								collapsed: true,
								ID: random + 1,
								Seq: 0,
								SimoLinkPrev: false,
							},
						);
						currentItems["left"].splice(
							modifiedOverIndex + (isTraversingDown ? -1 : 2),
							0,
							{
								id: `left-collapsed-${
									modifiedOverIndex +
									(isTraversingDown ? -1 : 2)
								}-${random}`,
								draggableId: `draggable-left-collapsed-${
									modifiedOverIndex +
									(isTraversingDown ? -1 : 2)
								}-${random}`,
								droppableId: `droppable-left-collapsed-${
									modifiedOverIndex +
									(isTraversingDown ? -1 : 2)
								}-${random}`,
								isCounted: true,
							},
						);
						currentItems["right"].splice(
							modifiedOverIndex + (isTraversingDown ? -1 : 2),
							0,
							{
								id: `right-collapsed-${
									modifiedOverIndex +
									(isTraversingDown ? -1 : 2)
								}-${random}`,
								draggableId: `draggable-right-collapsed-${
									modifiedOverIndex +
									(isTraversingDown ? -1 : 2)
								}-${random}`,
								droppableId: `droppable-right-collapsed-${
									modifiedOverIndex +
									(isTraversingDown ? -1 : 2)
								}-${random}`,
								isCounted: true,
							},
						);
					}
				}
				return {
					...currentItems,
				};
			});
			setCanSave(true);
		}
		setActiveItem(null);
		setOverItem(null);
	};
	const addAction = (id?: UniqueIdentifier, type: string = "action") => {
		setAddFormType(type);
		setEmptyId(id);
		setIsModalOpen(!isModalOpen);
	};
	const handleLinkToggle = (id?: UniqueIdentifier) => {
		const newItems = {
			...items,
		};
		const item = items["link"].find(
			(m) => m.ID === id,
		) as StepLinkActionData;
		item.SimoLinkPrev = !item.SimoLinkPrev;
		setItems(newItems);
	};
	const getActionData = (id: UniqueIdentifier) => {
		return (items["left"].find((m) => m.draggableId === id) ??
			items["right"].find(
				(m) => m.draggableId === id,
			)) as StepHandActionData;
	};
	const dropAnimation: DropAnimation = {
		sideEffects: defaultDropAnimationSideEffects({
			styles: {
				active: {
					opacity: "0.5",
				},
			},
		}),
	};
	return (
		<>
			<div {...props}>
				<DndContext
					collisionDetection={pointerWithin}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
					modifiers={[restrictToWindowEdges]}
				>
					<div
						className={`flex select-none ${
							activeItem
								? "transition-[padding] ease-hover duration-300"
								: ""
						} ${
							overItem?.overId && isCollapsed(overItem?.overId)
								? "pb-0"
								: "pb-[76px]"
						}`}
						data-id={overItem?.overId}
					>
						<div className="w-[calc(50%-2.5rem)]">
							<h4 className="typo-h4 mb-12 whitespace-nowrap overflow-hidden text-ellipsis">
								{t("leftHandOther")}
							</h4>
							<Column
								addAction={addAction}
								containerId="left"
								items={getItems(items, "left")}
								overIndex={overItem?.overIndex}
							/>
						</div>
						<div className="flex-none w-20">
							<h4 className="typo-h4 mb-12 whitespace-nowrap overflow-hidden text-ellipsis opacity-0">
								Links
							</h4>
							<Links
								handleLinkToggle={handleLinkToggle}
								items={items["link"]}
								overIndex={overItem?.overIndex}
							/>
						</div>
						<div className="w-[calc(50%-2.5rem)]">
							<h4 className="typo-h4 mb-12 whitespace-nowrap overflow-hidden text-ellipsis">
								{t("rightHand")}
							</h4>
							<Column
								addAction={addAction}
								containerId="right"
								items={getItems(items, "right")}
								overIndex={overItem?.overIndex}
							/>
						</div>
					</div>
					{(permissions?.edit || permissions?.admin) &&
						createPortal(
							<DragOverlay dropAnimation={dropAnimation}>
								{activeItem && (
									<table className="table">
										<tbody>
											<Draggable
												key={activeItem?.activeId}
												id={activeItem?.activeId}
												data={getActionData(
													activeItem?.activeId,
												)}
												hasDragOverlay
											/>
										</tbody>
									</table>
								)}
							</DragOverlay>,
							document.body,
						)}
					{(permissions?.edit || permissions?.admin) && (
						<GenericModal
							customContent={
								addFormType && (
									<AddModal
										emptyId={emptyId}
										type={addFormType}
										setAddFormType={setAddFormType}
									/>
								)
							}
							isOpen={isModalOpen}
						/>
					)}
				</DndContext>
			</div>
			{(permissions?.edit || permissions?.admin) && <Save />}
			{(permissions?.edit || permissions?.admin) && (
				<BlockNavigation
					isBlocked={canSave}
					stopNavAction={() => {
						setCanSave(false);
					}}
				/>
			)}
		</>
	);
};
