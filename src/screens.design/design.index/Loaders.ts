import { QueryClient } from "@tanstack/react-query";
import { Params } from "react-router-dom";
import { departmentSettingsQuery } from "../../queries.common/departmentSettingsQuery";
import { designQuery } from "../../queries.common/designQuery";

export const styleLoader =
	(queryClient: QueryClient) =>
	async ({ params }: { params: Params }) => {
		const result = await getDesignData(queryClient, params);

		return { result };
	};

const getDesignData = async (queryClient: QueryClient, params: Params) => {
	const designQueryData = await getStyleQueryData(queryClient, params);
	const styleDepartments = await getDesignDepartmentsData(queryClient, params);

	return {
		style: designQueryData,
		styleDepartments: styleDepartments,
	};
};

const getStyleQueryData = async (queryClient: QueryClient, params: Params) => {
	const query = designQuery(params.id as string);

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getDesignDepartmentsData = async (
	queryClient: QueryClient,
	_params: Params
) => {
	const departmentsQueryData = await getDepartmentsQueryData(queryClient);

	return {
		departments: departmentsQueryData,
	};
};

const getDepartmentsQueryData = async (queryClient: QueryClient) => {
	const query = departmentSettingsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
