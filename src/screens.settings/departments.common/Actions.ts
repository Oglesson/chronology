import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, Method } from "axios";
import api from "../../api.common";
import {
	DepartmentData,
	ResponseData,
	ResponseMessage,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const departmentsAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "DELETE":
				return await deleteDepartmentAction(queryClient, formData);
			case "POST":
				return await createDepartmentAction(queryClient, formData);
			case "PUT":
				return await updateDepartmentAction(queryClient, formData);
		}

		return null;
	};

const createDepartmentAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const response = await api
		.createDepartment({
			BatchSize: Number(formData.get("batchSize")),
			Description: formData.get("description") as string,
			No: Number(formData.get("departmentNumber")),
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

	await queryClient.invalidateQueries(QUERY_KEYS.settings_departments);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const deleteDepartmentAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const response = await api
		.deleteDepartment(Number(formData.get("id")))
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries(QUERY_KEYS.settings_departments);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const updateDepartmentAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const cache = queryClient
		.getQueryCache()
		.find(QUERY_KEYS.settings_departments);

	const { data: cachedDepartments } = cache?.state.data as AxiosResponse<
		DepartmentData[]
	>;

	const matchingDepartment = cachedDepartments.find(
		(d) => d.ID === Number(formData.get("id"))
	);

	if (!matchingDepartment) {
		return {
			message: "Department doesn't exist",
			type: "error",
		};
	}

	const department = ObjectUtilities.deepCopy(matchingDepartment);
	const clonedDepartment = ObjectUtilities.deepCopy(department);

	hydrate(clonedDepartment, formData);

	if (ObjectUtilities.areEqual(department, clonedDepartment))
		return {
			type: "success",
		};

	let errorData: ResponseData | undefined;
	const response = await api
		.updateDepartment(clonedDepartment)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries(QUERY_KEYS.settings_departments);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = (clonedDepartment: DepartmentData, formData: FormData) => {
	const { departmentNumber, description, batchSize } = Object.fromEntries(
		formData.entries()
	);

	if (departmentNumber) {
		clonedDepartment.No = Number(departmentNumber);
	}

	if (description !== undefined) {
		clonedDepartment.Description = description as string;
	}

	if (batchSize) {
		clonedDepartment.BatchSize = Number(batchSize);
	}
};
