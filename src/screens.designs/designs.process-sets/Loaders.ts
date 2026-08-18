import { QueryClient } from "@tanstack/react-query";
import { departmentSettingsQuery } from "../../queries.common/departmentSettingsQuery";
import { processSetsQuery } from "../../queries.common/processSetsQuery";

export const processSetsLoader = (queryClient: QueryClient) => async () => {
	const result = await getData(queryClient);

	return { result };
};

const getData = async (queryClient: QueryClient) => {
	const departmentsQueryData = await getDepartmentsQueryData(queryClient);
	const processSetsQueryData = await getProcessSetsQueryData(queryClient);

	return {
		departments: departmentsQueryData,
		processSets: processSetsQueryData,
	};
};

const getProcessSetsQueryData = async (queryClient: QueryClient) => {
	const query = processSetsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getDepartmentsQueryData = async (queryClient: QueryClient) => {
	const query = departmentSettingsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
