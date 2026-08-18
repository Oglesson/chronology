import { QueryClient } from "@tanstack/react-query";
import { generalSettingsQuery } from "../../queries.common/generalSettingsQuery";
import { gradesQuery } from "../../queries.common/gradesQuery";

export const gradesLoader = (queryClient: QueryClient) => async () => {
	const result = await getGradesData(queryClient);

	return { result };
};
const getGradesData = async (queryClient: QueryClient) => {
	return {
		generalSettings: await getGeneralSettingsQueryData(queryClient),
		grades: await getGradesQueryData(queryClient),
	};
};

const getGeneralSettingsQueryData = async (queryClient: QueryClient) => {
	const query = generalSettingsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getGradesQueryData = async (queryClient: QueryClient) => {
	const query = gradesQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
