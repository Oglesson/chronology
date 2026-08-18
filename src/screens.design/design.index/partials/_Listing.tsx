import { useTranslation } from "react-i18next";
import { Table } from "../../../components/table/Table";
import { useDesign } from "../../../hooks.queries/useDesign";

export const Listing = () => {
	const style = useDesign();
	const { t } = useTranslation();

	return (
		<>
			{style?.Departments && style?.Departments?.length > 0 && (
				<>
					<Table
						data={style?.Departments}
						actions={() => {
							return {
								menu: [
									{
										label: t("viewDepartment", {
											defaultValue: "View Department",
										}),
										url: "%%ID%%",
									},
								],
							};
						}}
						rows={{
							link: {
								label: t("viewDepartment", {
									defaultValue: "View Department",
								}),
								url: "%%ID%%",
							},
						}}
						columns={[
							{
								accessor: "_Department.Code",
								label: t("department"),
								template: (data) => (
									<span className="typo-h3">
										{data?._Department?.Description}
									</span>
								),
							},
							{
								accessor: "BatchSize",
								label: t("batchSize"),
								alignHorizontal: "right",
							},
							{
								accessor:
									"Calculations?.Allowed_Time_PairsCosted.Minutes.VA",
								label: (
									<span className="flex items-center before:w-2.5 before:h-2.5 before:rounded-full before:bg-green before:mr-2">
										VA
									</span>
								),
								template: (data) => (
									<>
										{data?.Calculations?.Allowed_Time.Minutes?.VA?.toFixed(
											2
										)}
									</>
								),
								alignHorizontal: "right",
							},
							{
								accessor:
									"Calculations?.Allowed_Time_PairsCosted.Minutes.NVA",
								label: (
									<span className="flex items-center before:w-2.5 before:h-2.5 before:rounded-full before:bg-decline before:mr-2">
										NVA
									</span>
								),
								template: (data) => (
									<>
										{data?.Calculations?.Allowed_Time.Minutes?.NVA?.toFixed(
											2
										)}
									</>
								),
								alignHorizontal: "right",
							},
							{
								accessor:
									"Calculations?.Allowed_Time_PairsCosted.Minutes.Total",
								label: "AMS",
								template: (data) => (
									<>
										{data?.Calculations?.Allowed_Time.Minutes.Total?.toFixed(
											2
										)}
									</>
								),
								alignHorizontal: "right",
							},
							{
								accessor: "Calculations.Cost_PairsCosted",
								label: t("cost"),
								template: (data) => (
									<>
										{data?.Calculations?.Cost_Batch?.toFixed(
											2
										)}
									</>
								),
								alignHorizontal: "right",
							},
							{
								accessor:
									"Calculations.Allowed_Time_Batch.Minutes.VA",
								label: (
									<span className="flex items-center before:w-2.5 before:h-2.5 before:rounded-full before:bg-green before:mr-2">
										VA
									</span>
								),
								template: (data) => (
									<>
										{data?.Calculations?.Allowed_Time.Minutes?.Costed_VA?.toFixed(
											2
										)}
									</>
								),
								alignHorizontal: "right",
							},
							{
								accessor:
									"Calculations.Allowed_Time_Batch.Minutes.NVA",
								label: (
									<span className="flex items-center before:w-2.5 before:h-2.5 before:rounded-full before:bg-decline before:mr-2">
										NVA
									</span>
								),
								template: (data) => (
									<>
										{data?.Calculations?.Allowed_Time.Minutes?.Costed_NVA?.toFixed(
											2
										)}
									</>
								),
								alignHorizontal: "right",
							},
							{
								accessor:
									"Calculations?.Allowed_Time_Batch.Minutes.Total",
								label: "AMS",
								template: (data) => (
									<>
										{data?.Calculations?.Allowed_Time.Minutes?.Costed_Total?.toFixed(
											2
										)}
									</>
								),
								alignHorizontal: "right",
							},
							{
								accessor: "Calculations.Cost_Batch",
								label: t("cost"),
								template: (data) => (
									<>
										{data?.Calculations?.Cost_PairsCosted?.toFixed(
											2
										)}
									</>
								),
								alignHorizontal: "right",
							},
						]}
						preHeading={
							<tr>
								<th
									className="table__pre-heading"
									colSpan={3}
								></th>
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
						tableClassName="table--border"
					/>
				</>
			)}
		</>
	);
};
