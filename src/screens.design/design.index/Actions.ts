import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, Method } from "axios";
import { Params, redirect } from "react-router-dom";
import api from "../../api.common";
import {
	ResponseData,
	ResponseMessage,
	DesignData,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const styleAction =
	(queryClient: QueryClient) =>
	async ({ request, params }: { request: Request; params: Params }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "DELETE":
				return await deleteStyleAction(queryClient, formData);
			case "PUT":
				return await updateStyleAction(queryClient, formData, params);
			case "POST":
				if (formData.get("identifier") === "create-style-department") {
					return await createDesignDepartmentAction(
						queryClient,
						formData,
						params
					);
				} else {
					return await copyDesignAction(queryClient, formData);
				}
		}

		return null;
	};

const createDesignDepartmentAction = async (
	queryClient: QueryClient,
	formData: FormData,
	params: Params
) => {
	let errorData: ResponseData | undefined;

	const response = await api
		.createDesignDepartment({
			DesignID: Number(params.id),
			DepartmentID: Number(formData.get("department")),
			BatchSize: Number(formData.get("batchSize")),
			PairsCosted: Number(formData.get("pairsCosted")),
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

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.style, params.id]});

	return redirect(`${response?.data.ID}`);
};

export const notesAction =
	(queryClient: QueryClient) =>
	async ({ request, params }: { request: Request; params: Params }) => {
		const method = request.method as Method;
		const formData = await request.formData();

		switch (method) {
			case "PUT":
				return await updateStyleAction(queryClient, formData, params);
		}

		return null;
	};

const copyDesignAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const style = await api
		.copyDesign({
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

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.styles]});

	return redirect(`/styles/${style?.data?.ID}`);
};

const deleteStyleAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const id = formData.get("id");
	let errorData: ResponseData | undefined;

	await api.deleteStyle(Number(id)).catch((e: AxiosError) => {
		errorData = {
			code: e.response?.status,
			message: e.response?.statusText,
			responseMessage: e.response?.data as ResponseMessage,
			type: "error",
		};
	});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.styles]});
	queryClient.removeQueries({queryKey: [QUERY_KEYS.style, id]});

	return redirect("/designs");
};

const updateStyleAction = async (
	queryClient: QueryClient,
	formData: FormData,
	params: Params
) => {
	const cache = queryClient
		.getQueryCache()
		.find([QUERY_KEYS.style, params.id]);

	const { data: cachedStyle } = cache?.state.data as AxiosResponse<DesignData>;

	const style = ObjectUtilities.deepCopy(cachedStyle);
	const clonedStyle = ObjectUtilities.deepCopy(style);
	const hydration = await hydrate(clonedStyle, formData);

	if (Object.keys(hydration || {}).length) return hydration;

	if (ObjectUtilities.areEqual(style, clonedStyle))
		return {
			type: "success",
		};

	let errorData: ResponseData | undefined;
	const response = await api
		.updateStyle(clonedStyle)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.styles]});
	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.style, params.id]});

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = async (clonedStyle: DesignData, formData: FormData) => {
	const { code, description, pairsCosted, notes, photo } = Object.fromEntries(
		formData.entries()
	);

	if (code) {
		clonedStyle.Code = (code as string).toUpperCase();
	}

	if (description !== undefined) {
		clonedStyle.Description = description as string;
	}

	if (pairsCosted) {
		clonedStyle.PairsCosted = Number(pairsCosted);
	}

	if (notes !== undefined) {
		clonedStyle.Notes = notes as string;
	}

	if (photo !== undefined) {
		if ((photo as string).length) {
			// ! TODO: React Router actions are horrible at dealing with files. Need to find a proper way to handle this
			const step = document.getStepById(
				"photo"
			) as HTMLInputElement;
			const photoFormData = new FormData();

			photoFormData.append("Filename", step.files![0]);

			let errorData: ResponseData | undefined;

			await api.uploadStyleFile(photoFormData).catch((e: AxiosError) => {
				errorData = {
					code: e.response?.status,
					message: e.response?.statusText,
					responseMessage: e.response?.data as ResponseMessage,
					type: "error",
				};
			});

			if (errorData) return errorData;

			clonedStyle.PhotoURL = step.files![0].name;
		} else {
			clonedStyle.PhotoURL = photo as string;
		}
	}
};
