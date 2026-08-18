import { QueryClient } from "@tanstack/react-query";
import { AxiosError, Method } from "axios";
import { redirect } from "react-router-dom";
import api from "../api.common";
import { ResponseData, ResponseMessage } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const actionsAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "DELETE":
				return await deleteActionAction(queryClient, formData);
			case "POST":
				if (formData.get("identifier")) {
					return await copyActionAction(queryClient, formData);
				} else {
					return await createActionAction(queryClient, formData);
				}
		}

		return null;
	};

const createActionAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const action = await api
		.createAction({
			Code: (formData.get("code") as string).toUpperCase(),
			Description: formData.get("description") as string,
			ReflectLevel: formData.get("reflectLevel") === "yes",
			SecsAt100: Number(formData.get("secsAt100")),
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

	return null;
};
