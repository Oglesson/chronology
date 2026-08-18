import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, Method } from "axios";
import { redirect } from "react-router-dom";
import api from "../../api.common";
import {
	ProcessSetData,
	ResponseData,
	ResponseMessage,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";

export const processSetsAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "DELETE":
				return await deleteProcessSetAction(queryClient, formData);
			case "POST":
				return await createProcessSetAction(queryClient, formData);
		}

		return null;
	};

const createProcessSetAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const { code, description, department } = Object.fromEntries(
		formData.entries()
	);
	let errorData: ResponseData | undefined;

	const response = await api
		.createProcessSet({
			Code: (code as string).toUpperCase(),
			Description: description as string,
			DepartmentID: Number(department),
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

	const processSet = response as AxiosResponse<ProcessSetData>;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.process_sets]});

	return redirect(`/styles/process-sets/${processSet.data.ID}`);
};

const deleteProcessSetAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const id = formData.get("id");
	let errorData: ResponseData | undefined;

	await api.deleteProcessSet(Number(id)).catch((e: AxiosError) => {
		errorData = {
			code: e.response?.status,
			message: e.response?.statusText,
			responseMessage: e.response?.data as ResponseMessage,
			type: "error",
		};
	});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.process_sets]});
	queryClient.removeQueries({queryKey: [QUERY_KEYS.process_set, id]});

	return null;
};
