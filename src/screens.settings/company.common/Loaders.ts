import { QueryClient } from "@tanstack/react-query";
import { generalSettingsQuery } from "../../queries.common/generalSettingsQuery";

export const companyLoader = (queryClient: QueryClient) => async () => {
	const result = await getCompanyData(queryClient);

	return { result };
};

const getCompanyData = async (queryClient: QueryClient) => {
	const companyQueryData = await getCompanyQueryData(queryClient);

	return {
		company: companyQueryData,
	};
};

const getCompanyQueryData = async (queryClient: QueryClient) => {
	const query = generalSettingsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
