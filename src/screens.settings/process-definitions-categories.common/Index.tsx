import { useTranslation } from "react-i18next";
import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import { Dispatch, Key, KeyboardEvent, SetStateAction } from "react";
import { EditableInlineProvider } from "../../components/edit/EditableInlineContext";
import { EditableInlineInput } from "../../components/edit/EditableInlineInput";
import { EditableInlineInputForm } from "../../components/edit/EditableInlineInputForm";
import { Table } from "../../components/table/Table";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import { useProcessDefinitionCategories } from "../../hooks.queries/useProcessDefinitionCategories";
import { useProcessDefinitionCategoryFormSchema } from "../../hooks.schema/forms";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";

export const ProcessDefinitionCategories = () => {
	const categories = useProcessDefinitionCategories();
	const processDefinitionCategoryFormSchema =
		useProcessDefinitionCategoryFormSchema();
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
		<AwaitLoaderData>
			<Table
				actions={(data, options) => {
					const activeID = options.activeRow.current;
					return {
						inline: [
							<EditableInlineInputForm
								defaultValues={{
									description: data.Description,
									explanation: data.Explanation,
								}}
								formId={`process-definition-category${data.ID}`}
								identifier={
									FORM_IDENTIFIERS.updateProcessDefinitionCategory
								}
								inputId={data.ID}
								onReset={() => {
									options.activeRow.set(undefined);
								}}
								schema={processDefinitionCategoryFormSchema}
								visible={activeID === data.ID}
							/>,
						],
						menu:
							(permissions?.edit || permissions?.admin) && !activeID
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
													{t("editCategory")}
												</button>
											),
										},
									]
								: undefined,
					};
				}}
				columns={[
					{
						label: t("description"),
						width: "25%",
						template: (data, options) => (
							<EditableInlineInput
								defaultElement={<p>{data.Description}</p>}
								inputForm={`process-definition-category${data.ID}`}
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
						label: t("explanation"),
						template: (data, options) => (
							<EditableInlineInput
								defaultElement={<p>{data.Explanation}</p>}
								inputForm={`process-definition-category${data.ID}`}
								inputName="explanation"
								isActive={options.activeRow.current === data.ID}
								itemId={data.ID}
								onKeyDown={(event) =>
									handleClose(event, options.activeRow.set)
								}
							/>
						),
					},
					{
						accessor: "ColumnType",
						label: t("type"),
						width: 220,
						template: (data) =>
							t(
								data.ColumnType.charAt(2).toLowerCase() +
									data.ColumnType.substring(3),
							),
					},
				]}
				data={categories}
				rows={{
					context: EditableInlineProvider,
				}}
				tableClassName="table--border"
			/>
		</AwaitLoaderData>
	);
};
