import { UniqueIdentifier, useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { ItemActionsMenu } from "../../components/ItemActionsMenu/ItemActionsMenu";
import { StepHandActionData } from "../../hooks.queries/useStep";
import { EditAction } from "./_EditAction";
import { RemoveAction } from "./_RemoveAction";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { ItemsContext } from "./_ActionItemsContext";
import { useAction } from "../../hooks.queries/useAction";
import { useActions } from "../../hooks.queries/useActions";
import { Tooltip } from "../../components/common/tooltip/Tooltip";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import Icons from "../../config.common/Icons";

type DraggableProps = {
	data: StepHandActionData | undefined;
	hasDragOverlay?: boolean;
	id: UniqueIdentifier;
};

export const Draggable = ({
	data,
	hasDragOverlay,
	id,
	...props
}: DraggableProps) => {
	const { actions } = useActions();
	const { active } = useDndContext();
	const { permissions } = usePermissionsContext();
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id: id,
			disabled: !(permissions?.edit || permissions?.admin),
		});
	const [hasHighlight, setHasHighlight] = useState(false);
	const { canSave } = useContext(ItemsContext);
	const { t } = useTranslation();
	const titleActionID = useAction(false, "__TITLE__");

	const style =
		transform && hasDragOverlay
			? {
					transform: CSS.Translate.toString(transform),
				}
			: undefined;

	return (
		<tr
			ref={setNodeRef}
			className={classNames(
				"table__tr whitespace-nowrap origin-center touch-manipulation h-[66px] group",
				(permissions?.edit || permissions?.admin) &&
					!isDragging &&
					!hasDragOverlay &&
					"cursor-grab",
				!(permissions?.edit || permissions?.admin) &&
					!isDragging &&
					!hasDragOverlay &&
					"cursor-default",
				isDragging && "opacity-30",
				hasDragOverlay && "cursor-grabbing",
				!isDragging && !hasDragOverlay && "table__tr--hover",
				(isDragging || hasDragOverlay || hasHighlight) &&
					"table__tr--highlight",
				!data?.isCounted &&
					!canSave &&
					data?.Action?.ID !== titleActionID.ID &&
					"text-[#666] line-through",
			)}
			style={style}
			{...attributes}
			{...listeners}
			{...props}
		>
			{data?.Action && data?.Action?.ID !== titleActionID.ID ? (
				<>
					<td className={"table__td rounded-l-mds"} width="15%">
						<span className="flex gap-2 items-center">
							{!actions.some(
								(action) => data?.Action?.ID === action.ID,
							) && (
								<Tooltip
									theme="error"
									content={t("tooltipActionRemovedError")}
								>
									<RenderIcon
										icon={Icons.Interface.Warning}
										classes="text-decline"
									/>
								</Tooltip>
							)}
							{data?.Action?.Code}
						</span>
					</td>
					<td className="table__td" width="40%">
						{data?.Comment}
						<span
							className={`block typo-pre-heading ${
								!data?.isCounted && !canSave
									? ""
									: "text-grey-light"
							} mt-1.5`}
						>
							{data?.Action?.Description}
						</span>
					</td>
					<td className="table__td !text-right" width="15%">
						{data?.Action?.SecsAt100.toFixed(4) ?? <>&ndash;</>}
					</td>
					<td className="table__td !text-right" width="10%">
						{data?.Quantity ?? <>&ndash;</>}
					</td>
					<td className="table__td !text-right" width="10%">
						{data?.Time_Seconds?.toFixed(4) ?? <>&ndash;</>}
					</td>
					<td
						className={`table__td !text-right rounded-r-mds`}
						width="10%"
					>
						{(permissions?.edit || permissions?.admin) && (
							<ItemActionsMenu
								actions={[
									{
										step: (
											<EditAction
												data={data}
												itemId={id}
												type="action"
											/>
										),
									},
									{
										step: (data) => (
											<RemoveAction
												data={data}
												itemId={id}
												type="action"
											/>
										),
									},
								]}
								buttonClasses={
									hasHighlight
										? "opacity-100"
										: "opacity-0 group-hover:opacity-100"
								}
								buttonLabel={t("moreActions")}
								data={data}
								onKeyDown={(event) => {
									event.stopPropagation();
								}}
								onPointerDown={(event) => {
									event.stopPropagation();
								}}
								open={active ? false : undefined}
								toggle={(isOpen) => {
									setHasHighlight(isOpen);
								}}
							/>
						)}
					</td>
				</>
			) : (
				<>
					<td
						className="text-center font-bold"
						colSpan={hasDragOverlay ? undefined : 5}
					>
						{data?.Comment}
					</td>
					<td
						className={`table__td !text-right rounded-r-mds`}
						width="8%"
					>
						{(permissions?.edit || permissions?.admin) && (
							<ItemActionsMenu
								actions={[
									{
										step: (
											<EditAction
												data={data}
												itemId={id}
												type="title"
											/>
										),
									},
									{
										step: (data) => (
											<RemoveAction
												data={data}
												itemId={id}
												type="title"
											/>
										),
									},
								]}
								buttonClasses={
									hasHighlight
										? "opacity-100"
										: "opacity-0 group-hover:opacity-100"
								}
								buttonLabel={t("moreActions")}
								data={data}
								onKeyDown={(event) => {
									event.stopPropagation();
								}}
								onPointerDown={(event) => {
									event.stopPropagation();
								}}
								open={active ? false : undefined}
								toggle={(isOpen) => {
									setHasHighlight(isOpen);
								}}
							/>
						)}
					</td>
				</>
			)}
		</tr>
	);
};
