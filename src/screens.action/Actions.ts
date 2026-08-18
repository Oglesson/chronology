import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, Method } from "axios";
import { Params, redirect } from "react-router-dom";
import api from "../api.common";
import { ActionData, ResponseData, ResponseMessage } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";
import ObjectUtilities from "../utilities.common/ObjectUtilities";

export const actionAction =
	(queryClient: QueryClient) =>
	async ({ request, params }: { request: Request; params: Params }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "DELETE":
				return await deleteActionAction(queryClient, formData);
			case "PUT":
				return await updateActionAction(queryClient, formData, params);
			case "POST":
				return await copyActionAction(queryClient, formData);
		}

		return null;
	};

const deleteActionAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const id = formData.get("id");
	let errorData: ResponseData | undefined;

	await api.deleteAction(Number(id)).catch((e: AxiosError) => {
		errorData = {
			code: e.response?.status,
			message: e.response?.statusText,
			responseMessage: e.response?.data as ResponseMessage,
			type: "error",
		};
	});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.actions]});
	queryClient.removeQueries({queryKey: [QUERY_KEYS.action, id]});

	return redirect("/actions");
};

const copyActionAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const action = await api
		.copyAction({
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

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.actions]});

	return redirect(`/actions/${action?.data.ID}`);
};

const updateActionAction = async (
	queryClient: QueryClient,
	formData: FormData,
	params: Params
) => {
	const cache = queryClient
		.getQueryCache()
		.find([QUERY_KEYS.action, params.id]);

	const { data: cachedAction } = cache?.state
		.data as AxiosResponse<ActionData>;

	const action = ObjectUtilities.deepCopy(cachedAction);
	const clonedAction = ObjectUtilities.deepCopy(action);

	hydrate(clonedAction, formData);

	if (ObjectUtilities.areEqual(action, clonedAction))
		return {
			type: "success",
		};

	let errorData: ResponseData | undefined;
	const response = await api
		.updateAction(clonedAction)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.actions]});
	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.action, params.id]});

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = (clonedAction: ActionData, formData: FormData) => {
	const { code, description, reflectLevel, secsAt100 } = Object.fromEntries(
		formData.entries()
	);

	if (code) {
		clonedAction.Code = (code as string).toUpperCase();
	}

	if (description !== undefined) {
		clonedAction.Description = description as string;
	}

	if (reflectLevel) {
		clonedAction.ReflectLevel = reflectLevel === "yes";
	}

	if (secsAt100) {
		clonedAction.SecsAt100 = Number(secsAt100);
	}
};
