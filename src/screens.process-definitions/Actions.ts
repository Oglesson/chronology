import { QueryClient } from "@tanstack/react-query";
import { AxiosError, Method } from "axios";
import { redirect } from "react-router-dom";
import api from "../api.common";
import { ResponseData, ResponseMessage } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const processDefinitionsAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "DELETE":
				return await deleteProcessDefinitionAction(
					queryClient,
					formData
				);
			case "POST":
				if (formData.get("id")) {
					return await copyProcessDefinitionAction(
						queryClient,
						formData
					);
				} else {
					return await createProcessDefinitionAction(
						queryClient,
						formData
					);
				}
		}

		return null;
	};

const createProcessDefinitionAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const definition = await api
		.createProcessDefinition({
			Code: (formData.get("code") as string).toUpperCase(),
			Handling: formData.get("type") === "handling",
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

	return redirect(`/processes/definitions/${definition?.data.ID}`);
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

	return redirect(`/processes/definitions/${definition?.data.ID}`);
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

	return {
		type: "success",
	};
};
