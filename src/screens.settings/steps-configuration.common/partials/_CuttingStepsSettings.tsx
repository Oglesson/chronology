import { Dispatch, Key, KeyboardEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { EditableInlineProvider } from "../../../components/edit/EditableInlineContext";
import { EditableInlineInput } from "../../../components/edit/EditableInlineInput";
import { EditableInlineInputForm } from "../../../components/edit/EditableInlineInputForm";
import { Table } from "../../../components/table/Table";
import { useCuttingStepsSettings } from "../../../hooks.queries/useCuttingStepsSettings";
import { useInUseFieldSchema } from "../../../hooks.schema/fields";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";

export const CuttingStepsSettings = () => {
	const inUseFieldSchema = useInUseFieldSchema();
	const cuttingStepsSettings = useCuttingStepsSettings();
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
									inUse: data.InUse ? "yes" : "no",
								}}
								formId={`cutting-step-setting${data.ID}`}
								inputId={data.ID}
								onReset={() => {
									options.activeRow.set(undefined);
								}}
								schema={inUseFieldSchema}
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
													options.activeRow.set(
														data.ID,
													);
												}}
											>
												{t("editCuttingStepSetting")}
											</button>
										),
									},
								]
							: undefined,
					};
				}}
				columns={[
					{
						accessor: "_Step.Code",
						label: t("code"),
						width: "15%",
						sortOrder: "asc",
					},
					{
						accessor: "_Step.Description",
						label: t("description"),
						width: "50%",
					},
					{
						accessor: "Reason",
						label: t("material"),
						width: "50%",
						template: (data) => {
							switch (
								Array.from<string>(data.Reason)[0].toLowerCase()
							) {
								case "l":
									return <span>Natural</span>;
								case "s":
									return <span>Synthetic</span>;
							}
						},
					},
					{
						accessor: "InUse",
						label: t("use"),
						width: "10%",
						template: (data, options) => (
							<EditableInlineInput
								defaultElement={
									<span>
										{data.InUse ? t("yes") : t("no")}
									</span>
								}
								inputForm={`cutting-step-setting${data.ID}`}
								inputName="inUse"
								inputType="select"
								defaultValue={[
									{ label: "Yes", value: "yes" },
									{ label: "No", value: "no" },
								]}
								isActive={options.activeRow.current === data.ID}
								itemId={data.ID}
								onKeyDown={(event) =>
									handleClose(event, options.activeRow.set)
								}
								selectedValue={data.InUse ? "yes" : "no"}
							/>
						),
					},
				]}
				data={cuttingStepsSettings}
				rows={{
					context: EditableInlineProvider,
				}}
			/>
		</>
	);
};
