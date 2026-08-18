import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, Method } from "axios";
import { redirect } from "react-router-dom";
import api from "../../api.common";
import {
	ResponseData,
	ResponseMessage,
	DesignData,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";

export const stylesAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const method = request.method as Method;
		const formData = await request.formData();
		switch (method) {
			case "DELETE":
				return await deleteStyleAction(queryClient, formData);
			case "POST":
				if (formData.get("id")) {
					return await copyDesignAction(queryClient, formData);
				} else {
					return await createStyleAction(queryClient, formData);
				}
		}

		return null;
	};

const createStyleAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const { code, description, pairsCosted, photo } = Object.fromEntries(
		formData.entries()
	);

	const photoFile = photo as File;
	if (photoFile && photoFile.name && photoFile.size) {
		const photoFormData = new FormData();

		photoFormData.append("Filename", photo);

		let errorData: ResponseData | undefined;

		await api.uploadStyleFile(photoFormData).catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				type: "error",
			};
		});

		if (errorData) return errorData;
	}

	let errorData: ResponseData | undefined;

	const response = await api
		.createStyle({
			Code: (code as string).toUpperCase(),
			Description: description as string,
			PairsCosted: Number(pairsCosted),
			PhotoURL: (photo as File).name,
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

	const style = response as AxiosResponse<DesignData>;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.styles]});

	return redirect(`/styles/${style.data.ID}`);
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

	return redirect(`/styles/${style?.data.ID}`);
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

	return null;
};
