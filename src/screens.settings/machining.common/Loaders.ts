import { QueryClient } from "@tanstack/react-query";
import { departmentSettingsQuery } from "../../queries.common/departmentSettingsQuery";
import { machinesQuery } from "../../queries.common/machinesQuery";
import { machiningAmendmentsQuery } from "../../queries.common/machiningAmendmentsQuery";
import { processDefinitionsMachiningQuery } from "../../queries.common/processDefinitionsMachiningQuery";
import { stitchingCharacteristicsQuery } from "../../queries.common/stitchingCharacteristicsQuery";
import { stitchingModifiersQuery } from "../../queries.common/stitchingModifiersQuery";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import { systemStitchingModifiersQuery } from "../../queries.common/systemStitchingModifiersQuery";

export const machiningLoader = (queryClient: QueryClient) => async () => {
	const result = await getMachiningData(queryClient);

	return { result };
};

const getMachiningData = async (queryClient: QueryClient) => {
	const isAdmin = await queryClient.getQueryData([
		QUERY_KEYS.is_admin,
	]);

	const departmentQueryData = await getDepartmentSettingsQueryData(
		queryClient
	);
	const machinesQueryData = await getMachinesQueryData(queryClient);
	const processDefinitionsMachiningQueryData =
		await getProcessDefinitionsMachiningQueryData(queryClient);
	const systemStitchingModifiersQueryData =
		await getSystemStitchingModifiersQueryData(queryClient);

	const ret = {
		departments: departmentQueryData,
		machines: machinesQueryData,
		machiningAmendments: {},
		processDefinitionsMachining: processDefinitionsMachiningQueryData,
		stitchingCharacteristics: {},
		stitchingModifiers: {},
		systemStitchingModifiers: systemStitchingModifiersQueryData,
	};

	if (isAdmin) {
		const machiningAmendmentsQueryData =
			await getMachiningAmendmentsQueryData(queryClient);
		const stitchingCharacteristicsQueryData =
			await getStitchingCharacteristicsQueryData(queryClient);
		const stitchingModifiersQueryData =
			await getStitchingModifiersQueryData(queryClient);

		ret.machiningAmendments = machiningAmendmentsQueryData;
		ret.stitchingCharacteristics = stitchingCharacteristicsQueryData;
		ret.stitchingModifiers = stitchingModifiersQueryData;
	}

	return ret;
};

const getDepartmentSettingsQueryData = async (queryClient: QueryClient) => {
	const query = departmentSettingsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getMachinesQueryData = async (queryClient: QueryClient) => {
	const query = machinesQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getMachiningAmendmentsQueryData = async (queryClient: QueryClient) => {
	const query = machiningAmendmentsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getProcessDefinitionsMachiningQueryData = async (
	queryClient: QueryClient
) => {
	const query = processDefinitionsMachiningQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getStitchingCharacteristicsQueryData = async (
	queryClient: QueryClient
) => {
	const query = stitchingCharacteristicsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getStitchingModifiersQueryData = async (queryClient: QueryClient) => {
	const query = stitchingModifiersQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getSystemStitchingModifiersQueryData = async (
	queryClient: QueryClient
) => {
	const query = systemStitchingModifiersQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
