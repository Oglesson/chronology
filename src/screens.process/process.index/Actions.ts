import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, Method } from "axios";
import { Params, redirect } from "react-router-dom";
import api from "../../api.common";
import {
	ProcessCreationStatus,
	ProcessData,
	ResponseData,
	ResponseMessage,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const processAction =
	(queryClient: QueryClient) =>
	async ({ request, params }: { request: Request; params: Params }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "DELETE":
				return await deleteProcessAction(queryClient, formData);
			case "PUT":
				return await updateProcessAction(
					queryClient,
					formData,
					params
				);
			case "POST":
				return await copyProcessAction(queryClient, formData);
		}

		return null;
	};

const deleteProcessAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const id = formData.get("id");
	let errorData: ResponseData | undefined;

	await api.deleteProcess(Number(id)).catch((e: AxiosError) => {
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

	return redirect("/processes");
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

	return redirect(`/processes/${process?.data?.ID}`);
};

const updateProcessAction = async (
	queryClient: QueryClient,
	formData: FormData,
	params: Params
) => {
	const cache = queryClient
		.getQueryCache()
		.find([QUERY_KEYS.process, params.id]);
	const { data: cachedProcess } = cache?.state
		.data as AxiosResponse<ProcessData>;
	const process = ObjectUtilities.deepCopy(cachedProcess);
	const clonedProcess = ObjectUtilities.deepCopy(process);
	const hydration = await hydrate(clonedProcess, formData);

	if (Object.keys(hydration || {}).length) return hydration;

	let errorData: ResponseData | undefined;

	const response = await api
		.updateProcess(clonedProcess)
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
	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.process, params.id]});

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = async (clonedProcess: ProcessData, formData: FormData) => {
	const { code, notes, description, departmentId, photo } =
		Object.fromEntries(formData.entries());

	clonedProcess.UpdateMap = {
		Cutting: {
			Header: false,
			Knives: false,
		},
		AdditionalSteps: false,
		Group: false,
		Header: false,
		Machining_Folding: false,
		Machining_Pallet_Stitching: false,
		Machining_Stitching: false,
		Machining_Strobel_Stitching: false,
		Points: false,
		QuestionsAnswers: false,
		Unmanned: false,
	};

	const status: ProcessCreationStatus =
		clonedProcess.CreationStatus === "ocsComplete"
			? "ocsReadyToComplete"
			: "ocsIntermediate";

	if (code) {
		clonedProcess.UpdateMap.Header = true;
		clonedProcess.CreationStatus = status;
		clonedProcess.Code = (code as string).toUpperCase();
	}

	if (notes !== undefined) {
		clonedProcess.UpdateMap.Header = true;
		clonedProcess.CreationStatus = status;
		clonedProcess.Notes = notes as string;
	}

	if (description !== undefined) {
		clonedProcess.UpdateMap.Header = true;
		clonedProcess.CreationStatus = status;
		clonedProcess.Description = description as string;
	}

	if (departmentId) {
		clonedProcess.UpdateMap.Header = true;
		clonedProcess.CreationStatus = status;
		clonedProcess.DepartmentID = Number(departmentId);
	}

	if (photo !== undefined) {
		clonedProcess.UpdateMap.Header = true;
		clonedProcess.CreationStatus = status;

		if ((photo as string).length) {
			// ! TODO: React Router actions are horrible at dealing with files. Need to find a proper way to handle this
			const step = document.getStepById(
				"photo"
			) as HTMLInputElement;
			const photoFormData = new FormData();

			photoFormData.append("Filename", step.files![0]);

			let errorData: ResponseData | undefined;

			await api
				.uploadProcessFile(photoFormData)
				.catch((e: AxiosError) => {
					errorData = {
						code: e.response?.status,
						message: e.response?.statusText,
						responseMessage: e.response?.data as ResponseMessage,
						type: "error",
					};
				});

			if (errorData) return errorData;

			clonedProcess.PhotoURL = step.files![0].name;
		} else {
			clonedProcess.PhotoURL = photo as string;
		}
	}
};
