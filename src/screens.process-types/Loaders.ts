import { QueryClient } from "@tanstack/react-query";
import { processCategoriesQuery } from "../queries.common/processCategoriesQuery";
import { processDefinitionsQuery } from "../queries.common/processDefinitionsQuery";
import { processTypesQuery } from "../queries.common/processTypesQuery";

export const processTypesLoader = (queryClient: QueryClient) => async () => {
	const result = await getData(queryClient);

	return { result };
};

const getData = async (queryClient: QueryClient) => {
	const processDefinitionsQueryData =
		await getProcessDefinitionsQueryData(queryClient);
	const processTypesQueryData = await getProcessTypesQueryData(
		queryClient
	);
	const processCategoriesQueryData = await getProcessCategoriesQueryData(
		queryClient
	);

	return {
		definitions: processDefinitionsQueryData,
		types: processTypesQueryData,
		categories: processCategoriesQueryData,
	};
};

const getProcessDefinitionsQueryData = async (queryClient: QueryClient) => {
	const query = processDefinitionsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getProcessTypesQueryData = async (queryClient: QueryClient) => {
	const query = processTypesQuery();

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
