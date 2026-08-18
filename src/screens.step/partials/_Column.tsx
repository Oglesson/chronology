import { UniqueIdentifier } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import { StepHandActionData } from "../../hooks.queries/useStep";
import { AddButton } from "./_Modal";
import { Draggable } from "./_Draggable";
import { Droppable } from "./_Droppable";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";

type ColumnProps = {
	addAction: (id?: UniqueIdentifier, type?: string) => void;
	containerId: UniqueIdentifier;
	items: StepHandActionData[];
	overIndex: number | undefined;
};

export const Column = ({
	addAction,
	containerId,
	items,
	overIndex,
	...props
}: ColumnProps) => {
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	return (
		<>
			<table className="table" key={containerId} {...props}>
				<thead>
					<tr>
						<th className="table__th !pb-6">{t("code")}</th>
						<th className="table__th !pb-6">
							{t("comment")} / {t("description")}
						</th>
						<th className="table__th !pb-6  !text-right">
							{t("secondsAt100")}
						</th>
						<th className="table__th !pb-6 !text-right">
							{t("frequency")}
						</th>
						<th className="table__th !pb-6 !text-right">
							{t("total")}
						</th>
						<th className="p-0">
							<span className="sr-only">{t("moreActions")}</span>
						</th>
					</tr>
				</thead>
				{items.map((m, index) => (
					<Droppable
						key={m.droppableId}
						id={m.droppableId}
						isAdjacentOver={index === overIndex}
						addAction={addAction}
					>
						<Draggable
							key={m.draggableId}
							id={m.draggableId}
							data={m}
						/>
					</Droppable>
				))}
			</table>
			{(permissions?.edit || permissions?.admin) && (
				<div className="flex justify-between items-end w-full gap-2">
					<AddButton
						classNames="mt-0.5 transition-colors bg-grey-lightest hover:bg-grey-lighter dark:bg-black-subtle dark:hover:bg-black w-1/2"
						action={() => {
							addAction(containerId, "action");
						}}
						label={t("addAAction")}
					/>
					<AddButton
						classNames="mt-0.5 transition-colors bg-grey-lightest hover:bg-grey-lighter dark:bg-black-subtle dark:hover:bg-black w-1/2"
						action={() => {
							addAction(containerId, "title");
						}}
						label={t("addATitle")}
					/>
				</div>
			)}
		</>
	);
};
