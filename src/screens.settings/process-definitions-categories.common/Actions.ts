import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import api from "../../api.common";
import {
	ProcessDefinitionsCategoryData,
	ResponseData,
	ResponseMessage,
} from "../../api.common/types";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

export const processDefinitionCategoriesAction =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const formData = await request.formData();
		const { identifier } = Object.fromEntries(formData.entries());

		switch (identifier) {
			case FORM_IDENTIFIERS.updateProcessDefinitionCategory:
				return await updateProcessDefinitionCategory(
					queryClient,
					formData
				);
		}

		return null;
	};

export const updateProcessDefinitionCategory = async (
	queryClient: QueryClient,
	formData: FormData
) => {
	const cache = queryClient
		.getQueryCache()
		.find(QUERY_KEYS.process_definition_categories);

	const { data: cachedCategories } = cache?.state.data as AxiosResponse<
		ProcessDefinitionsCategoryData[]
	>;

	const matchingCategory = cachedCategories.find(
		(d) => d.ID === Number(formData.get("id"))
	);

	if (!matchingCategory) {
		return {
			message: "Process Definition Category doesn't exist",
			type: "error",
		};
	}

	const category = ObjectUtilities.deepCopy(matchingCategory);
	const clonedCategory = ObjectUtilities.deepCopy(category);

	hydrate(clonedCategory, formData);

	if (ObjectUtilities.areEqual(category, clonedCategory))
		return {
			type: "success",
		};

	let errorData: ResponseData | undefined;

	const response = await api
		.updateDefinitionCategory(clonedCategory)
		.catch((e: AxiosError) => {
			errorData = {
				code: e.response?.status,
				message: e.response?.statusText,
				responseMessage: e.response?.data as ResponseMessage,
				type: "error",
			};
		});

	if (errorData) return errorData;

	await queryClient.invalidateQueries(
		QUERY_KEYS.process_definition_categories
	);

	return {
		code: (response as AxiosResponse).status,
		message: (response as AxiosResponse).statusText,
		type: "success",
	};
};

const hydrate = (
	clonedCategory: ProcessDefinitionsCategoryData,
	formData: FormData
) => {
	const { description, explanation } = Object.fromEntries(formData.entries());

	if (description !== undefined) {
		clonedCategory.Description = description as string;
	}

	if (explanation !== undefined) {
		clonedCategory.Explanation = explanation as string;
	}
};
