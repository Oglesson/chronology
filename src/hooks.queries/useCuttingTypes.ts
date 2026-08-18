import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { CuttingTypeData } from "../api.common/types";
import { SelectOption } from "../forms.common/Select";
import { cuttingTypesQuery } from "../queries.common/cuttingTypesQuery";

export const useCuttingTypes = () => {
	const query = useQuery(cuttingTypesQuery());
	const cuttingTypes: CuttingTypeData[] = [];

	if (query?.data) {
		const data = query?.data as AxiosResponse<CuttingTypeData[]>;
		cuttingTypes.push(...data.data);
	}

	const cuttingTypeOptions = cuttingTypes?.map(
		(cuttingType): SelectOption => {
			return {
				label: cuttingType.Description.replace("*_", ""),
				value: cuttingType.ID,
			};
		}
	);

	return { cuttingTypes, cuttingTypeOptions };
};
