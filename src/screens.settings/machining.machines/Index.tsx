import { Dispatch, Key, KeyboardEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { EditableInlineProvider } from "../../components/edit/EditableInlineContext";
import { EditableInlineInput } from "../../components/edit/EditableInlineInput";
import { EditableInlineInputForm } from "../../components/edit/EditableInlineInputForm";
import { Table } from "../../components/table/Table";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import { useDepartments } from "../../hooks.queries/useDepartments";
import { useMachines } from "../../hooks.queries/useMachines";
import { useMachineFormSchema } from "../../hooks.schema/forms";
import { Create } from "./partials/_Create";
import { Delete } from "./partials/_Delete";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import api from "../../api.common";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { MachineData } from "../../api.common/types";
import { TableOptionProps } from "../../components/table/Table";

const MachineEditForm = ({
	data,
	machineCodes,
	options,
	activeID,
}: {
	data: MachineData;
	machineCodes: string[];
	options: TableOptionProps<MachineData>;
	activeID: Key | undefined;
}) => {
	const schema = useMachineFormSchema(machineCodes, data.Code);
	return (
		<EditableInlineInputForm
			action=""
			defaultValues={{
				code: data.Code,
				description: data.Description,
				departmentId: data.DepartmentID ?? "null",
			}}
			formId={`machine${data.ID}`}
			identifier={FORM_IDENTIFIERS.updateMachine}
			inputId={data.ID}
			onReset={() => {
				options.activeRow.set(undefined);
			}}
			schema={schema}
			visible={activeID === data.ID}
		/>
	);
};

export const Machines = () => {
	const { machines, machineCodes } = useMachines();
	const { departmentOptionsWithNone } = useDepartments();
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
							<MachineEditForm
								data={data}
								machineCodes={machineCodes}
								options={options}
								activeID={activeID}
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
												{t("editMachine")}
											</button>
										),
									},
									{
										step: <Delete machine={data} />,
									},
								]
							: undefined,
						interactionIntent: async () => {
							const occasionsUsedQueryData =
								await queryClient.fetchQuery({
									queryKey: [
										QUERY_KEYS.settings_machining_machine_in_use,
										data.ID?.toString(),
									],
									queryFn: async () =>
										await api.getMachineOccasionsUsed(
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
						width: "15%",
						template: (
							data: MachineData,
							options: TableOptionProps<MachineData>,
						) => (
							<EditableInlineInput
								autoFocus
								defaultElement={<>{data.Code}</>}
								inputForm={`machine${data.ID}`}
								inputName="code"
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
						template: (
							data: MachineData,
							options: TableOptionProps<MachineData>,
						) => (
							<EditableInlineInput
								defaultElement={<>{data.Description}</>}
								inputForm={`machine${data.ID}`}
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
						label: t("department"),
						width: "10%",
						template: (
							data: MachineData,
							options: TableOptionProps<MachineData>,
						) => (
							<EditableInlineInput
								defaultElement={
									<span className="w-[12rem]">
										{data._Department?.Description ||
											t("none")}
									</span>
								}
								defaultValue={departmentOptionsWithNone}
								inputForm={`machine${data.ID}`}
								inputName="departmentId"
								inputType="select"
								isActive={options.activeRow.current === data.ID}
								itemId={data.ID}
								onKeyDown={(event) =>
									handleClose(event, options.activeRow.set)
								}
								selectedValue={data.DepartmentID}
							/>
						),
					},
				]}
				data={machines}
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
