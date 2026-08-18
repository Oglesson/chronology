import { QueryClient } from "@tanstack/react-query";
import { processesQuery } from "../queries.common/processesQuery";

export const processesLoader = (queryClient: QueryClient) => async () => {
	const result = await getData(queryClient);

	return { result };
};

const getData = async (queryClient: QueryClient) => {
	const processesQueryData = await getProcesssQueryData(queryClient);

	return {
		processes: processesQueryData,
	};
};

const getProcesssQueryData = async (queryClient: QueryClient) => {
	const query = processesQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
