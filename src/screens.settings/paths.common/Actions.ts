import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, Method } from "axios";
import api from "../../api.common";
import {
	PathFeatureData,
	ResponseData,
	ResponseMessage,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const pathsAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "DELETE":
				return await deletePathFeatureAction(queryClient, formData);
			case "POST":
				return await createPathFeatureAction(queryClient, formData);
			case "PUT":
				return await updatePathFeatureAction(queryClient, formData);
		}

		return null;
	};

const createPathFeatureAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const response = await api
		.createPathFeature({
			Description: formData.get("description") as string,
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

	await queryClient.invalidateQueries(
		QUERY_KEYS.settings_machining_process_definitions_path_features
	);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const deletePathFeatureAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const response = await api
		.deletePathFeature(Number(formData.get("id")))
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries(
		QUERY_KEYS.settings_machining_process_definitions_path_features
	);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const updatePathFeatureAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const cache = queryClient
		.getQueryCache()
		.find(
			QUERY_KEYS.settings_machining_process_definitions_path_features
		);

	const { data: cachedPathFeatures } = cache?.state.data as AxiosResponse<
		PathFeatureData[]
	>;

	const matchingPathFeature = cachedPathFeatures.find(
		(d) => d.ID === Number(formData.get("id"))
	);

	if (!matchingPathFeature) {
		return {
			message: "Path Feature doesn't exist",
			type: "error",
		};
	}

	const pathFeature = ObjectUtilities.deepCopy(matchingPathFeature);
	const clonedPathFeature = ObjectUtilities.deepCopy(pathFeature);

	hydrate(clonedPathFeature, formData);

	if (ObjectUtilities.areEqual(pathFeature, clonedPathFeature))
		return {
			type: "success",
		};

	let errorData: ResponseData | undefined;
	const response = await api
		.updatePathFeature(clonedPathFeature)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries(
		QUERY_KEYS.settings_machining_process_definitions_path_features
	);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = (clonedPathFeature: PathFeatureData, formData: FormData) => {
	const { description } = Object.fromEntries(formData.entries());

	if (description !== undefined) {
		clonedPathFeature.Description = description as string;
	}
};
