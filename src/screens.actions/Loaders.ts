import { QueryClient } from "@tanstack/react-query";
import { actionsQuery } from "../queries.common/actionsQuery";

export const actionsLoader = (queryClient: QueryClient) => async () => {
	const result = await getActionsData(queryClient);

	return { result };
};

const getActionsData = async (queryClient: QueryClient) => {
	const actionsQueryData = await getActionsQueryData(queryClient);

	return {
		actions: actionsQueryData,
	};
};

const getActionsQueryData = async (queryClient: QueryClient) => {
	const query = actionsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
