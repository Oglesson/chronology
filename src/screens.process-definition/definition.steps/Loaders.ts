import { QueryClient } from "@tanstack/react-query";
import { stepsQuery } from "../../queries.common/stepsQuery";

export const definitionStepsLoader =
	(queryClient: QueryClient) => async () => {
		const result = await getStepsData(queryClient);

		return { result };
	};

const getStepsData = async (queryClient: QueryClient) => {
	const stepsData = await getStepsQueryData(queryClient);

	return {
		steps: stepsData,
	};
};

const getStepsQueryData = async (queryClient: QueryClient) => {
	const query = stepsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
