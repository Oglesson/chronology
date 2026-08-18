import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	UniqueIdentifier,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Dispatch, ReactNode, SetStateAction } from "react";
import "./table.scss";

type TableDndProps<T> = {
	children: ReactNode;
	draggable?: boolean;
	setRowIDs: Dispatch<SetStateAction<UniqueIdentifier[]>>;
	setTableData: Dispatch<SetStateAction<T[]>>;
};

type TableRowDndProps<_T> = {
	children: ReactNode;
	draggable?: boolean;
	rowIDs: UniqueIdentifier[];
};

export const TableDnd = <T,>({
	children,
	draggable,
	setTableData,
	setRowIDs,
}: TableDndProps<T>) => {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		if (over?.id && active.id !== over.id) {
			setRowIDs((previousRowIDs) => {
				const oldIndex = previousRowIDs.indexOf(active.id);
				const newIndex = previousRowIDs.indexOf(over.id);
				setTableData((previousTableData) => {
					const tableData = arrayMove(
						previousTableData,
						oldIndex,
						newIndex
					);
					return tableData;
				});
				return arrayMove(previousRowIDs, oldIndex, newIndex);
			});
		}
	};

	if (draggable) {
		return (
			<DndContext
				sensors={sensors}
				onDragEnd={handleDragEnd}
				collisionDetection={closestCenter}
				modifiers={[restrictToVerticalAxis]}
			>
				{children}
			</DndContext>
		);
	}

	return children;
};

export const TableRowDnd = <T,>({
	children,
	draggable,
	rowIDs,
}: TableRowDndProps<T>) => {
	if (draggable) {
		return (
			<SortableContext
				strategy={verticalListSortingStrategy}
				items={rowIDs}
			>
				{children}
			</SortableContext>
		);
	}

	return children;
};
