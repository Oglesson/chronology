import { QueryClient } from "@tanstack/react-query";
import { auditQuery } from "../queries.common/auditQuery";
import { initialAuditDateParams } from "../utilities.common/DateUtilities";

export const auditLoader = (queryClient: QueryClient) => async () => {
	const result = await getData(queryClient);

	return { result };
};

const getData = async (queryClient: QueryClient) => {
	const auditQueryData = await getAuditListQueryData(queryClient);

	return {
		auditList: auditQueryData,
	};
};

const getAuditListQueryData = async (queryClient: QueryClient) => {
	const query = auditQuery(initialAuditDateParams());

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
