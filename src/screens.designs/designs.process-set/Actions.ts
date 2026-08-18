import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, Method } from "axios";
import { Params, redirect } from "react-router-dom";
import api from "../../api.common";
import {
	ProcessSetData,
	ProcessSetProcessData,
	ResponseData,
	ResponseMessage,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const processSetAction =
	(queryClient: QueryClient) =>
	async ({ request, params }: { request: Request; params: Params }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "DELETE":
				return await deleteProcessSetAction(queryClient, formData);
			case "PUT":
				return await updateProcessSetAction(
					queryClient,
					formData,
					params
				);
		}

		return null;
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

	return redirect("/designs/process-sets");
};

const updateProcessSetAction = async (
	queryClient: QueryClient,
	formData: FormData,
	params: Params
) => {
	const cache = queryClient
		.getQueryCache()
		.find([QUERY_KEYS.process_set, params.id]);
	const { data: cachedProcessSet } = cache?.state
		.data as AxiosResponse<ProcessSetData>;
	const processSet = ObjectUtilities.deepCopy(cachedProcessSet);
	const clonedProcessSet = ObjectUtilities.deepCopy(processSet);

	hydrate(clonedProcessSet, formData);

	// if (ObjectUtilities.areEqual(operationSet, clonedOperationSet)) {
	// 	return {
	// 		type: "success",
	// 	};
	// }

	let errorData: ResponseData | undefined;
	const response = await api
		.updateProcessSet(clonedProcessSet)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.process_sets]});
	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.process_set, params.id]});

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = (clonedProcessSet: ProcessSetData, formData: FormData) => {
	const { code, description, departmentId, processes } = Object.fromEntries(
		formData.entries()
	);

	clonedProcessSet.UpdateMap = {
		Header: false,
		Processes: false,
	};

	if (code) {
		clonedProcessSet.UpdateMap.Header = true;
		clonedProcessSet.Code = (code as string).toUpperCase();
	}

	if (description !== undefined) {
		clonedProcessSet.UpdateMap.Header = true;
		clonedProcessSet.Description = description as string;
	}

	if (departmentId) {
		clonedProcessSet.UpdateMap.Header = true;
		clonedProcessSet.DepartmentID = Number(departmentId);
	}

	if (processes) {
		clonedProcessSet.UpdateMap.Processes = true;

		const parsedProcesses: ProcessSetProcessData[] = JSON.parse(
			processes.toString()
		);

		clonedProcessSet.Processes = parsedProcesses;
	}
};
