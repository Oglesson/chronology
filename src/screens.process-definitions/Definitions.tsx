import { useQueryClient } from "@tanstack/react-query";
import { createContext } from "react";
import { useTranslation } from "react-i18next";
import api from "../api.common";
import { QUERY_KEYS } from "../constants.common/queryKeys";
import { useRerender } from "../hooks.common/useRerender";
import { useToggle } from "../hooks.common/useToggle";
import { useProcessDefinitions } from "../hooks.queries/useProcessDefinitions";
import { Delete } from "../screens.process-definition/definition.index/partials/_Delete";
import { Create } from "./partials/_Create";
import { usePermissionsContext } from "../hooks.common/usePermissionsContext";
import { Copy } from "../screens.process-definition/definition.index/partials/_Copy";
import { SearchableTable } from "../components/table/SearchableTable";

type ModalContext = {
	openModal: boolean;
	setOpenModal: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ModalContext = createContext<ModalContext>({
	openModal: false,
	setOpenModal: () => {},
});

export const Definitions = () => {
	const rerender = useRerender();
	const queryClient = useQueryClient();
	const { processDefinitions } = useProcessDefinitions();
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	return (
		<ModalContext.Provider value={{ openModal, setOpenModal }}>
			<SearchableTable
				data={processDefinitions}
				strategy="includes"
				actions={(data) => {
					return {
						interactionIntent: async () => {
							const occasionsUsedQueryData =
								await queryClient.fetchQuery({
									queryKey: [
										QUERY_KEYS.process_definition_in_use,
										data.ID?.toString(),
									],
									queryFn: async () =>
										await api.getProcessDefinitionOccasionsUsed(
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
						menu: [
							{
								label: t("viewDefinition"),
								url: "/processes/definitions/%%ID%%",
							},
							{
								step: () =>
									(permissions?.edit || permissions?.admin) && (
										<Copy definition={data} />
									),
							},
							{
								step: () =>
									(permissions?.edit || permissions?.admin) && (
										<Delete definition={data} />
									),
							},
						],
					};
				}}
				columns={[
					{
						accessor: "Code",
						label: t("name"),
						sortable: true,
						sortOrder: "asc",
						searchable: true,
					},
					{
						label: t("type"),
						template: (data) => (
							<>
								{data.Handling
									? t("handling", {
											defaultValue: "Handling",
										})
									: t("task", {
											defaultValue: "Task",
										})}
							</>
						),
					},
				]}
				rows={{
					link: {
						label: t("viewDefinition"),
						url: "/processes/definitions/%%ID%%",
					},
				}}
			/>

			{(permissions?.edit || permissions?.admin) && (
				<div className="mt-6">
					<Create />
				</div>
			)}
		</ModalContext.Provider>
	);
};
