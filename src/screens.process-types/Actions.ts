import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import api from "../api.common";
import {
	ProcessClassData,
	ProcessTypeData,
	ResponseData,
	ResponseMessage,
} from "../api.common/types";
import { FORM_IDENTIFIERS } from "../constants.common/formIdentifiers";
import { QUERY_KEYS } from "../constants.common/queryKeys";
import { ProcessTypes } from "../queries.common/processTypesQuery";
import ObjectUtilities from "../utilities.common/ObjectUtilities";

export const processTypesAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const formData = await request.formData();

		const { identifier } = Object.fromEntries(formData.entries());

		switch (identifier) {
			case FORM_IDENTIFIERS.createProcessClass:
				return await createProcessClassAction(queryClient, formData);
			case FORM_IDENTIFIERS.deleteProcessClass:
				return await deleteProcessClassAction(queryClient, formData);
			case FORM_IDENTIFIERS.updateProcessClass:
				return await updateProcessClassAction(queryClient, formData);
			case FORM_IDENTIFIERS.createProcessType:
				return await createProcessTypeAction(queryClient, formData);
			case FORM_IDENTIFIERS.deleteProcessType:
				return await deleteProcessTypeAction(queryClient, formData);
			case FORM_IDENTIFIERS.updateProcessType:
				return await updateProcessTypeAction(queryClient, formData);
		}

		return null;
	};

const createProcessClassAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const response = await api
		.createProcessClass({
			Description: formData.get("name") as string,
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

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.process_types]});

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const deleteProcessClassAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const response = await api
		.deleteProcessClass(Number(formData.get("id")))
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.process_types]});

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const updateProcessClassAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const cache = queryClient
		.getQueryCache()
		.find([QUERY_KEYS.process_types]);

	const { processClasses: cachedProcessClasses } = cache?.state
		.data as ProcessTypes;

	const matchingProcessClass = cachedProcessClasses.find(
		(d) => d.ID === Number(formData.get("id"))
	);

	if (!matchingProcessClass) {
		return {
			message: "Process Class doesn't exist",
			type: "error",
		};
	}

	const processClass = ObjectUtilities.deepCopy(matchingProcessClass);
	const clonedProcessClass = ObjectUtilities.deepCopy(processClass);

	hydrateProcessClass(clonedProcessClass, formData);

	if (ObjectUtilities.areEqual(processClass, clonedProcessClass))
		return {
			type: "success",
		};

	let errorData: ResponseData | undefined;

	const response = await api
		.updateProcessClass(clonedProcessClass)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.process_types]});

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrateProcessClass = (
	clonedProcessClass: ProcessClassData,
	formData: FormData
) => {
	const { name } = Object.fromEntries(formData.entries());

	if (name) {
		clonedProcessClass.Description = name as string;
	}
};

const createProcessTypeAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const handlingDefinition = formData.get("handlingProcessDefinition") as
		| string
		| null;
	const taskDefinition = formData.get("taskProcessDefinition") as
		| string
		| null;

	let errorData: ResponseData | undefined;

	const response = await api
		.createProcessType({
			Description: formData.get("name") as string,
			ClassID: Number(formData.get("classId")),
			CategoryID: Number(formData.get("processCategory")),
			HandlingDefinitionID: handlingDefinition
				? JSON.parse(handlingDefinition)?.ID
				: null,
			TaskDefinitionID: taskDefinition
				? JSON.parse(taskDefinition)?.ID
				: null,
			DefaultItemsCovered: Number(formData.get("defaultItemsCovered")),
			Rest: Number(formData.get("rest")),
			Contingency: Number(formData.get("contingency")),
			GroupMember: formData.get("groupMember") === "yes",
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

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.process_types]});

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const deleteProcessTypeAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const id = Number(formData.get("id"));
	let errorData: ResponseData | undefined;

	const response = await api
		.deleteProcessType(id)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.process_types]});

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const updateProcessTypeAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const cache = queryClient
		.getQueryCache()
		.find([QUERY_KEYS.process_types]);

	const { processTypes: cachedProcessTypes } = cache?.state
		.data as ProcessTypes;

	const matchingProcessType = cachedProcessTypes.find(
		(d) => d.ID === Number(formData.get("id"))
	);

	if (!matchingProcessType) {
		return {
			message: "Process Type doesn't exist",
			type: "error",
		};
	}

	const processType = ObjectUtilities.deepCopy(matchingProcessType);
	const clonedProcessType = ObjectUtilities.deepCopy(processType);

	hydrateProcessType(clonedProcessType, formData);

	if (ObjectUtilities.areEqual(processType, clonedProcessType))
		return {
			type: "success",
		};

	let errorData: ResponseData | undefined;
	const response = await api
		.updateProcessType(clonedProcessType)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.process_types]});

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrateProcessType = (
	clonedProcessType: ProcessTypeData,
	formData: FormData
) => {
	const { name, defaultItemsCovered, rest, contingency, groupMember } =
		Object.fromEntries(formData.entries());

	if (name) {
		clonedProcessType.Description = name as string;
	}

	if (defaultItemsCovered) {
		clonedProcessType.DefaultItemsCovered = Number(defaultItemsCovered);
	}

	if (rest) {
		clonedProcessType.Rest = Number(rest);
	}

	if (contingency) {
		clonedProcessType.Contingency = Number(contingency);
	}

	if (groupMember) {
		clonedProcessType.GroupMember = groupMember === "yes";
	}
};
