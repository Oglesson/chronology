import { QueryClient } from "@tanstack/react-query";
import { stepsQuery } from "../../queries.common/stepsQuery";
import { pathFeaturesQuery } from "../../queries.common/pathFeaturesQuery";

export const definitionStepsForPathFeaturesLoader =
	(queryClient: QueryClient) => async () => {
		const result = await getDefinitionStepsForPathFeaturesData(queryClient);

		return { result };
	};

const getDefinitionStepsForPathFeaturesData = async (
	queryClient: QueryClient
) => {
	const stepsQueryData = await getStepsQueryData(queryClient);
	const pathFeaturesQueryData = await getPathFeaturesQueryData(queryClient);

	return {
		steps: stepsQueryData,
		pathFeatures: pathFeaturesQueryData,
	};
};

const getStepsQueryData = async (queryClient: QueryClient) => {
	const query = stepsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getPathFeaturesQueryData = async (queryClient: QueryClient) => {
	const query = pathFeaturesQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
