import { QueryClient } from "@tanstack/react-query";
import { Params } from "react-router-dom";
import { departmentSettingsQuery } from "../../queries.common/departmentSettingsQuery";
import { machinesQuery } from "../../queries.common/machinesQuery";
import { processCategoriesQuery } from "../../queries.common/processCategoriesQuery";
import { processDefinitionCategoriesQuery } from "../../queries.common/processDefinitionCategoriesQuery";
import { processQuery } from "../../queries.common/processQuery";

export const processLoader =
	(queryClient: QueryClient) =>
	async ({ params }: { params: Params }) => {
		const result = await getData(queryClient, params);

		return { result };
	};

const getData = async (queryClient: QueryClient, params: Params) => {
	const processQueryData = await getProcessQueryData(queryClient, params);
	const departmentsQueryData = await getDepartmentsQueryData(queryClient);
	const processCategoriesQueryData = await getProcessCategoriesQueryData(
		queryClient
	);

	await getProcessDefinitionCategoriesQueryData(queryClient);
	await getMachinesQueryData(queryClient);

	return {
		process: processQueryData,
		departments: departmentsQueryData,
		categories: processCategoriesQueryData,
	};
};

const getProcessQueryData = async (
	queryClient: QueryClient,
	params: Params
) => {
	const query = processQuery(params.id as string);

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getProcessDefinitionCategoriesQueryData = async (
	queryClient: QueryClient
) => {
	const query = processDefinitionCategoriesQuery();

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

const getProcessCategoriesQueryData = async (queryClient: QueryClient) => {
	const query = processCategoriesQuery();

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
