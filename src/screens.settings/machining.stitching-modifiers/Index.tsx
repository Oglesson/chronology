import { Dispatch, Key, KeyboardEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { EditableInlineProvider } from "../../components/edit/EditableInlineContext";
import { EditableInlineInput } from "../../components/edit/EditableInlineInput";
import { EditableInlineInputForm } from "../../components/edit/EditableInlineInputForm";
import { Table } from "../../components/table/Table";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import { useStitchingModifiers } from "../../hooks.queries/useStitchingModifiers";
import { useStitchingModifierFormSchema } from "../../hooks.schema/forms";
import { Create } from "./partials/_Create";
import { Delete } from "./partials/_Delete";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import api from "../../api.common";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";

export const StitchingModifiers = () => {
	const stitchingModifierFormSchema = useStitchingModifierFormSchema();
	const { stitchingModifiers } = useStitchingModifiers();
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
									no: data.No,
									description: data.Description,
									effectLevel: data.EffectLevel,
									modifier: data.Modifier,
								}}
								formId={`stitching-modifier${data.ID}`}
								identifier={
									FORM_IDENTIFIERS.updateStitchingModifier
								}
								inputId={data.ID}
								onReset={() => {
									options.activeRow.set(undefined);
								}}
								schema={stitchingModifierFormSchema}
								visible={activeID === data.ID}
							/>,
						],
						menu: !activeID
							? [
									{
										step: (
											<button
												type="button"
												onClick={() => {
													options.activeRow.set(
														data.ID,
													);
												}}
											>
												{t("editStitchingModifier")}
											</button>
										),
									},
									{
										step: (
											<Delete stitchingModifier={data} />
										),
									},
								]
							: undefined,
						interactionIntent: async () => {
							const occasionsUsedQueryData =
								await queryClient.fetchQuery({
									queryKey: [
										QUERY_KEYS.settings_machining_stitching_modifier_in_use,
										data.ID?.toString(),
									],
									queryFn: async () =>
										await api.getStitchingModifierOccasionsUsed(
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
						label: t("number"),
						width: "15%",
						template: (data, options) => (
							<EditableInlineInput
								autoFocus
								defaultElement={<>{data.No}</>}
								inputForm={`stitching-modifier${data.ID}`}
								inputName="no"
								inputType="number"
								isActive={options.activeRow.current === data.ID}
								itemId={data.ID}
								onKeyDown={(event) =>
									handleClose(event, options.activeRow.set)
								}
							/>
						),
					},
					{
						label: t("description"),
						width: "50%",
						template: (data, options) => (
							<>
								<EditableInlineInput
									defaultElement={<>{data.Description}</>}
									inputForm={`stitching-modifier${data.ID}`}
									inputName="description"
									inputType="text"
									isActive={
										options.activeRow.current === data.ID
									}
									itemId={data.ID}
									onKeyDown={(event) =>
										handleClose(
											event,
											options.activeRow.set,
										)
									}
								/>
							</>
						),
					},
					{
						label: t("modifier"),
						width: "15%",
						alignHorizontal: "right",
						template: (data, options) => (
							<EditableInlineInput
								autoFocus
								defaultElement={<span>{data.Modifier}</span>}
								inputForm={`stitching-modifier${data.ID}`}
								inputName="modifier"
								inputType="number"
								isActive={options.activeRow.current === data.ID}
								itemId={data.ID}
								onKeyDown={(event) =>
									handleClose(event, options.activeRow.set)
								}
								alignHorizontal="right"
							/>
						),
					},
					{
						label: t("effectLevel"),
						width: "15%",
						alignHorizontal: "right",
						template: (data, options) => (
							<EditableInlineInput
								autoFocus
								defaultElement={<span>{data.EffectLevel}</span>}
								inputForm={`stitching-modifier${data.ID}`}
								inputName="effectLevel"
								inputType="number"
								isActive={options.activeRow.current === data.ID}
								itemId={data.ID}
								onKeyDown={(event) =>
									handleClose(event, options.activeRow.set)
								}
								alignHorizontal="right"
							/>
						),
					},
				]}
				data={stitchingModifiers}
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
