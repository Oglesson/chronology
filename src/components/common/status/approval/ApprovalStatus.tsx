import { useTranslation } from "react-i18next";
import {
	toCamelCase,
	toKebabCase,
} from "../../../../utilities.common/StringUtilities";
import "./approvalStatus.scss";

// eslint-disable-next-line react-refresh/only-export-components
export enum ApprovalStatusEnum {
	Approved,
	Declined,
	ToDo,
}

interface ApprovalStatusProps {
	status: ApprovalStatusEnum;
}

export const ApprovalStatus = ({ status, ...props }: ApprovalStatusProps) => {
	const { t } = useTranslation();

	const statusEnum = ApprovalStatusEnum[status];

	return (
		<span
			className={[
				"approval-status",
				`approval-status--${toKebabCase(statusEnum)}`,
			].join(" ")}
			{...props}
		>
			{t(toCamelCase(statusEnum, true))}
		</span>
	);
};
