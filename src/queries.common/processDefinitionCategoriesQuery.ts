import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { ProcessDefinitionsCategoryData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const processDefinitionCategoriesQuery = (): QueryObserverOptions<
	AxiosResponse<ProcessDefinitionsCategoryData[]>
> => ({
	queryKey: QUERY_KEYS.process_definition_categories,
	queryFn: async () => {
		const categories = await api.getDefinitionCategories();

		if (!categories) {
			throw new Response("", {
				status: 404,
				statusText: "Categories Not Found",
			});
		}

		return categories;
	},
	staleTime: 1000 * 60 * 30,
});
