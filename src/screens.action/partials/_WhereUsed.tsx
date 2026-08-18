import { useTranslation } from "react-i18next";
import { Table } from "../../components/table/Table";
import { useAction } from "../../hooks.queries/useAction";

export const WhereUsed = () => {
	const action = useAction();
	const { t } = useTranslation();

	if (!action?.WhereUsed?.length) {
		return <></>;
	}

	return (
		<div className="mt-28">
			<h3 className="typo-h3 mb-10">
				{t("associatedSteps", {
					defaultValue: "Associated Steps",
				})}{" "}
				({action.WhereUsed.length})
			</h3>
			<Table
				actions={{
					menu: [
						{
							label: t("viewStep", {
								defaultValue: "View Step",
							}),
							url: "/steps/%%ID%%",
						},
					],
				}}
				columns={[
					{
						label: "Code",
						accessor: "Code",
						sortable: true,
						width: "25%",
						sortOrder: "asc",
					},
					{
						label: "Description",
						accessor: "Description",
						width: "50%",
					},
				]}
				data={action.WhereUsed}
				rows={{
					link: {
						label: t("viewStep", {
							defaultValue: "View Step",
						}),
						url: "/steps/%%ID%%",
					},
				}}
			/>
		</div>
	);
};
