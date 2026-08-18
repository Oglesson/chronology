import { useTranslation } from "react-i18next";
import { Table } from "../../components/table/Table";
import { useStep } from "../../hooks.queries/useStep";

export const WhereUsed = () => {
	const { step } = useStep();
	const { t } = useTranslation();

	if (!step?.WhereUsed?.length) {
		return <></>;
	}

	return (
		<div className="mt-28">
			<h3 className="typo-h3 mb-10">
				{t("associatedOperations", {
					defaultValue: "Associated Processes",
				})}{" "}
				({step.WhereUsed.length})
			</h3>
			<Table
				actions={{
					menu: [
						{
							label: t("viewProcess", {
								defaultValue: "View Process",
							}),
							url: "/processes/%%ID%%",
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
				data={step.WhereUsed}
				rows={{
					link: {
						label: t("viewProcess", {
							defaultValue: "View Process",
						}),
						url: "/processes/%%ID%%",
					},
				}}
			/>
		</div>
	);
};
