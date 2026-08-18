import { useTranslation } from "react-i18next";
import { SearchableTable } from "../../components/table/SearchableTable";
import { useActions } from "../../hooks.queries/useActions";
import { Copy } from "../../screens.action/partials/_Copy";
import { Delete } from "../../screens.action/partials/_Delete";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import api from "../../api.common";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { Tooltip } from "../../components/common/tooltip/Tooltip";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import Icons from "../../config.common/Icons";
export const Listing = () => {
	const { actions } = useActions();
	const queryClient = useQueryClient();
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	return (
		<SearchableTable
			strategy="includes"
			actions={(data) => {
				return {
					menu: [
						{
							label: t("viewAction"),
							url: "/actions/%%ID%%",
						},
						{
							step: (data) =>
								(permissions?.edit || permissions?.admin) && <Copy action={data} />,
						},
						{
							step: (permissions?.edit || permissions?.admin) && <Delete action={data} />,
						},
					],
					interactionIntent: async () => {
						if (!(permissions?.edit || permissions?.admin)) {
							return;
						}

						const occasionsUsedQueryData =
							await queryClient.fetchQuery({
								queryKey: [
									QUERY_KEYS.action_in_use,
									data.ID?.toString(),
								],
								queryFn: async () =>
									await api.getActionOccasionsUsed(
										Number(data.ID),
									),
								staleTime: 10000,
							});

						data.OccasionsUsed =
							occasionsUsedQueryData.data.OccasionsUsed;
						data.IsInUse =
							data.OccasionsUsed !== undefined &&
							data.OccasionsUsed > 0;
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
					width: "25%",
				},
				{
					label: t("description"),
					accessor: "Description",
					searchable: true,
					width: "50%",
				},
				{
					label: t("secondsAt100Performance"),
					accessor: "SecsAt100",
					template: (data) => <>{data.SecsAt100.toFixed(4)}</>,
					width: "25%",
					alignHorizontal: "right",
				},
				{
					label: t("uneditable"),
					accessor: "System",
					template: (data) => (
						<>
							{data.System && (
								<Tooltip
									placement="left"
									content={t("tooltipEditAction")}
									strategy="hover"
								>
									<RenderIcon icon={Icons.Edit.Remove} />
								</Tooltip>
							)}
						</>
					),
					alignHorizontal: "center",
				},
			]}
			data={actions}
			rows={{
				link: {
					label: t("viewAction", {
						defaultValue: "View Action",
					}),
					url: "/actions/%%ID%%",
				},
			}}
		/>
	);
};
