import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, Method } from "axios";
import { Params, redirect } from "react-router-dom";
import api from "../../api.common";
import {
	ProcessDefinitionData,
	ResponseData,
	ResponseMessage,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const processDefinitionAction =
	(queryClient: QueryClient) =>
	async ({ request, params }: { request: Request; params: Params }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "DELETE":
				return await deleteProcessDefinitionAction(
					queryClient,
					formData
				);
			case "PUT":
				return await updateProcessDefinitionAction(
					queryClient,
					formData,
					params
				);
			case "POST":
				return await copyProcessDefinitionAction(
					queryClient,
					formData
				);
		}

		return null;
	};

const deleteProcessDefinitionAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const id = formData.get("id");
	let errorData: ResponseData | undefined;

	await api.deleteProcessDefinition(Number(id)).catch((e: AxiosError) => {
		errorData = {
			code: e.response?.status,
			message: e.response?.statusText,
			responseMessage: e.response?.data as ResponseMessage,
			type: "error",
		};
	});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.process_definitions]});
	queryClient.removeQueries({queryKey: [QUERY_KEYS.process_definition, id]});

	return redirect("/processes/definitions");
};

const copyProcessDefinitionAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const definition = await api
		.copyProcessDefinition({
			Code: (formData.get("identifier") as string).toUpperCase(),
			ID: Number(formData.get("id")),
		})
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.process_definitions]});

	return redirect(`/processes/definitions/${definition?.data?.ID}`);
};

const updateProcessDefinitionAction = async (
	queryClient: QueryClient,
	formData: FormData,
	params: Params
) => {
	const cache = queryClient
		.getQueryCache()
		.find([QUERY_KEYS.process_definition, params.id]);
	const { data: cachedDefinition } = cache?.state
		.data as AxiosResponse<ProcessDefinitionData>;
	const definition = ObjectUtilities.deepCopy(cachedDefinition);
	const clonedDefinition = ObjectUtilities.deepCopy(definition);

	hydrate(clonedDefinition, formData);

	// if (ObjectUtilities.areEqual(definition, clonedDefinition)) {
	// 	return {
	// 		type: "success",
	// 	};
	// }

	let errorData: ResponseData | undefined;

	const response = await api
		.updateProcessDefinition(clonedDefinition)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.process_definitions]});
	await queryClient.invalidateQueries({queryKey: [
		QUERY_KEYS.process_definition,
		params.id,
	]});

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = (
	clonedDefinition: ProcessDefinitionData,
	formData: FormData
) => {
	const {
		code,
		notes,
		pathSimo,
		pathTypes,
		questions,
		steps,
		stepsForPathFeatures,
		innerIndex,
	} = Object.fromEntries(formData.entries());

	clonedDefinition.UpdateMap = {
		Steps: false,
		Header: false,
		PathfeaturesSteps: false,
		Pathtypes: false,
		Questions: false,
	};

	if (code) {
		clonedDefinition.UpdateMap.Header = true;
		clonedDefinition.Code = (code as string).toUpperCase();
	}

	if (notes !== undefined) {
		clonedDefinition.UpdateMap.Header = true;
		clonedDefinition.Notes = notes as string;
	}

	if (pathSimo) {
		clonedDefinition.UpdateMap.Header = true;
		clonedDefinition.PathSimo = Number(pathSimo);
	}

	if (pathTypes) {
		clonedDefinition.UpdateMap.Pathtypes = true;
		clonedDefinition.Pathtypes = JSON.parse(pathTypes as string);
	}

	if (questions) {
		clonedDefinition.UpdateMap.Questions = true;
		clonedDefinition.Questions = JSON.parse(questions as string);
	}

	if (steps) {
		clonedDefinition.UpdateMap.Steps = true;
		clonedDefinition.Steps = JSON.parse(steps as string);
	}

	if (stepsForPathFeatures) {
		clonedDefinition.UpdateMap.PathfeaturesSteps = true;
		clonedDefinition.PathfeaturesSteps = JSON.parse(
			stepsForPathFeatures as string
		);
	}

	if (innerIndex) {
		clonedDefinition.UpdateMap.Header = true;
		clonedDefinition.InnerIndex = Number(innerIndex);
	}
};
