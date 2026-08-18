import { QueryClient } from "@tanstack/react-query";
import { Params } from "react-router-dom";
import { stepQuery } from "../queries.common/stepQuery";
import { actionsQuery } from "../queries.common/actionsQuery";
import { actionByCodeQuery } from "../queries.common/actionQuery";

export const stepLoader =
	(queryClient: QueryClient) =>
	async ({ params }: { params: Params }) => {
		const result = await getStepData(queryClient, params);

		return { result };
	};

const getStepData = async (queryClient: QueryClient, params: Params) => {
	const stepQueryData = await getStepQueryData(queryClient, params);
	const actionsQueryData = await getActionsQueryData(queryClient);
	const titleStepData = await getTitleActionID(queryClient);

	return {
		step: stepQueryData,
		actions: actionsQueryData,
		titleID: titleStepData,
	};
};

const getStepQueryData = async (
	queryClient: QueryClient,
	params: Params
) => {
	const query = stepQuery(params.id as string);

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getActionsQueryData = async (queryClient: QueryClient) => {
	const query = actionsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getTitleActionID = async (queryClient: QueryClient) => {
	const query = actionByCodeQuery("__TITLE__");

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
