import {
	closestCenter,
	CollisionDetection,
	defaultDropAnimationSideEffects,
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	DropAnimation,
	getFirstCollision,
	KeyboardSensor,
	MeasuringStrategy,
	PointerSensor,
	pointerWithin,
	rectIntersection,
	UniqueIdentifier,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { t } from "i18next";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ItemActionsMenu } from "../../../components/ItemActionsMenu/ItemActionsMenu";
import { BlockNavigation } from "../../../components/modal/BlockNavigation";
import { ScrollDrag } from "../../../components/scroll-drag/ScrollDrag";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";
import { AddGroup } from "./_AddGroup";
import { AddQuestion, AddQuestionModal } from "./_AddQuestion";
import { DefinitionContext } from "./_DefinitionContext";
import { DroppableContainer } from "./_DroppableContainer";
import { EditQuestionModal } from "./_EditQuestion";
import { RemoveGroup } from "./_RemoveGroup";
import { SortableItem } from "./_SortableItem";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants.common/queryKeys";
import api from "../../../api.common";

export const Groups = () => {
	const definition = useProcessDefinition();
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
	const lastOverId = useRef<UniqueIdentifier | null>(null);
	const recentlyMovedToNewContainer = useRef(false);
	const { permissions } = usePermissionsContext();
	const {
		canSave,
		setCanSave,
		containers,
		groups,
		items,
		setItems,
		questions,
		setQuestions,
	} = useContext(DefinitionContext);
	const queryClient = useQueryClient();

	const collisionDetectionStrategy: CollisionDetection = useCallback(
		(args) => {
			if (activeId && activeId in items) {
				return closestCenter({
					...args,
					droppableContainers: args.droppableContainers.filter(
						(container) => container.id in items,
					),
				});
			}

			// Start by finding any intersecting droppable
			const pointerIntersections = pointerWithin(args);
			const intersections =
				pointerIntersections.length > 0
					? // If there are droppables intersecting with the pointer, return those
						pointerIntersections
					: rectIntersection(args);
			let overId = getFirstCollision(intersections, "id");

			if (overId) {
				if (overId in items) {
					const containerItems = items[overId];

					// If a container is matched and it contains items (columns 'A', 'B', 'C')
					if (containerItems.length > 0) {
						// Return the closest droppable within that container
						overId = closestCenter({
							...args,
							droppableContainers:
								args.droppableContainers.filter(
									(container) =>
										container.id !== overId &&
										containerItems.includes(container.id),
								),
						})[0]?.id;
					}
				}

				lastOverId.current = overId;

				return [{ id: overId }];
			}

			// When a draggable item moves to a new container, the layout may shift
			// and the `overId` may become `null`. We manually set the cached `lastOverId`
			// to the id of the draggable item that was moved to the new container, otherwise
			// the previous `overId` will be returned which can cause items to incorrectly shift positions
			if (recentlyMovedToNewContainer.current) {
				lastOverId.current = activeId;
			}

			// If no droppable is matched, return the last match
			return lastOverId.current ? [{ id: lastOverId.current }] : [];
		},
		[activeId, items],
	);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const findContainer = (id: UniqueIdentifier) => {
		if (id in items) {
			return id;
		}

		return Object.keys(items)
			.map(Number)
			.find((key) => items[key].includes(id));
	};

	const getGroupData = (id: UniqueIdentifier) => {
		const matchingGroup = groups?.find(
			(g) => g.QuestionColumnID === Number(id),
		);

		return matchingGroup;
	};

	const getQuestionData = (id: UniqueIdentifier) => {
		return questions?.find((q) => q.Code === id?.toString());
	};

	const handleDragStart = ({ active }: DragStartEvent) => {
		setActiveId(active.id);
	};

	const handleDragOver = ({ active, over }: DragOverEvent) => {
		const overId = over?.id;

		if (overId == null || active.id in items) {
			return;
		}

		const overContainer = findContainer(overId);
		const activeContainer = findContainer(active.id);

		if (!overContainer || !activeContainer) {
			return;
		}

		if (activeContainer !== overContainer) {
			const activeItems = items[activeContainer];
			const overItems = items[overContainer];
			const overIndex = overItems.indexOf(overId);
			const activeIndex = activeItems.indexOf(active.id);
			setItems((items) => {
				let newIndex: number;

				if (overId in items) {
					newIndex = overItems.length + 1;
				} else {
					const isBelowOverItem =
						over &&
						active.rect.current.translated &&
						active.rect.current.translated.top >
							over.rect.top + over.rect.height;

					const modifier = isBelowOverItem ? 1 : 0;

					newIndex =
						overIndex >= 0
							? overIndex + modifier
							: overItems.length + 1;
				}

				recentlyMovedToNewContainer.current = true;

				return {
					...items,
					[activeContainer]: items[activeContainer].filter(
						(item) => item !== active.id,
					),
					[overContainer]: [
						...items[overContainer].slice(0, newIndex),
						items[activeContainer][activeIndex],
						...items[overContainer].slice(
							newIndex,
							items[overContainer].length,
						),
					],
				};
			});
		}
	};

	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		const activeContainer = findContainer(active.id);

		if (!activeContainer) {
			setActiveId(null);

			return;
		}

		const overId = over?.id;

		if (overId == null) {
			setActiveId(null);

			return;
		}

		const overContainer = findContainer(overId);

		if (overContainer) {
			const activeIndex = items[activeContainer].indexOf(active.id);
			const overIndex = items[overContainer].indexOf(overId);
			const overContainerIndex = containers.indexOf(overContainer);
			const activeQuestionIndex = questions?.findIndex(
				(o) => o.Code === active.id,
			) as number;

			if (activeIndex !== overIndex) {
				setItems((items) => {
					return {
						...items,
						[overContainer]: arrayMove(
							items[overContainer],
							activeIndex,
							overIndex,
						),
					};
				});
			}

			const overQuestionIndex = containers
				.slice(0, overContainerIndex)
				.reduce((a: number, b) => {
					return a + items[b].length;
				}, overIndex);

			if (activeQuestionIndex !== overQuestionIndex) {
				setQuestions((questions) => {
					if (questions) {
						questions[activeQuestionIndex].QuestionColumnID =
							overContainer as number;
						return arrayMove(
							questions,
							activeQuestionIndex,
							overQuestionIndex,
						);
					}
				});
				setCanSave(true);
			}
		}

		setActiveId(null);
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

	useEffect(() => {
		requestAnimationFrame(() => {
			recentlyMovedToNewContainer.current = false;
		});
	}, [items]);

	return (
		<>
			{(permissions?.edit || permissions?.admin) && (
				<BlockNavigation isBlocked={canSave} />
			)}
			<DndContext
				sensors={sensors}
				collisionDetection={collisionDetectionStrategy}
				measuring={{
					droppable: {
						strategy: MeasuringStrategy.Always,
					},
				}}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<ScrollDrag
					className="-mx-6.5 -mb-6.5 px-6.5 pb-20"
					windowVertical={true}
				>
					<div className="flex items-start after:w-px after:h-px after:flex-none">
						{containers?.map((container) => {
							const groupData = getGroupData(container);

							return (
								<DroppableContainer
									key={container}
									containerId={container}
									items={items[container]}
									className="flex flex-col rounded-md mr-4.75 p-8 bg-grey-lightest dark:bg-black-subtle shrink-0 w-110 min-h-[16.25rem]"
								>
									<div className="flex items-start mb-4.5 pr-2">
										<h4 className="typo-h4 py-0.5">
											{groupData?.QuestionColumnDescription ||
												container}
										</h4>
										{(permissions?.edit ||
											permissions?.admin) && (
											<ItemActionsMenu
												className="ml-auto"
												actions={[
													{
														step: (
															<RemoveGroup
																container={
																	container
																}
																groupData={
																	groupData
																}
															/>
														),
													},
												]}
												buttonLabel={t(
													"removeCategory",
												)}
												interactionIntent={async () => {
													const occasionsUsedQueryData =
														await queryClient.fetchQuery(
															{
																queryKey: [
																	QUERY_KEYS.process_definition_in_use,
																	definition.ID?.toString(),
																],
																queryFn:
																	async () =>
																		await api.getProcessClassOccasionsUsed(
																			Number(
																				definition.ID,
																			),
																		),
																staleTime: 10000,
															},
														);

													definition.OccasionsUsed =
														occasionsUsedQueryData.data.OccasionsUsed;
													definition.IsInUse =
														definition.OccasionsUsed !==
															undefined &&
														definition.OccasionsUsed >
															0;
												}}
											/>
										)}
									</div>
									<div className="space-y-1.5 mb-8">
										<SortableContext
											strategy={
												verticalListSortingStrategy
											}
											items={items[container]}
											disabled={
												!permissions
													.operationdefinitions
													?.edit ||
												definition.IsInUseByOp
											}
										>
											{items[container].map(
												(question) => (
													<SortableItem
														key={question}
														id={question}
														questionData={getQuestionData(
															question,
														)}
														disabled={
															!permissions
																.operationdefinitions
																?.edit ||
															definition.IsInUseByOp
														}
													/>
												),
											)}
										</SortableContext>
									</div>
									{(permissions?.edit ||
										permissions?.admin) && (
										<AddQuestion containerId={container} />
									)}
								</DroppableContainer>
							);
						})}
						{(permissions?.edit || permissions?.admin) && (
							<AddGroup />
						)}
					</div>
				</ScrollDrag>
				{(permissions?.edit || permissions?.admin) &&
					!definition.IsInUseByOp &&
					createPortal(
						<DragOverlay
							adjustScale={false}
							dropAnimation={dropAnimation}
						>
							{activeId && (
								<SortableItem
									key={activeId}
									id={activeId}
									questionData={getQuestionData(activeId)}
								/>
							)}
						</DragOverlay>,
						document.body,
					)}

				{(permissions?.edit || permissions?.admin) &&
					!definition.IsInUseByOp && <EditQuestionModal />}
				{(permissions?.edit || permissions?.admin) &&
					!definition.IsInUseByOp && <AddQuestionModal />}
			</DndContext>
		</>
	);
};
