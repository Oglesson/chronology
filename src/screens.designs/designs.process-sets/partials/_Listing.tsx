import { useTranslation } from "react-i18next";
import { SearchableTable } from "../../../components/table/SearchableTable";
import { useDepartments } from "../../../hooks.queries/useDepartments";
import { useProcessSets } from "../../../hooks.queries/useProcessSets";
import { Delete } from "../../designs.process-set/partials/_Delete";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";

export const Listing = () => {
	const { processSets } = useProcessSets();
	const { departmentOptions } = useDepartments();
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	return (
		<SearchableTable
			strategy="includes"
			actions={(data) => {
				return {
					menu: [
						{
							label: t("viewProcessSet", {
								defaultValue: "View Process Set",
							}),
							url: "%%ID%%",
						},
						{
							step: (permissions?.edit || permissions?.admin) && (
								<Delete processSet={data} />
							),
						},
					],
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
					label: t("department"),
					template: (data) => (
						<>
							{
								departmentOptions.find(
									(d) => d.value === data.DepartmentID,
								)?.label
							}
						</>
					),
				},
				{
					label: t("description"),
					accessor: "Description",
					searchable: true,
				},
			]}
			rows={{
				link: {
					label: t("viewProcessSet", {
						defaultValue: "View Process Set",
					}),
					url: "%%ID%%",
				},
			}}
			data={processSets}
		/>
	);
};
