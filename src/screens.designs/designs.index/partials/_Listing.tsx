import { useTranslation } from "react-i18next";
import { SearchableTable } from "../../../components/table/SearchableTable";
import { useDesigns } from "../../../hooks.queries/useDesigns";
import { Delete } from "../../../screens.design/design.index/partials/_Delete";
import { Copy } from "../../../screens.design/design.index/partials/_Copy";
import { DesignAvatar } from "./_DesignAvatar";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";

export const Listing = ({ ...props }) => {
	const { styles } = useDesigns();
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	return (
		<>
			<SearchableTable
				strategy="includes"
				actions={(data) => {
					return {
						menu: [
							{
								label: t("viewStyle", {
									defaultValue: "View Style",
								}),
								url: "/designs/%%ID%%",
							},
							{
								step: (permissions?.edit || permissions?.admin) && (
									<Copy style={data} />
								),
							},
							{
								step: (permissions?.edit || permissions?.admin) && (
									<Delete style={data} />
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
						template: (data) => (
							<span className="typo-h2">{data.Code}</span>
						),
						width: "50%",
					},
					{
						template: (data) => (
							<div className="py-1.5">
								<DesignAvatar style={data} />
							</div>
						),
					},
					{
						label: t("description"),
						accessor: "Description",
						searchable: true,
						width: "33.33%",
					},
				]}
				data={styles}
				rows={{
					link: {
						label: t("viewStyle", {
							defaultValue: "View Style",
						}),
						url: "/designs/%%ID%%",
					},
				}}
				tableClassName="table--border"
				{...props}
			/>
		</>
	);
};
