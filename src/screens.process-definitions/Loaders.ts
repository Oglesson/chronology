import { QueryClient } from "@tanstack/react-query";
import { processDefinitionsQuery } from "../queries.common/processDefinitionsQuery";

export const processDefinitionsLoader =
	(queryClient: QueryClient) => async () => {
		const result = await getData(queryClient);

		return { result };
	};

const getData = async (queryClient: QueryClient) => {
	const processDefinitionsQueryData =
		await getProcessDefinitionsQueryData(queryClient);

	return {
		definitions: processDefinitionsQueryData,
	};
};

const getProcessDefinitionsQueryData = async (queryClient: QueryClient) => {
	const query = processDefinitionsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
