import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ItemActionsMenu } from "../../../components/ItemActionsMenu/ItemActionsMenu";
import { HorizontalTabs } from "../../../components/tabs/HorizontalTabs";
import Icons from "../../../config.common/Icons";
import { useDesignDepartment } from "../../../hooks.queries/useDesignDepartment";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import { AddProcessSet, AddProcessSetButton } from "./_AddProcessSet";
import { AddSingleProcess, AddSingleProcessButton } from "./_AddSingleProcess";
import { DepartmentProcessesList } from "./_DepartmentProcessesList";
import { DepartmentProcessesChart } from "./_DepartmentProcessesListChart";
import { Save } from "./_Save";
import { DesignDepartmentContext } from "./_DesignDepartmentContext";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";

export const DepartmentProcesses = () => {
	const styleDepartment = useDesignDepartment();
	const { t } = useTranslation();
	const { styleProcesses } = useContext(DesignDepartmentContext);
	const { permissions } = usePermissionsContext();

	if (!styleDepartment) {
		return <></>;
	}

	const { Calculations: calculations } = styleDepartment!;
	const { Minutes: minutes } = calculations!.Allowed_Time;

	return (
		<div>
			{styleProcesses &&
				styleProcesses.length > 0 &&
				(minutes.Costed_Total > 0 || minutes.Total > 0 ? (
					<HorizontalTabs
						classes="flex w-full my-12"
						tabs={[
							{
								content: <DepartmentProcessesList />,
								label: (
									<div className="py-px">
										<span className="sr-only">
											{t("list", {
												defaultValue: "List",
											})}
										</span>
										<RenderIcon
											icon={Icons.Interface.List}
											sizes="w-3.5 h-3.5"
										/>
									</div>
								),
								value: "list",
							},
							{
								content: <DepartmentProcessesChart />,
								label: (
									<div className="py-px">
										<span className="sr-only">
											{t("chart", {
												defaultValue: "Chart",
											})}
										</span>
										<RenderIcon
											icon={Icons.Interface.BarChart}
											sizes="w-3.5 h-3.5"
										/>
									</div>
								),
								value: "chart",
							},
						]}
					/>
				) : (
					<DepartmentProcessesList />
				))}
			{(permissions?.edit || permissions?.admin) && (
				<>
					<ItemActionsMenu
						actions={[
							{
								step: <AddSingleProcessButton />,
							},
							{
								step: <AddProcessSetButton />,
							},
						]}
						buttonIcon={Icons.Edit.Plus}
						buttonLabel={t("addProcess")}
						className="mt-6"
						style="select"
					/>
					<AddSingleProcess />
					<AddProcessSet />
					<Save />
				</>
			)}
		</div>
	);
};
