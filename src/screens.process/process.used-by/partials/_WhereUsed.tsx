import { useTranslation } from "react-i18next";
import { Table } from "../../../components/table/Table";
import { useProcess } from "../../../hooks.queries/useProcess";

export const WhereUsed = () => {
	const process = useProcess();
	const { t } = useTranslation();

	if (!process?.WhereUsed?.length) {
		return <></>;
	}

	return (
		<div className="mt-28">
			<h3 className="typo-h3 mb-10">
				{t("associatedStyles", {
					defaultValue: "Associated Styles",
				})}{" "}
				({process.WhereUsed.length})
			</h3>
			<Table
				actions={{
					menu: [
						{
							label: t("viewStyle", {
								defaultValue: "View Style",
							}),
							url: "/designs/%%DesignID%%",
						},
					],
				}}
				columns={[
					{
						label: "Code",
						accessor: "DesignCode",
						sortable: true,
						width: "25%",
						sortOrder: "asc",
					},
					{
						label: "Description",
						accessor: "DesignDescription",
						width: "50%",
					},
				]}
				data={process.WhereUsed}
				rows={{
					link: {
						label: t("viewStyle", {
							defaultValue: "View Style",
						}),
						url: "/designs/%%DesignID%%",
					},
				}}
			/>
		</div>
	);
};
