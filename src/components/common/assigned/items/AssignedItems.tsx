import { AssignedItemData } from "../../../../api.common/types";
import { useFetchAssignedItemsForUser } from "../../../../data.common/api/hooks";
import { AssignedItem } from "../item/AssignedItem";

interface AssignedItemsProps {
	title?: string;
}

export const AssignedItems = ({ title, ...props }: AssignedItemsProps) => {
	const { assignedItems } = useFetchAssignedItemsForUser();

	return (
		<div {...props}>
			<div>
				<h4 className="typo-h4 text-white">
					{title ?? "Assigned to me"}
				</h4>
				<p className="typo-h5 text-grey-light">
					{assignedItems.length} Styles
				</p>
			</div>
			<ul>
				{assignedItems.map(
					(assignedItem: AssignedItemData, index: number) => (
						<li key={assignedItem.title + index}>
							<AssignedItem {...assignedItem} />
						</li>
					)
				)}
			</ul>
		</div>
	);
};
