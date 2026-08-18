import { useTranslation } from "react-i18next";
import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import classNames from "classnames";
import { ReactNode } from "react";
import { AddButton } from "./_Modal";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";

type DroppableProps = {
	addAction: (id?: UniqueIdentifier, type?: string) => void;
	children?: ReactNode;
	id: UniqueIdentifier;
	isAdjacentOver?: boolean;
};

export const Droppable = ({
	addAction,
	children,
	id,
	isAdjacentOver,
	...props
}: DroppableProps) => {
	const { t } = useTranslation();

	const isCollapsed = id.toString().includes("-collapsed-");
	const isEmpty = id.toString().includes("-empty-");
	const { permissions } = usePermissionsContext();
	const isDisabled = !(permissions?.edit || permissions?.admin) || (!isCollapsed && !isEmpty);

	const { isOver, setNodeRef } = useDroppable({
		disabled: isDisabled,
		id: id,
	});

	return (
		<tbody
			ref={setNodeRef}
			className={classNames(
				"transition-[height] ease-hover duration-300",
				!isCollapsed && "h-[66px]",
				isCollapsed && !isOver && !isAdjacentOver && "h-[10px]",
				isCollapsed && (isOver || isAdjacentOver) && "h-[86px]",
			)}
			{...props}
		>
			{(isCollapsed || isEmpty) && (
				<tr className="table__tr">
					<td className="p-0" colSpan={6}>
						<div
							className={classNames(
								"rounded-md bg-dashed-light dark:bg-dashed-dark transition-[height,opacity,background] ease-hover duration-300 will-change-transform flex justify-between items-end w-full gap-2",
								!isCollapsed && "h-[66px]",
								isCollapsed &&
									!isOver &&
									!isAdjacentOver &&
									"h-0 opacity-0",
								isCollapsed &&
									(isOver || isAdjacentOver) &&
									"h-[66px] opacity-100",
								isOver &&
									"bg-grey-lightest dark:bg-black-subtle",
							)}
						>
							{(permissions?.edit || permissions?.admin) && !isCollapsed && !isOver && (
								<>
									<AddButton
										classNames={`transition-opacity opacity-0 hover:opacity-100 w-1/2 bg-dashed-light dark:bg-dashed-dark`}
										action={() => {
											addAction(id, "action");
										}}
										label={t("addAAction")}
									/>
									<AddButton
										classNames={`transition-opacity opacity-0 hover:opacity-100 w-1/2 bg-dashed-light dark:bg-dashed-dark`}
										action={() => {
											addAction(id, "title");
										}}
										label={t("addATitle")}
									/>
								</>
							)}
						</div>
					</td>
				</tr>
			)}
			{!isCollapsed && !isEmpty && children}
		</tbody>
	);
};
