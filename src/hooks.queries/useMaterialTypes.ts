import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { MaterialTypeData } from "../api.common/types";
import { SelectOption } from "../forms.common/Select";
import { materialTypesQuery } from "../queries.common/materialTypesQuery";

export const useMaterialTypes = () => {
	const query = useQuery(materialTypesQuery());
	const materialTypes: MaterialTypeData[] = [];

	if (query?.data) {
		const data = query?.data as AxiosResponse<MaterialTypeData[]>;
		materialTypes.push(...data.data);
	}

	const materialTypeOptions = materialTypes?.map(
		(materialType): SelectOption => {
			return {
				label: materialType.Description.replace("*_", ""),
				value: materialType.ID,
			};
		}
	);

	return { materialTypes, materialTypeOptions };
};
