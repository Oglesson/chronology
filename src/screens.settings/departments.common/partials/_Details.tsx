import { Dispatch, Key, KeyboardEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { EditableInlineProvider } from "../../../components/edit/EditableInlineContext";
import { EditableInlineInput } from "../../../components/edit/EditableInlineInput";
import { EditableInlineInputForm } from "../../../components/edit/EditableInlineInputForm";
import { Table } from "../../../components/table/Table";
import { useDepartments } from "../../../hooks.queries/useDepartments";
import { useDepartmentsFormSchema } from "../../../hooks.schema/forms";
import { Create } from "./_Create";
import { Delete } from "./_Delete";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants.common/queryKeys";
import api from "../../../api.common";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";
import { DepartmentData } from "../../../api.common/types";
import { TableOptionProps } from "../../../components/table/Table";

type DepartmentRowFormProps = {
	data: DepartmentData;
	options: TableOptionProps<DepartmentData>;
	departments: DepartmentData[];
};

const DepartmentRowForm = ({ data, options, departments }: DepartmentRowFormProps) => {
	const schema = useDepartmentsFormSchema(departments, data.ID);
	return (
		<EditableInlineInputForm
			defaultValues={{
				batchSize: data.BatchSize,
				description: data.Description,
				departmentNumber: data.No,
			}}
			formId={`department${data.ID}`}
			inputId={data.ID}
			onReset={() => {
				options.activeRow.set(undefined);
			}}
			schema={schema}
			visible={options.activeRow.current === data.ID}
		/>
	);
};

export const Details = () => {
	const { departments } = useDepartments();
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
					const activeID = options.activeRow.current;
					return {
						inline: [
							<DepartmentRowForm
								data={data}
								options={options}
								departments={departments}
							/>,
						],
						menu: !activeID
							? [
									{
										step: (permissions?.edit || permissions?.admin) && (
											<button
												type="button"
												onClick={() => {
													options.activeRow.set(
														data.ID,
													);
												}}
											>
												{t("editDepartment")}
											</button>
										),
									},
									{
										step: (permissions?.edit || permissions?.admin) && (
											<Delete department={data} />
										),
									},
								]
							: undefined,
						interactionIntent: async () => {
							const occasionsUsedQueryData =
								await queryClient.fetchQuery({
									queryKey: [
										QUERY_KEYS.settings_department_in_use,
										data.ID?.toString(),
									],
									queryFn: async () =>
										await api.getDepartmentOccasionsUsed(
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
								inputForm={`department${data.ID}`}
								inputName="departmentNumber"
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
									inputForm={`department${data.ID}`}
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
						label: t("batchSize"),
						width: "10%",
						template: (data, options) => (
							<EditableInlineInput
								defaultElement={<span>{data.BatchSize}</span>}
								inputForm={`department${data.ID}`}
								inputName="batchSize"
								inputType="number"
								isActive={options.activeRow.current === data.ID}
								itemId={data.ID}
								onKeyDown={(event) =>
									handleClose(event, options.activeRow.set)
								}
							/>
						),
					},
				]}
				data={departments}
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
