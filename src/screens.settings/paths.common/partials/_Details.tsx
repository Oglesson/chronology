import { Dispatch, Key, KeyboardEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { EditableInlineProvider } from "../../../components/edit/EditableInlineContext";
import { EditableInlineInput } from "../../../components/edit/EditableInlineInput";
import { EditableInlineInputForm } from "../../../components/edit/EditableInlineInputForm";
import { Table } from "../../../components/table/Table";
import { usePathFeatures } from "../../../hooks.queries/usePathFeatures";
import { useDefinitionPathFormSchema } from "../../../hooks.schema/forms";
import { Create } from "./_Create";
import { Delete } from "./_Delete";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants.common/queryKeys";
import api from "../../../api.common";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";

export const Details = () => {
	const definitionPathFormSchema = useDefinitionPathFormSchema();
	const pathFeatures = usePathFeatures();
	const queryClient = useQueryClient();
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	const handleClose = (
		event: KeyboardEvent<HTMLElement>,
		setActiveRow: Dispatch<SetStateAction<Key | undefined>>,
	) => {
		if (event.code === "Escape") {
			setActiveRow(undefined);
		}

		return;
	};

	return (
		<>
			<Table
				actions={(data, options) => {
					if (!(permissions?.edit || permissions?.admin)) {
						return {};
					}

					const activeID = options.activeRow.current;

					return {
						inline: [
							<EditableInlineInputForm
								defaultValues={{
									description: data.Description,
								}}
								formId={`path-feature${data.ID}`}
								inputId={data.ID}
								onReset={() => {
									options.activeRow.set(undefined);
								}}
								schema={definitionPathFormSchema}
								visible={activeID === data.ID}
							/>,
						],
						menu: !activeID
							? [
									{
										step: (data) =>
											!data.System && (
												<button
													type="button"
													onClick={() => {
														options.activeRow.set(
															data.ID,
														);
													}}
												>
													{t("editPathFeature")}
												</button>
											),
									},
									{
										step: <Delete pathFeature={data} />,
									},
								]
							: undefined,
						interactionIntent: async () => {
							const occasionsUsedQueryData =
								await queryClient.fetchQuery({
									queryKey: [
										QUERY_KEYS.settings_machining_process_definitions_path_feature_in_use,
										data.ID?.toString(),
									],
									queryFn: async () =>
										await api.getPathFeatureOccasionsUsed(
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
						label: t("description"),
						template: (data, options) => (
							<EditableInlineInput
								defaultElement={<>{data.Description}</>}
								inputForm={`path-feature${data.ID}`}
								inputName="description"
								isActive={options.activeRow.current === data.ID}
								itemId={data.ID}
								onKeyDown={(event) =>
									handleClose(event, options.activeRow.set)
								}
							/>
						),
					},
					{
						label: t("system"),
						width: "10%",
						template: (data) => <>{data.System ? "Yes" : "No"}</>,
					},
				]}
				data={pathFeatures}
				rows={{
					context: EditableInlineProvider,
				}}
				tableClassName="table--border"
			/>
			{(permissions?.edit || permissions?.admin) && (
				<div className="mt-6">
					<Create />
				</div>
			)}
		</>
	);
};
