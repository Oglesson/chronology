import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "../../components/table/Table";
import { Filter } from "./_Filter";
import { formatAPIDateIntoString } from "../../utilities.common/DateUtilities";
import { AuditContext } from "./_AuditsContext";
import { Button } from "../../components/common/button/Button";
import Icons from "../../config.common/Icons";
import { AuditData } from "../../api.common/types";

export const Listing = ({ ...props }) => {
	const { filteredAudits, setOpenFilterModal } = useContext(AuditContext);

	const { t } = useTranslation();

	useEffect(() => {
		setOpenFilterModal(true);
	}, [setOpenFilterModal]);

	return (
		<>
			<div className="float-right">
				<Button
					text={t("filters")}
					icon={Icons.Interface.Filter}
					style="secondary"
					onClick={() => setOpenFilterModal(true)}
				/>
			</div>
			<Filter />
			<Table
				columns={[
					{
						label: t("dateTimeOfAction"),
						accessor: "DateTime",
						template: (data: AuditData) => (
							<>{formatAPIDateIntoString(data?.DateTime)}</>
						),
						sortable: true,
						sortOrder: "desc",
					},
					{
						label: t("codeorno"),
						accessor: "CodeOrNo",
					},
					{
						label: t("actionType"),
						accessor: "_SectionAction",
					},
					{
						label: t("dataType"),
						accessor: "_Section",
					},
					{
						label: t("byUser"),
						accessor: "Username",
						sortable: true,
					},
				]}
				data={filteredAudits}
				{...props}
			/>
		</>
	);
};
