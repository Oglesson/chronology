import { UniqueIdentifier } from "@dnd-kit/core";
import {
	AnimateLayoutChanges,
	defaultAnimateLayoutChanges,
	useSortable,
} from "@dnd-kit/sortable";
import { HTMLAttributes, ReactNode } from "react";

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
	defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export type DroppableContainerProps = {
	children: ReactNode;
	containerId: UniqueIdentifier;
	items: UniqueIdentifier[];
};

export const DroppableContainer = ({
	children,
	containerId,
	items,
	...props
}: DroppableContainerProps & HTMLAttributes<HTMLDivElement>) => {
	const { setNodeRef } = useSortable({
		id: containerId,
		data: {
			type: "container",
			children: items,
		},
		animateLayoutChanges,
	});

	return (
		<div id={containerId.toString()} ref={setNodeRef} {...props}>
			{children}
		</div>
	);
};
