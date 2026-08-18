import { QueryClient } from "@tanstack/react-query";
import { pathFeaturesQuery } from "../../queries.common/pathFeaturesQuery";

export const pathsLoader = (queryClient: QueryClient) => async () => {
	const result = await getPathsData(queryClient);

	return { result };
};

const getPathsData = async (queryClient: QueryClient) => {
	const pathsQueryData = await getPathsQueryData(queryClient);

	return {
		paths: pathsQueryData,
	};
};

const getPathsQueryData = async (queryClient: QueryClient) => {
	const query = pathFeaturesQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
