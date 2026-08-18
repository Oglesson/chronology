import { QueryClient } from "@tanstack/react-query";
import { AxiosError, Method } from "axios";
import { redirect } from "react-router";
import api from "../api.common";
import { ResponseData, ResponseMessage } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const stepsAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "DELETE":
				return await deleteStepAction(queryClient, formData);
			case "POST":
				if (formData.get("id")) {
					return await copyStepAction(queryClient, formData);
				} else {
					return await createElementAction(queryClient, formData);
				}
		}

		return null;
	};

const createElementAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;
	const step = await api
		.createElement({
			Code: (formData.get("code") as string).toUpperCase(),
			Description: formData.get("description") as string,
			ValueAdded: formData.get("valueAdded") === "yes",
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

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.steps]});

	return redirect(`/steps/${step?.data.ID}`);
};

const copyStepAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;
	const step = await api
		.copyStep({
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

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.steps]});

	return redirect(`/steps/${step?.data.ID}`);
};

const deleteStepAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const id = formData.get("id");

	let errorData: ResponseData | undefined;
	await api.deleteStep(Number(id)).catch((e: AxiosError) => {
		errorData = {
			code: e.response?.status,
			message: e.response?.statusText,
			responseMessage: e.response?.data as ResponseMessage,
			type: "error",
		};
	});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.steps]});
	queryClient.removeQueries({queryKey: [QUERY_KEYS.step, id]});

	return null;
};
