import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, Method } from "axios";
import { redirect } from "react-router-dom";
import api from "../api.common";
import {
	ProcessData,
	ResponseData,
	ResponseMessage,
} from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const processesAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "DELETE":
				return await deleteProcessAction(queryClient, formData);
			case "POST":
				if (formData.get("id")) {
					return await copyProcessAction(queryClient, formData);
				} else {
					return await createProcessAction(queryClient, formData);
				}
		}

		return null;
	};

const createProcessAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const { code, description, processType, department, mainDesign } =
		Object.fromEntries(formData.entries());

	let errorData: ResponseData | undefined;
	const response = await api
		.createProcess({
			Code: (code as string).toUpperCase(),
			Description: description as string,
			TypeID: Number(processType),
			DepartmentID: Number(department),
			DesignID: mainDesign ? Number(mainDesign) : null,
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

	const process = response as AxiosResponse<ProcessData>;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.processes]});

	return redirect(`/processes/${process.data.ID}`);
};

const copyProcessAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const process = await api
		.copyProcess({
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

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.processes]});

	return redirect(`/processes/${process?.data.ID}`);
};

const deleteProcessAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const id = formData.get("id");

	let errorData: ResponseData | undefined;
	const response = await api
		.deleteProcess(Number(id))
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.processes]});
	queryClient.removeQueries({queryKey: [QUERY_KEYS.process, id]});

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};
