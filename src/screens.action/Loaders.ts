import { QueryClient } from "@tanstack/react-query";
import { Params } from "react-router-dom";
import { actionQuery } from "../queries.common/actionQuery";
import { actionsQuery } from "../queries.common/actionsQuery";

export const actionLoader =
	(queryClient: QueryClient) =>
	async ({ params }: { params: Params }) => {
		const result = await getActionData(queryClient, params);

		return { result };
	};

const getActionData = async (queryClient: QueryClient, params: Params) => {
	const actionQueryData = await getActionQueryData(queryClient, params);
	const actionsQueryData = await getActionsQueryData(queryClient);

	return {
		action: actionQueryData,
		actions: actionsQueryData,
	};
};

const getActionQueryData = async (queryClient: QueryClient, params: Params) => {
	const query = actionQuery(params.id as string);

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
