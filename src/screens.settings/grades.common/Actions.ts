import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, Method } from "axios";
import api from "../../api.common";
import {
	GradeData,
	ResponseData,
	ResponseMessage,
} from "../../api.common/types";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";
import { updateCompanyAction } from "../company.common/Actions";

export const gradeAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const method = request.method as Method;
		const formData = await request.formData();
		const { defaultGradeId } = Object.fromEntries(formData.entries());

		switch (method) {
			case "DELETE":
				return await deleteGradeAction(queryClient, formData);
			case "POST":
				return await createGradeAction(queryClient, formData);
			case "PUT":
				if (defaultGradeId) {
					return await updateCompanyAction(queryClient, formData);
				}

				return await updateGradeAction(queryClient, formData);
		}

		return null;
	};

const createGradeAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const response = await api
		.createGrade({
			Code: (formData.get("code") as string).toUpperCase(),
			Rate: Number(formData.get("ratePerMinute")),
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

	await queryClient.invalidateQueries(QUERY_KEYS.settings_grades);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const deleteGradeAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	let errorData: ResponseData | undefined;

	const response = await api
		.deleteGrade(Number(formData.get("id")))
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries(QUERY_KEYS.settings_grades);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const updateGradeAction = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const cache = queryClient.getQueryCache().find(QUERY_KEYS.settings_grades);

	const { data: cachedGrades } = cache?.state.data as AxiosResponse<
		GradeData[]
	>;

	const matchingGrade = cachedGrades.find(
		(d) => d.ID === Number(formData.get("id"))
	);

	if (!matchingGrade) {
		return {
			message: "Grade doesn't exist",
			type: "error",
		};
	}

	const grade = ObjectUtilities.deepCopy(matchingGrade);
	const clonedGrade = ObjectUtilities.deepCopy(grade);

	hydrate(clonedGrade, formData);

	if (ObjectUtilities.areEqual(grade, clonedGrade))
		return {
			type: "success",
		};

	let errorData: ResponseData | undefined;
	const response = await api
		.updateGrade(clonedGrade)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries(QUERY_KEYS.settings_general);
	await queryClient.invalidateQueries(QUERY_KEYS.settings_grades);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = (clonedGrade: GradeData, formData: FormData) => {
	const { code, ratePerMinute } = Object.fromEntries(formData.entries());

	if (code) {
		clonedGrade.Code = (code as string).toUpperCase();
	}

	if (ratePerMinute) {
		clonedGrade.Rate = Number(ratePerMinute);
	}
};
