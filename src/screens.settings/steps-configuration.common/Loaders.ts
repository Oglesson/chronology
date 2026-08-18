import { QueryClient } from "@tanstack/react-query";
import { cuttingStepsSettingsQuery } from "../../queries.common/cuttingStepsSettingsQuery";
import { machiningStepsSettingsQuery } from "../../queries.common/machiningStepsSettingsQuery";
import { QUERY_KEYS } from "../../constants.common/queryKeys";

export const configurationLoader = (queryClient: QueryClient) => async () => {
	const result = await getConfigurationData(queryClient);

	return { result };
};

const getConfigurationData = async (queryClient: QueryClient) => {
	const isAdmin = await queryClient.getQueryData([
		QUERY_KEYS.is_admin,
	]);
	const cuttingStepsSettingsQueryData =
		await getCuttingStepsSettingsQueryData(queryClient);

	const ret = {
		cuttingStepsSettings: cuttingStepsSettingsQueryData,
		machiningStepsSettings: {},
	};

	if (isAdmin) {
		const machiningStepsSettingsQueryData =
			await getMachiningStepsSettingsQueryData(queryClient);

		ret.machiningStepsSettings = machiningStepsSettingsQueryData;
	}

	return ret;
};

const getCuttingStepsSettingsQueryData = async (
	queryClient: QueryClient
) => {
	const query = cuttingStepsSettingsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getMachiningStepsSettingsQueryData = async (
	queryClient: QueryClient
) => {
	const query = machiningStepsSettingsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
