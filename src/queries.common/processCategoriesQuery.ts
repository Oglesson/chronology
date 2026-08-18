import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { ProcessCategoryData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const processCategoriesQuery = (): QueryObserverOptions<
	AxiosResponse<ProcessCategoryData[]>
> => ({
	queryKey: [QUERY_KEYS.process_categories],
	queryFn: async () => {
		const processCategories = await api.getProcessCategories();

		if (!processCategories) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return processCategories;
	},
});
