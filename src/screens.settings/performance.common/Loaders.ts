import { QueryClient } from "@tanstack/react-query";
import { generalSettingsQuery } from "../../queries.common/generalSettingsQuery";

export const performanceLoader = (queryClient: QueryClient) => async () => {
	const result = await getPerformanceData(queryClient);

	return { result };
};

const getPerformanceData = async (queryClient: QueryClient) => {
	const performanceQueryData = await getPerformanceQueryData(queryClient);

	return {
		performance: performanceQueryData,
	};
};

const getPerformanceQueryData = async (queryClient: QueryClient) => {
	const query = generalSettingsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
