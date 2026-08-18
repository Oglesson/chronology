import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import api from "../../api.common";
import {
	MachineData,
	ResponseData,
	ResponseMessage,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const createMachineAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;
	const response = await api
		.createMachine({
			Code: (formData.get("code") as string).toUpperCase(),
			Description: formData.get("description") as string,
			DepartmentID: parseInt(formData.get("departmentId") as string),
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

	await queryClient.invalidateQueries(QUERY_KEYS.settings_machining_machines);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

export const deleteMachineAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	await api
		.deleteMachine(Number(formData.get("id")))
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries(QUERY_KEYS.settings_machining_machines);

	return null;
};

export const updateMachineAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const cache = queryClient
		.getQueryCache()
		.find(QUERY_KEYS.settings_machining_machines);

	const { data: cachedMachines } = cache?.state.data as AxiosResponse<
		MachineData[]
	>;

	const matchingMachine = cachedMachines.find(
		(d) => d.ID === Number(formData.get("id"))
	);

	if (!matchingMachine) {
		return {
			message: "Machine doesn't exist",
			type: "error",
		};
	}

	const machine = ObjectUtilities.deepCopy(matchingMachine);

	delete machine._Department;

	const clonedMachine = ObjectUtilities.deepCopy(machine);

	hydrate(clonedMachine, formData);

	if (ObjectUtilities.areEqual(machine, clonedMachine))
		return {
			type: "success",
		};

	let errorData: ResponseData | undefined;
	const response = await api
		.updateMachine(clonedMachine)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries(QUERY_KEYS.settings_machining_machines);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = (clonedMachine: MachineData, formData: FormData) => {
	const { code, description, departmentId } = Object.fromEntries(
		formData.entries()
	);

	if (code) {
		clonedMachine.Code = (code as string).toUpperCase();
	}

	if (description !== undefined) {
		clonedMachine.Description = description as string;
	}

	if (departmentId) {
		clonedMachine.DepartmentID = parseInt(departmentId as string);
	}
};
