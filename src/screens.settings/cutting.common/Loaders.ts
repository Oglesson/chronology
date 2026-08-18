import { QueryClient } from "@tanstack/react-query";
import {
	cuttingMethodsNaturalQuery,
	cuttingMethodsSyntheticQuery,
} from "../../queries.common/cuttingMethodsQuery";
import { cuttingTypesQuery } from "../../queries.common/cuttingTypesQuery";
import { defaultCuttingSettingsQuery } from "../../queries.common/defaultCuttingSettingsQuery";
import { feedSystemsQuery } from "../../queries.common/feedSystemsQuery";
import { materialTypesQuery } from "../../queries.common/materialTypesQuery";
import { unitsQuery } from "../../queries.common/unitsQuery";

export const cuttingLoader = (queryClient: QueryClient) => async () => {
	const result = await getCuttingData(queryClient);

	return { result };
};

const getCuttingData = async (queryClient: QueryClient) => {
	const defaultCuttingSettingsQueryData = await getDefaultCuttingSettingsData(
		queryClient
	);
	const cuttingMethodsNaturalQueryData =
		await getCuttingMethodsNaturalQueryData(queryClient);
	const cuttingMethodsSyntheticQueryData =
		await getCuttingMethodsSyntheticQueryData(queryClient);
	const cuttingTypesQueryData = await getCuttingTypesQueryData(queryClient);
	const feedSystemsQueryData = await getFeedSystemsQueryData(queryClient);
	const materialTypesQueryData = await getMaterialTypesQueryData(queryClient);
	const unitsQueryData = await getUnitsQueryData(queryClient);

	return {
		defaultCuttingSettings: defaultCuttingSettingsQueryData,
		cuttingMethodsNatural: cuttingMethodsNaturalQueryData,
		cuttingMethodsSynthetic: cuttingMethodsSyntheticQueryData,
		cuttingTypes: cuttingTypesQueryData,
		feedSystems: feedSystemsQueryData,
		materialTypes: materialTypesQueryData,
		units: unitsQueryData,
	};
};

const getDefaultCuttingSettingsData = async (queryClient: QueryClient) => {
	const query = defaultCuttingSettingsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getCuttingMethodsNaturalQueryData = async (queryClient: QueryClient) => {
	const query = cuttingMethodsNaturalQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getCuttingMethodsSyntheticQueryData = async (
	queryClient: QueryClient
) => {
	const query = cuttingMethodsSyntheticQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getCuttingTypesQueryData = async (queryClient: QueryClient) => {
	const query = cuttingTypesQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getFeedSystemsQueryData = async (queryClient: QueryClient) => {
	const query = feedSystemsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getMaterialTypesQueryData = async (queryClient: QueryClient) => {
	const query = materialTypesQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getUnitsQueryData = async (queryClient: QueryClient) => {
	const query = unitsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};
