import { QueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Params } from "react-router-dom";
import { ProcessData } from "../../api.common/types";
import { stepsQuery } from "../../queries.common/stepsQuery";
import { gradesQuery } from "../../queries.common/gradesQuery";
import { machinesQuery } from "../../queries.common/machinesQuery";
import { processDefinitionCategoriesQuery } from "../../queries.common/processDefinitionCategoriesQuery";
import { processQuery } from "../../queries.common/processQuery";
import { processesQuery } from "../../queries.common/processesQuery";
import { systemStitchingModifiersQuery } from "../../queries.common/systemStitchingModifiersQuery";

export const processQuestionsLoader =
	(queryClient: QueryClient) =>
	async ({ params }: { params: Params }) => {
		const result = await getProcessQuestionsData(queryClient, params);

		return { result };
	};

export const getProcessQuestionsData = async (
	queryClient: QueryClient,
	params: Params
) => {
	const processQueryData = (await getProcessQueryData(
		queryClient,
		params
	)) as AxiosResponse<ProcessData>;
	const processDefinitionCategoriesQueryData =
		await getProcessDefinitionCategoriesQueryData(queryClient);
	const gradesQueryData = await getGradesQueryData(queryClient);
	const machinesQueryData = await getMachinesQueryData(queryClient);
	const stitchingModifiersData = await getStitchingModifiersQueryData(
		queryClient
	);
	const stepsQueryData = await getStepsQueryData(queryClient);

	if (
		processQueryData &&
		processQueryData.data &&
		processQueryData.data.CategoryKind === "ocGroup"
	) {
		await getProcesssQueryData(queryClient);
	}

	return {
		process: processQueryData,
		processDefinitionCategories: processDefinitionCategoriesQueryData,
		grades: gradesQueryData,
		machines: machinesQueryData,
		stitchingModifiers: stitchingModifiersData,
		steps: stepsQueryData,
	};
};

const getProcessQueryData = async (
	queryClient: QueryClient,
	params: Params
) => {
	const query = processQuery(params.id as string);

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getProcesssQueryData = async (queryClient: QueryClient) => {
	const query = processesQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getProcessDefinitionCategoriesQueryData = async (
	queryClient: QueryClient
) => {
	const query = processDefinitionCategoriesQuery();

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

const getMachinesQueryData = async (queryClient: QueryClient) => {
	const query = machinesQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getStitchingModifiersQueryData = async (queryClient: QueryClient) => {
	const query = systemStitchingModifiersQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

const getStepsQueryData = async (queryClient: QueryClient) => {
	const query = stepsQuery();

	return (
		queryClient.getQueryData(query.queryKey ?? []) ??
		(await queryClient.fetchQuery(query))
	);
};

