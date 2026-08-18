import { QueryClient } from "@tanstack/react-query";
import { processDefinitionCategoriesQuery } from "../../queries.common/processDefinitionCategoriesQuery";

export const processDefinitionCategoriesLoader =
	(queryClient: QueryClient) => async () => {
		const result = await getData(queryClient);

		return { result };
	};

const getData = async (queryClient: QueryClient) => {
	const processDefinitionCategoriesQueryData =
		await getProcessDefinitionCategoriesQueryData(queryClient);

	return {
		definitionCategories: processDefinitionCategoriesQueryData,
	};
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
