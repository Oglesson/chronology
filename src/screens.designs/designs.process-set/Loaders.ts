import { QueryClient } from "@tanstack/react-query";
import { Params } from "react-router-dom";
import { departmentSettingsQuery } from "../../queries.common/departmentSettingsQuery";
import { processSetQuery } from "../../queries.common/processSetQuery";
import { processesQuery } from "../../queries.common/processesQuery";

export const processSetLoader =
	(queryClient: QueryClient) =>
	async ({ params }: { params: Params }) => {
		const result = await getProcessSetData(queryClient, params);

		return { result };
	};

const getProcessSetData = async (
	queryClient: QueryClient,
	params: Params
) => {
	const processSetQueryData = await getProcessSetQueryData(
		queryClient,
		params
	);
	const departmentsQueryData = await getDepartmentsQueryData(queryClient);
	const processesQueryData = await getProcesssQueryData(queryClient);

	return {
		departments: departmentsQueryData,
		processSet: processSetQueryData,
		processes: processesQueryData,
	};
};

const getProcessSetQueryData = async (
	queryClient: QueryClient,
	params: Params
) => {
	const query = processSetQuery(params.id as string);

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getDepartmentsQueryData = async (queryClient: QueryClient) => {
	const query = departmentSettingsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getProcesssQueryData = async (queryClient: QueryClient) => {
	const query = processesQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
