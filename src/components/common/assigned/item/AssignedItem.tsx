import {
	ApprovalStatus,
	ApprovalStatusEnum,
} from "../../status/approval/ApprovalStatus";

interface AssignedItemProps {
	hasNotification?: boolean;
	status?: ApprovalStatusEnum;
	timeRemaining: string;
	title: string;
	version: string;
}

export const AssignedItem = ({
	hasNotification,
	status,
	timeRemaining,
	title,
	version,
	...props
}: AssignedItemProps) => {
	return (
		<div
			className={`relative py-5 pr-3 pl-5 bg-black flex items-center justify-between${
				hasNotification
					? " before:absolute before:top-[-5px] before:left-[-5px] before:w-2.5 before:h-2.5 before:rounded-full before:bg-green"
					: ""
			}`}
			{...props}
		>
			<div>
				<p className="text-white">{title}</p>
				<div className="flex mt-1.5 typo-pre-heading text-grey-light">
					<p>{timeRemaining} left</p>
					<p className={`${timeRemaining ? "ml-9" : ""}`}>
						v.{version}
					</p>
				</div>
			</div>
			{status !== undefined ? <ApprovalStatus status={status} /> : <></>}
		</div>
	);
};
