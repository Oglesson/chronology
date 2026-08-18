import { Dispatch, Key, KeyboardEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { EditableInlineProvider } from "../../../components/edit/EditableInlineContext";
import { EditableInlineInput } from "../../../components/edit/EditableInlineInput";
import { EditableInlineInputForm } from "../../../components/edit/EditableInlineInputForm";
import { Table } from "../../../components/table/Table";
import { useMachiningStepsSettings } from "../../../hooks.queries/useMachiningStepsSettings";
import { useMachiningFeedRateFieldSchema } from "../../../hooks.schema/fields";

export const MachiningStepsSettings = () => {
	const machiningFeedRateFieldSchema = useMachiningFeedRateFieldSchema();
	const machiningStepsSettings = useMachiningStepsSettings();
	const { t } = useTranslation();

	const handleClose = (
		event: KeyboardEvent<HTMLElement>,
		setActiveRow: Dispatch<SetStateAction<Key | undefined>>
	) => {
		if (event.code === "Escape") {
			setActiveRow(undefined);
		}

		return;
	};

	return (
		<Table
			actions={(data, options) => {
				const activeID = options.activeRow.current;
				return {
					inline: [
						<EditableInlineInputForm
							defaultValues={{
								machiningFeedRate: data.MachiningFeedRate,
							}}
							formId={`machining-step-setting${data.ID}`}
							inputId={data.ID}
							onReset={() => {
								options.activeRow.set(undefined);
							}}
							schema={machiningFeedRateFieldSchema}
							visible={activeID === data.ID}
						/>,
					],
					menu: !activeID
						? [
								{
									step: (data) => (
										<button
											type="button"
											onClick={() => {
												options.activeRow.set(data.ID);
											}}
										>
											{t("editMachiningStepSetting")}
										</button>
									),
								},
						  ]
						: undefined,
				};
			}}
			columns={[
				{
					accessor: "Code",
					label: t("code"),
					width: "15%",
					sortOrder: "asc",
				},
				{
					accessor: "Description",
					label: t("description"),
					width: "50%",
				},
				{
					accessor: "MachiningFeedRate",
					label: t("cm/s"),
					width: "10%",
					template: (data, options) => (
						<EditableInlineInput
							defaultElement={
								<span>{data.MachiningFeedRate}</span>
							}
							inputForm={`machining-step-setting${data.ID}`}
							inputName="machiningFeedRate"
							inputType="number"
							isActive={options.activeRow.current === data.ID}
							itemId={data.ID}
							onKeyDown={(event) =>
								handleClose(event, options.activeRow.set)
							}
						/>
					),
					alignHorizontal: "right",
				},
			]}
			data={machiningStepsSettings}
			rows={{
				context: EditableInlineProvider,
			}}
		/>
	);
};
