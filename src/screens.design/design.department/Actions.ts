import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, Method } from "axios";
import { Params, redirect } from "react-router-dom";
import api from "../../api.common";
import {
	ResponseData,
	ResponseMessage,
	DesignDepartmentData,
	DesignDepartmentProcessData,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const styleDepartmentAction =
	(queryClient: QueryClient) =>
	async ({ request, params }: { request: Request; params: Params }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "DELETE":
				return await deleteDesignDepartmentAction(queryClient, formData);
			case "PUT":
				return await updateDesignDepartmentAction(
					queryClient,
					formData,
					params
				);
		}

		return null;
	};

export const notesAction =
	(queryClient: QueryClient) =>
	async ({ request, params }: { request: Request; params: Params }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "PUT":
				return await updateDesignDepartmentAction(
					queryClient,
					formData,
					params
				);
		}

		return null;
	};

const deleteDesignDepartmentAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const id = formData.get("id");
	const parentId = formData.get("parentId");
	let errorData: ResponseData | undefined;

	await api.deleteDesignDepartment(Number(id)).catch((e: AxiosError) => {
		errorData = {
			code: e.response?.status,
			message: e.response?.statusText,
			responseMessage: e.response?.data as ResponseMessage,
			type: "error",
		};
	});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.styles]});
	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.style, parentId]});
	queryClient.removeQueries({queryKey: [QUERY_KEYS.design_department, id]});

	return redirect(`/styles/${parentId}`);
};

const updateDesignDepartmentAction = async (
	queryClient: QueryClient,
	formData: FormData,
	params: Params
) => {
	const cache = queryClient
		.getQueryCache()
		.find([QUERY_KEYS.design_department, params.departmentId]);
	const { data: cachedDesignDepartment } = cache?.state
		.data as AxiosResponse<DesignDepartmentData>;
	const styleDepartment = ObjectUtilities.deepCopy(cachedDesignDepartment);
	const clonedDesignDepartment = ObjectUtilities.deepCopy(styleDepartment);

	hydrate(clonedDesignDepartment, formData);

	// if (ObjectUtilities.areEqual(styleDepartment, clonedDesignDepartment)) {
	// 	return {
	// 		type: "success",
	// 	};
	// }

	let errorData: ResponseData | undefined;
	const response = await api
		.updateDesignDepartment(clonedDesignDepartment)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.design_departments]});
	await queryClient.invalidateQueries({queryKey: [
		QUERY_KEYS.design_department,
		params.departmentId,
	]});
	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.style, params.id]});

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = (
	clonedDesignDepartment: DesignDepartmentData,
	formData: FormData
) => {
	const { batchSize, pairsCosted, notes, processes } = Object.fromEntries(
		formData.entries()
	);

	clonedDesignDepartment.UpdateMap = {
		Header: false,
		Processes: false,
	};

	if (batchSize) {
		clonedDesignDepartment.UpdateMap.Header = true;
		clonedDesignDepartment.BatchSize = Number(batchSize);
	}

	if (pairsCosted) {
		clonedDesignDepartment.UpdateMap.Header = true;
		clonedDesignDepartment.PairsCosted = Number(pairsCosted);
	}

	if (notes !== undefined) {
		clonedDesignDepartment.UpdateMap.Header = true;
		clonedDesignDepartment.Notes = notes as string;
	}

	if (processes) {
		clonedDesignDepartment.UpdateMap.Processes = true;

		const parsedProcesses: DesignDepartmentProcessData[] = JSON.parse(
			processes.toString()
		);

		clonedDesignDepartment.Processes = parsedProcesses;
	}
};
