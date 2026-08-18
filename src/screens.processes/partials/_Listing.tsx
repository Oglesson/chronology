import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api.common";
import { SearchableTable } from "../../components/table/SearchableTable";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import { useRerender } from "../../hooks.common/useRerender";
import { useProcesses } from "../../hooks.queries/useProcesses";
import { Delete } from "../../screens.process/process.index/partials/_Delete";
import { Copy } from "../../screens.process/process.index/partials/_Copy";
import { Filter } from "./_Filter";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import Icons from "../../config.common/Icons";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import { ProcessesContext } from "./_ProcessesContext";
import { Button } from "../../components/common/button/Button";

export const Listing = ({ ...props }) => {
	const rerender = useRerender();
	const queryClient = useQueryClient();
	const { processes } = useProcesses();
	const [filteredProcesses, setFilteredProcesses] = useState(processes);
	const { permissions } = usePermissionsContext();
	const { setOpenModalSettings, setOpenModalContent, openModalSettings } =
		useContext(ProcessesContext);

	const { t } = useTranslation();

	useEffect(() => {
		setFilteredProcesses(processes);
	}, [processes]);

	return (
		<>
			<div className="float-right">
				<Button
					text={t("filters")}
					icon={Icons.Interface.Filter}
					style="secondary"
					onClick={() => {
						setOpenModalSettings({
							isOpen: openModalSettings?.isOpen ? false : true,
							alignment: "right",
							width: "w-[34rem]",
							height: "h-full",
						});
						setOpenModalContent(
							<Filter
								setFilteredProcesses={setFilteredProcesses}
							/>,
						);
					}}
				/>
			</div>

			<SearchableTable
				strategy="includes"
				actions={(data) => {
					return {
						menu: [
							{
								label: t("viewProcess"),
								url: "/processes/%%ID%%",
							},
							{
								step: (permissions?.edit || permissions?.admin) && (
									<Copy process={data} />
								),
							},
							{
								step: (permissions?.edit || permissions?.admin) && (
									<Delete process={data} />
								),
							},
						],
						interactionIntent: async () => {
							if (!(permissions?.edit || permissions?.admin)) {
								return;
							}

							const occasionsUsedQueryData =
								await queryClient.fetchQuery({
									queryKey: [
										QUERY_KEYS.process_in_use,
										data.ID?.toString(),
									],
									queryFn: async () =>
										await api.getProcessOccasionsUsed(
											Number(data.ID),
										),
									staleTime: 10000,
								});

							data.OccasionsUsed =
								occasionsUsedQueryData.data.OccasionsUsed;
							data.IsInUse =
								data.OccasionsUsed !== undefined &&
								data.OccasionsUsed > 0;

							rerender({});
						},
					};
				}}
				columns={[
					{
						label: t("code"),
						accessor: "Code",
						searchable: true,
						sortable: true,
						sortOrder: "asc",
					},
					{
						label: t("description"),
						accessor: "Description",
						searchable: true,
					},
					{
						label: t("department"),
						accessor: "_Department_Description",
						template: (data) => (
							<>{data?._Department_Description}</>
						),
					},
					{
						label: "Class",
						accessor: "_Type_Class_Description",
						template: (data) => (
							<>{data?._Type_Class_Description}</>
						),
					},
					{
						label: "Type",
						accessor: "_Type_Description",
						template: (data) => <>{data?._Type_Description}</>,
					},
					{
						label: t("frozen"),
						accessor: "isFrozen",
						template: (data) => (
							<>
								{data.Frozen && (
									<>
										<RenderIcon
											icon={Icons.Interface.Frozen}
										/>
									</>
								)}
							</>
						),
					},
				]}
				data={filteredProcesses}
				rows={{
					link: {
						label: t("viewProcess"),
						url: "/processes/%%ID%%",
					},
				}}
				{...props}
			/>
		</>
	);
};
