import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "../../../components/table/Table";
import { AddProcess } from "./_AddProcess";
import { ProcessSetContext } from "./_ProcessSetContext";
import { RemoveProcess } from "./_RemoveProcess";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";

export const Processes = () => {
	const { t } = useTranslation();
	const { processes, setProcesses, setCanSave } =
		useContext(ProcessSetContext);
	const { permissions } = usePermissionsContext();

	return (
		<div className="mt-28">
			<h3 className="typo-h3 mb-10">
				{t("processes", {
					defaultValue: "Processes",
				})}
			</h3>
			{processes.length > 0 && (
				<Table
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
									step: (permissions?.edit || permissions?.admin) && (
										<RemoveProcess
											itemId={data.ProcessID}
										/>
									),
								},
							],
						};
					}}
					columns={[
						{
							label: "Code",
							accessor: "Code",
							width: "25%",
							template: (data) => <>{data?._Operation?.Code}</>,
						},
						{
							label: "Description",
							accessor: "Description",
							width: "50%",
							template: (data) => (
								<>{data?._Operation?.Description}</>
							),
						},
					]}
					data={processes}
					rows={{
						draggable: true,
					}}
					dataChange={(data) => {
						setProcesses(data);
						setCanSave(true);
					}}
				/>
			)}
			{(permissions?.edit || permissions?.admin) && (
				<div className="mt-7">
					<AddProcess />
				</div>
			)}
		</div>
	);
};
