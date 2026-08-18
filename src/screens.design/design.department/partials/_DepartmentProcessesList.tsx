import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "../../../components/table/Table";
import { RemoveProcess } from "./_RemoveProcess";
import { DesignDepartmentContext } from "./_DesignDepartmentContext";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";
import { ItemActionsMenu } from "../../../components/ItemActionsMenu/ItemActionsMenu";
import { AddSingleProcessButton } from "./_AddSingleProcess";
import { AddProcessSetButton } from "./_AddProcessSet";
import Icons from "../../../config.common/Icons";

export const DepartmentProcessesList = () => {
	const { setCanSave, styleProcesses, setStyleProcesses } = useContext(
		DesignDepartmentContext,
	);
	const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
	const { t } = useTranslation();

	const { permissions } = usePermissionsContext();

	return (
		<>
			<Table
				tableClassName={
					permissions?.edit
						? "table--no-pagination-border"
						: "table--border"
				}
				data={styleProcesses}
				dataChange={(data) => {
					if (data === styleProcesses) {
						return;
					}
					setStyleProcesses(
						data.map((item, index) => {
							return { ...item, Seq: index + 1 };
						}),
					);
					setCanSave(true);
				}}
				actions={(data) => {
					return {
						menu: [
							{
								label: t("viewProcess", {
									defaultValue: "View Process",
								}),
								url: "/processes/%%OperationID%%",
							},
							{
								step: (permissions?.edit ||
									permissions?.admin) && (
									<RemoveProcess itemSeq={data.Seq} />
								),
							},
						],
					};
				}}
				rows={{
					draggable: true,
					around:
						permissions?.edit || permissions?.admin
							? (data, options) => {
									const index =
										options.index === -1
											? data.Seq - 1
											: data.Seq;
									return (
										<tbody className="table__tbody">
											<tr className="group/row table__tr">
												<td
													className="p-0 h-px"
													colSpan={12}
												>
													<button
														className={`relative top-0 flex items-center justify-end box-content w-full h-px cursor-pointer ${
															options.index ===
															activeRowIndex
																? "z-40 py-1.5 -my-1.5 bg-dashed-dark bg-transparent"
																: "z-0 bg-grey-mid group-hover/row:z-30 group-hover/row:py-1.5 group-hover/row:-my-1.5 group-hover/row:bg-dashed-dark group-hover/row:bg-transparent"
														}`}
														onClick={() => {
															setActiveRowIndex(
																options.index,
															);
														}}
													>
														<span className="sr-only">
															{t("addProcess")}
														</span>
													</button>
												</td>
												<td
													className="p-0 h-px"
													colSpan={1}
												>
													{
														<div
															className={`absolute z-40 top-0 right-0 flex items-center justify-end h-0 ${
																options.index ===
																activeRowIndex
																	? ""
																	: "invisible group-hover/row:visible group-hover/row:z-30"
															}`}
														>
															<ItemActionsMenu
																actions={[
																	{
																		step: (
																			<AddSingleProcessButton
																				index={
																					index
																				}
																			/>
																		),
																	},
																	{
																		step: (
																			<AddProcessSetButton
																				index={
																					index
																				}
																			/>
																		),
																	},
																]}
																buttonIcon={
																	Icons.Edit
																		.Plus
																}
																buttonLabel={t(
																	"addProcess",
																)}
																style="select"
																buttonClasses="!bg-grey-mid !border-grey-mid text-white"
																open={
																	options.index ===
																		activeRowIndex &&
																	!options.sorting
																}
																toggle={(
																	isOpen,
																) => {
																	setActiveRowIndex(
																		isOpen
																			? options.index
																			: null,
																	);
																}}
															/>
														</div>
													}
												</td>
											</tr>
										</tbody>
									);
								}
							: undefined,
				}}
				columns={[
					{
						accessor: "_Operation.Code",
						label: "Code",
						template: (data) => <>{data._Operation?.Code}</>,
						width: "10%",
					},
					{
						accessor: "Description",
						label: "Description",
						template: (data) => <>{data._Operation?.Description}</>,
					},
					{
						accessor: "Machine",
						label: "Machine",
						template: (data) => (
							<>{data._Operation?._Machine?.Code}</>
						),
						width: "10%",
					},
					{
						accessor: "Grade",
						label: "Grade",
						template: (data) => (
							<>{data._Operation?._Grade?.Code}</>
						),
						width: "10%",
					},
					{
						accessor: "BatchVA",
						label: (
							<span className="flex items-center before:w-2.5 before:h-2.5 before:rounded-full before:bg-green before:mr-2">
								VA
							</span>
						),
						template: (data) => (
							<>
								{data._Operation?.Calculations?.Allowed_Time.Minutes.VA?.toFixed(
									2,
								)}
							</>
						),
						alignHorizontal: "right",
					},
					{
						accessor: "BatchNVA",
						label: (
							<span className="flex items-center before:w-2.5 before:h-2.5 before:rounded-full before:bg-decline before:mr-2">
								NVA
							</span>
						),
						template: (data) => (
							<>
								{data._Operation?.Calculations?.Allowed_Time.Minutes.NVA?.toFixed(
									2,
								)}
							</>
						),
						alignHorizontal: "right",
					},
					{
						accessor: "BatchAMS",
						label: "AMS",
						template: (data) => (
							<>
								{data._Operation?.Calculations?.Allowed_Time.Minutes.Total?.toFixed(
									2,
								)}
							</>
						),
						alignHorizontal: "right",
					},
					{
						accessor: "BatchCost",
						label: "Cost",
						template: (data) => (
							<>
								{data._Operation?.Calculations?.Cost_Batch?.toFixed(
									2,
								)}
							</>
						),
						alignHorizontal: "right",
					},
					{
						accessor: "CostedVA",
						label: (
							<span className="flex items-center before:w-2.5 before:h-2.5 before:rounded-full before:bg-green before:mr-2">
								VA
							</span>
						),
						template: (data) => (
							<>
								{data._Operation?.Calculations?.Allowed_Time.Minutes.Costed_VA?.toFixed(
									2,
								)}
							</>
						),
						alignHorizontal: "right",
					},
					{
						accessor: "CostedNVA",
						label: (
							<span className="flex items-center before:w-2.5 before:h-2.5 before:rounded-full before:bg-decline before:mr-2">
								NVA
							</span>
						),
						template: (data) => (
							<>
								{data._Operation?.Calculations?.Allowed_Time.Minutes.Costed_NVA?.toFixed(
									2,
								)}
							</>
						),
						alignHorizontal: "right",
					},
					{
						accessor: "CostedAMS",
						label: "AMS",
						template: (data) => (
							<>
								{data._Operation?.Calculations?.Allowed_Time.Minutes.Costed_Total?.toFixed(
									2,
								)}
							</>
						),
						alignHorizontal: "right",
					},
					{
						accessor: "CostedCost",
						label: "Cost",
						template: (data) => (
							<>
								{data._Operation?.Calculations?.Cost_PairsCosted?.toFixed(
									2,
								)}
							</>
						),
						alignHorizontal: "right",
					},
				]}
				preHeading={
					<tr>
						<th className="table__pre-heading" colSpan={4}></th>
						<th
							className="!text-center table__pre-heading"
							colSpan={4}
						>
							{t("batch", {
								defaultValue: "Batch",
							})}
						</th>
						<th
							className="!text-center table__pre-heading"
							colSpan={4}
						>
							{t("costed", {
								defaultValue: "Costed",
							})}
						</th>
					</tr>
				}
			/>
		</>
	);
};
