import { QueryClient } from "@tanstack/react-query";
import { Params } from "react-router-dom";
import { designDepartmentQuery } from "../../queries.common/designDepartmentQuery";
import { designQuery } from "../../queries.common/designQuery";

export const styleDepartmentLoader =
	(queryClient: QueryClient) =>
	async ({ params }: { params: Params }) => {
		const result = await getDesignDepartmentData(queryClient, params);

		return { result };
	};

const getDesignDepartmentData = async (
	queryClient: QueryClient,
	params: Params
) => {
	const designDepartmentQueryData = await getDesignDepartmentQueryData(
		queryClient,
		params
	);
	const designQueryData = await getStyleQueryData(queryClient, params);

	return {
		styleDepartment: designDepartmentQueryData,
		style: designQueryData,
	};
};

const getDesignDepartmentQueryData = async (
	queryClient: QueryClient,
	params: Params
) => {
	const query = designDepartmentQuery(params.departmentId as string);

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getStyleQueryData = async (queryClient: QueryClient, params: Params) => {
	const query = designQuery(params.id as string);

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
