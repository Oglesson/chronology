import { Dispatch, Key, KeyboardEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { EditableField } from "../../../components/edit/EditableField";
import { EditableInlineProvider } from "../../../components/edit/EditableInlineContext";
import { EditableInlineInput } from "../../../components/edit/EditableInlineInput";
import { EditableInlineInputForm } from "../../../components/edit/EditableInlineInputForm";
import { Table, TableOptionProps } from "../../../components/table/Table";
import { useGeneralSettings } from "../../../hooks.queries/useGeneralSettings";
import { useGrades } from "../../../hooks.queries/useGrades";
import { useGradeFormSchema } from "../../../hooks.schema/forms";
import { Create } from "./_Create";
import { Delete } from "./_Delete";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants.common/queryKeys";
import api from "../../../api.common";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";
import { GradeData } from "../../../api.common/types";

const GradeEditForm = ({
	data,
	gradeCodes,
	options,
	activeID,
}: {
	data: GradeData;
	gradeCodes: string[];
	options: TableOptionProps<GradeData>;
	activeID: Key | undefined;
}) => {
	const schema = useGradeFormSchema(gradeCodes, data.Code);
	return (
		<EditableInlineInputForm
			defaultValues={{
				code: data.Code,
				ratePerMinute: data.Rate,
			}}
			formId={`grade${data.ID}`}
			inputId={data.ID}
			onReset={() => {
				options.activeRow.set(undefined);
			}}
			schema={schema}
			visible={activeID === data.ID}
		/>
	);
};

export const Details = () => {
	const { gradeCodes } = useGrades();
	const generalSettings = useGeneralSettings();
	const { grades, gradeOptions } = useGrades();
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
		<div className="grid-container gap-y-6">
			<div className="col-span-12 lg:col-span-7">
				<Table
					actions={(data, options) => {
						if (!(permissions?.edit || permissions?.admin)) {
							return {};
						}

						const activeID = options.activeRow.current;

						return {
							inline: [
								<GradeEditForm
									data={data}
									gradeCodes={gradeCodes}
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
													{t("editGrade")}
												</button>
											),
										},
										{
											step: <Delete grade={data} />,
										},
									]
								: undefined,
							interactionIntent: async () => {
								const occasionsUsedQueryData =
									await queryClient.fetchQuery({
										queryKey: [
											QUERY_KEYS.settings_grade_in_use,
											data.ID?.toString(),
										],
										queryFn: async () =>
											await api.getGradeOccasionsUsed(
												Number(data.ID),
											),
										staleTime: 1000 * 60,
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
							width: "50%",
							sortable: true,
							sortOrder: "asc",
							accessor: "Code",
							template: (
								data: GradeData,
								options: TableOptionProps<GradeData>,
							) => (
								<EditableInlineInput
									autoFocus
									defaultElement={<>{data.Code}</>}
									inputForm={`grade${data.ID}`}
									inputName="code"
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
							),
						},
						{
							label: t("ratePerMinute"),
							alignHorizontal: "right",
							width: "20%",
							template: (
								data: GradeData,
								options: TableOptionProps<GradeData>,
							) => (
								<EditableInlineInput
									defaultElement={<>{data.Rate}</>}
									inputForm={`grade${data.ID}`}
									inputName="ratePerMinute"
									inputType="number"
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
							),
						},
					]}
					data={grades}
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
			</div>
			<div className="col-span-12 lg:col-span-5">
				<EditableField
					defaultElement={
						<p className="typo-h4 max-w-[15.3rem]">
							{generalSettings?._DefaultGrade?.Code}
						</p>
					}
					defaultValue={gradeOptions ?? []}
					disableEdit={!(permissions?.edit || permissions?.admin)}
					inputName="defaultGradeId"
					inputType="select"
					label={t("defaultGrade")}
					selectedValue={generalSettings?._DefaultGrade?.ID}
				/>
			</div>
		</div>
	);
};
