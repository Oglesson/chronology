import { Dispatch, Key, KeyboardEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "../../components/common/tooltip/Tooltip";
import { EditableInlineProvider } from "../../components/edit/EditableInlineContext";
import { EditableInlineInput } from "../../components/edit/EditableInlineInput";
import { EditableInlineInputForm } from "../../components/edit/EditableInlineInputForm";
import { Table } from "../../components/table/Table";
import Icons from "../../config.common/Icons";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import { useMachiningAmendments } from "../../hooks.queries/useMachiningAmendments";
import { useAmendmentsFormSchema } from "../../hooks.schema/forms";
import { RenderIcon } from "../../utilities.common/RenderIcon";

export const Amendments = () => {
	const amendmentsFormSchema = useAmendmentsFormSchema();
	const machiningAmendments = useMachiningAmendments();

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
		<div>
			<Table
				actions={(data, options) => {
					const activeID = options.activeRow.current;
					return {
						inline: [
							<EditableInlineInputForm
								defaultValues={{
									speedRatio: data.SpeedRatio,
									distance: data.Distance,
								}}
								formId={`machining-amendment${data.ID}`}
								identifier={
									FORM_IDENTIFIERS.updateMachiningAmendment
								}
								inputId={data.ID}
								onReset={() => {
									options.activeRow.set(undefined);
								}}
								schema={amendmentsFormSchema}
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
														data.ID
													);
												}}
											>
												{t("editAmendment")}
											</button>
										),
									},
							  ]
							: undefined,
					};
				}}
				columns={[
					{
						accessor: "Description",
						label: t("description"),
						width: "60%",
						template: (data) => (
							<>{data.Description.replace("*_", "")}</>
						),
					},
					{
						label: `${t("speed")} %`,
						alignHorizontal: "right",
						template: (data, options) => (
							<EditableInlineInput
								autoFocus={true}
								defaultElement={<span>{data.SpeedRatio}</span>}
								inputForm={`machining-amendment${data.ID}`}
								inputName="speedRatio"
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
						label: (
							<div className="flex items-center">
								<span className="block mr-3">{t("cm")}</span>
								<Tooltip
									content={t(
										"tooltipSystemMachiningAmendmentsCm"
									)}
								>
									<RenderIcon icon={Icons.Interface.Info} />
								</Tooltip>
							</div>
						),
						alignHorizontal: "right",
						template: (data, options) => (
							<EditableInlineInput
								defaultElement={
									<span>{data.Distance.toFixed(2)}</span>
								}
								inputForm={`machining-amendment${data.ID}`}
								inputName="distance"
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
				data={machiningAmendments.filter((m) => m.Description !== "*_")}
				rows={{
					context: EditableInlineProvider,
				}}
				tableClassName="table--border"
			/>
		</div>
	);
};
