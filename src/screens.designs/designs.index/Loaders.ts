import { QueryClient } from "@tanstack/react-query";
import { designsQuery } from "../../queries.common/designsQuery";

export const stylesLoader = (queryClient: QueryClient) => async () => {
	const result = await getData(queryClient);

	return { result };
};

const getData = async (queryClient: QueryClient) => {
	const designsQueryData = await getStylesQueryData(queryClient);

	return {
		styles: designsQueryData,
	};
};

const getStylesQueryData = async (queryClient: QueryClient) => {
	const query = designsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
