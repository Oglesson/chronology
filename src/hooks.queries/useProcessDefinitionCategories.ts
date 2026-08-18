import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ProcessDefinitionsCategoryData } from "../api.common/types";
import { processDefinitionCategoriesQuery } from "../queries.common/processDefinitionCategoriesQuery";

export const useProcessDefinitionCategories = () => {
	const query = useQuery(processDefinitionCategoriesQuery());

	const categories = query.data as AxiosResponse<
		ProcessDefinitionsCategoryData[]
	>;

	return categories?.data ?? [];
};
