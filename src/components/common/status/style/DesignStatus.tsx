import Icons, { Icon } from "../../../../config.common/Icons";
import { RenderIcon } from "../../../../utilities.common/RenderIcon";
import {
	splitWords,
	toKebabCase,
} from "../../../../utilities.common/StringUtilities";
import "./designStatus.scss";

// eslint-disable-next-line react-refresh/only-export-components
export enum DesignStatusEnum {
	Complete,
	Costing,
	InProgress,
}

interface DesignStatusProps {
	status: DesignStatusEnum;
}

export const DesignStatus = ({ status, ...props }: DesignStatusProps) => {
	const statusEnum = DesignStatusEnum[status];
	let icon: Icon;

	switch (status) {
		case DesignStatusEnum.Complete:
			icon = Icons.Interface.Check;
			break;
		case DesignStatusEnum.Costing:
			icon = Icons.Interface.PieChart;
			break;
		case DesignStatusEnum.InProgress:
			icon = Icons.Interface.Clock;
			break;
	}
	return (
		<span
			className={[
				"style-status",
				`style-status--${toKebabCase(statusEnum)}`,
			].join(" ")}
			{...props}
		>
			{splitWords(statusEnum)}
			<RenderIcon icon={icon} classes="ml-1.5 text-current" />
		</span>
	);
};
