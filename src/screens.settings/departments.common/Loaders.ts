import { QueryClient } from "@tanstack/react-query";
import { departmentSettingsQuery } from "../../queries.common/departmentSettingsQuery";

export const departmentsLoader = (queryClient: QueryClient) => async () => {
	const result = await getDepartmentsData(queryClient);

	return { result };
};

const getDepartmentsData = async (queryClient: QueryClient) => {
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
