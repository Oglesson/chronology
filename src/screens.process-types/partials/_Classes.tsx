import { useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api.common";
import { ProcessClassData } from "../../api.common/types";
import { Table } from "../../components/table/Table";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import { useRerender } from "../../hooks.common/useRerender";
import { useProcessTypes } from "../../hooks.queries/useProcessTypes";
import { CreateType } from "./_CreateType";
import { DeleteClass } from "./_DeleteClass";
import { DeleteType } from "./_DeleteType";
import { EditClass } from "./_EditClass";
import { EditType } from "./_EditType";
import { ProcessTypeContext } from "./_ProcessTypeContext";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { Tooltip } from "../../components/common/tooltip/Tooltip";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import Icons from "../../config.common/Icons";
import { SearchableAccordionList } from "../../components/accordion/SearchableAccordionList";

export const Classes = () => {
	const {
		setDeleteClassId,
		setDeleteClassName,
		setEditClassData,
		setOpenDeleteClassModal,
		setOpenEditClassModal,
		setEditTypeClassId,
		setEditTypeData,
		setOpenEditTypeModal,
		setDeleteTypeId,
		setDeleteTypeName,
		setOpenDeleteTypeModal,
	} = useContext(ProcessTypeContext);
	const rerender = useRerender();
	const queryClient = useQueryClient();
	const { groupedProcessTypes, processClasses } = useProcessTypes();
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	if (!groupedProcessTypes) {
		return <></>;
	}

	const accordionContent = (c: ProcessClassData) => {
		const subGroups = groupedProcessTypes[c.Description];

		return (
			<>
				{subGroups && <h5 className="typo-h5 mb-8">Types</h5>}

				<Table
					actions={(data) => {
						return {
							menu: [
								{
									step: (permissions?.edit || permissions?.admin) && (
										<button
											type="button"
											onClick={() => {
												setEditTypeClassId(
													Number(c.ID),
												);
												setEditTypeData(data);
												setOpenEditTypeModal();
											}}
										>
											{t("editType")}
										</button>
									),
								},
								{
									step: (permissions?.edit || permissions?.admin) && (
										<button
											type="button"
											onClick={() => {
												setDeleteTypeId(
													Number(data.ID),
												);
												setDeleteTypeName(
													data.Description,
												);
												setOpenDeleteTypeModal();
											}}
											disabled={data.IsInUse}
										>
											{t("deleteType")}
											{data.IsInUse && (
												<> ({t("inUse")})</>
											)}
										</button>
									),
								},
							],
							interactionIntent: async () => {
								const occasionsUsedQueryData =
									await queryClient.fetchQuery({
										queryKey: [
											QUERY_KEYS.process_type_in_use,
											data.ID?.toString(),
										],
										queryFn: async () =>
											await api.getProcessTypeOccasionsUsed(
												Number(data.ID),
											),
										staleTime: 10000,
									});

								data.OccasionsUsed =
									occasionsUsedQueryData.data.OccasionsUsed;
								data.IsInUse =
									data.OccasionsUsed !== undefined &&
									data.OccasionsUsed > 0;

								rerender({});
							},
						};
					}}
					columns={[
						{
							label: t("description"),
							accessor: "Description",
						},
						{
							label: t("category"),
							accessor: "_Category.Description",
							template: (data) => (
								<>
									{data._Category?.Description ?? (
										<>&ndash;</>
									)}
								</>
							),
						},
						{
							label: t("handlingDefinition"),
							accessor: "_HandlingDefinition.Code",
							template: (data) => (
								<span className="flex gap-2 items-center">
									{data._HandlingDefinition?.Code &&
										data._HandlingDefinition?.InnerIndex ===
											-1 && (
											<Tooltip
												theme="warning"
												content={t(
													"handlingDefinitionWarning",
												)}
											>
												<RenderIcon
													icon={
														Icons.Interface.Warning
													}
													classes="text-in-progress"
												/>
											</Tooltip>
										)}
									{data._HandlingDefinition?.Code ?? (
										<>&ndash;</>
									)}
								</span>
							),
						},
						{
							label: t("taskDefinition"),
							accessor: "_TaskDefinition.Code",
							template: (data) => (
								<>
									{data._TaskDefinition?.Code ||
										new DOMParser().parseFromString(
											"&ndash;",
											"text/html",
										).documentElement.textContent}
								</>
							),
						},
						{
							label: t("defaultItemsCovered"),
							accessor: "DefaultItemsCovered",
							template: (data) =>
								data?.DefaultItemsCovered?.toFixed(2),
							alignHorizontal: "right",
						},
						{
							label: t("rest"),
							accessor: "Rest",
							template: (data) => data?.Rest?.toFixed(2),
							alignHorizontal: "right",
						},
						{
							label: t("contingency"),
							accessor: "Contingency",
							template: (data) => data?.Contingency?.toFixed(2),
							alignHorizontal: "right",
						},
						{
							label: t("groupMember"),
							accessor: "GroupMember",
							template: (data) => (
								<>{data.GroupMember ? t("yes") : t("no")}</>
							),
						},
					]}
					data={subGroups}
					tableClassName="table--border table--header"
				/>
				{(permissions?.edit || permissions?.admin) && <CreateType classId={Number(c.ID)} />}
			</>
		);
	};

	const accordionActions = (c: ProcessClassData) => {
		return {
			interactionIntent: async () => {
				const occasionsUsedQueryData = await queryClient.fetchQuery({
					queryKey: [
						QUERY_KEYS.process_class_in_use,
						c.ID?.toString(),
					],
					queryFn: async () =>
						await api.getProcessClassOccasionsUsed(Number(c.ID)),
					staleTime: 10000,
				});

				c.OccasionsUsed = occasionsUsedQueryData.data.OccasionsUsed;
				c.IsInUse =
					c.OccasionsUsed !== undefined && c.OccasionsUsed > 0;

				rerender({});
			},
			items: [
				{
					step: (permissions?.edit || permissions?.admin) && (
						<button
							type="button"
							onClick={() => {
								setEditClassData(c);
								setOpenEditClassModal();
							}}
						>
							{t("editClass")}
						</button>
					),
				},
				{
					step: (permissions?.edit || permissions?.admin) && (
						<button
							type="button"
							onClick={() => {
								setDeleteClassId(Number(c.ID));
								setDeleteClassName(c.Description);
								setOpenDeleteClassModal();
							}}
							disabled={c.IsInUse}
						>
							{t("deleteClass")}
							{c.IsInUse && <> ({t("inUse")})</>}
						</button>
					),
				},
			],
		};
	};

	return (
		<>
			<SearchableAccordionList
				rowsPerPage={20}
				accordionData={processClasses ?? []}
				summaryField="Description"
				accordionContent={accordionContent}
				actions={accordionActions}
				strategy="includes"
			/>

			{(permissions?.edit || permissions?.admin) && (
				<>
					<EditClass />
					<DeleteClass />
					<EditType />
					<DeleteType />
				</>
			)}
		</>
	);
};
