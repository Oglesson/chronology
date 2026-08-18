import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ProcessCategoryData } from "../api.common/types";
import { SelectOption } from "../forms.common/Select";
import { processCategoriesQuery } from "../queries.common/processCategoriesQuery";

export const useProcessCategories = () => {
	const query = useQuery(processCategoriesQuery());
	const processCategories: ProcessCategoryData[] = [];

	if (query?.data) {
		const data = query?.data as AxiosResponse<ProcessCategoryData[]>;
		processCategories.push(...data.data);
	}

	const processCategoryOptions = processCategories?.map(
		(category): SelectOption => {
			return { label: category?.Description, value: category?.ID };
		}
	);

	return { processCategories, processCategoryOptions };
};
