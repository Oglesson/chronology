import { QueryClient } from "@tanstack/react-query";
import { Params } from "react-router-dom";
import { processDefinitionCategoriesQuery } from "../../queries.common/processDefinitionCategoriesQuery";
import { processDefinitionQuery } from "../../queries.common/processDefinitionQuery";

export const processDefinitionLoader =
	(queryClient: QueryClient) =>
	async ({ params }: { params: Params }) => {
		const result = await getProcessDefinitionData(queryClient, params);
		return { result };
	};

const getProcessDefinitionData = async (
	queryClient: QueryClient,
	params: Params
) => {
	const processDefinitionQueryData = await getProcessDefinitionQueryData(
		queryClient,
		params
	);
	const processDefinitionCategoriesQueryData =
		await getProcessDefinitionCategoriesQueryData(queryClient);

	return {
		definition: processDefinitionQueryData,
		definitionCategories: processDefinitionCategoriesQueryData,
	};
};

const getProcessDefinitionQueryData = async (
	queryClient: QueryClient,
	params: Params
) => {
	const query = processDefinitionQuery(params.id as string);

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
