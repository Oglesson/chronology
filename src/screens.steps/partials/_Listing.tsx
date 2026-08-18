import { useTranslation } from "react-i18next";
import { SearchableTable } from "../../components/table/SearchableTable";
import { useSteps } from "../../hooks.queries/useSteps";
import { Delete } from "../../screens.step/partials/_Delete";
import { Copy } from "../../screens.step/partials/_Copy";
import { Tooltip } from "../../components/common/tooltip/Tooltip";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import Icons from "../../config.common/Icons";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import api from "../../api.common";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";

export const Listing = () => {
	const { steps } = useSteps();
	const queryClient = useQueryClient();
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	return (
		<SearchableTable
			strategy="includes"
			actions={(data) =>
				data.Machining
					? {}
					: {
							menu: [
								{
									label: t("viewStep"),
									url: "/steps/%%ID%%",
								},
								{
									step: (data) =>
										(permissions?.edit || permissions?.admin) && (
											<Copy step={data} />
										),
								},
								{
									step: (permissions?.edit || permissions?.admin) && (
										<Delete step={data} />
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
											QUERY_KEYS.step_in_use,
											data.ID?.toString(),
										],
										queryFn: async () =>
											await api.getStepOccasionsUsed(
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
						}
			}
			columns={[
				{
					label: (
						<div className="flex items-center">
							<span className="block mr-3">
								{t("valueAdded")}
							</span>
							<Tooltip content={t("tooltipStepsVaNva")}>
								<RenderIcon icon={Icons.Interface.Info} />
							</Tooltip>
						</div>
					),
					template: (data) => (
						<div
							className={`w-2.5 h-2.5 rounded-full ${
								data.ValueAdded ? "bg-green" : "bg-decline"
							}`}
						>
							<span className="sr-only">
								{data.ValueAdded ? t("yes") : t("no")}
							</span>
						</div>
					),
				},
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
					label: t("machining"),
					accessor: "Machining",
					template: (data) => (
						<span>{data.Machining ? t("yes") : t("no")}</span>
					),
				},
			]}
			data={steps}
			rows={{
				link: {
					disabled: (data) =>
						data.Machining != undefined && data.Machining,
					label: t("viewStep"),
					url: "/steps/%%ID%%",
				},
			}}
		/>
	);
};
