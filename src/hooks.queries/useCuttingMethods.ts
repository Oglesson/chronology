import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { CuttingMethodData } from "../api.common/types";
import { SelectOption } from "../forms.common/Select";
import {
	cuttingMethodsNaturalQuery,
	cuttingMethodsSyntheticQuery,
} from "../queries.common/cuttingMethodsQuery";

export const useCuttingMethodsNatural = () => {
	const query = useQuery(cuttingMethodsNaturalQuery());
	const cuttingMethodsNatural: CuttingMethodData[] = [];

	if (query?.data) {
		const data = query?.data as AxiosResponse<CuttingMethodData[]>;
		cuttingMethodsNatural.push(...data.data);
	}

	const cuttingMethodNaturalOptions = cuttingMethodsNatural?.map(
		(cuttingMethod): SelectOption => {
			return {
				label: cuttingMethod.Description.replace("*_", ""),
				value: cuttingMethod.ID,
			};
		}
	);

	return { cuttingMethodsNatural, cuttingMethodNaturalOptions };
};

export const useCuttingMethodsSynthetic = () => {
	const query = useQuery(cuttingMethodsSyntheticQuery());
	const cuttingMethodsSynthetic: CuttingMethodData[] = [];

	if (query?.data) {
		const data = query?.data as AxiosResponse<CuttingMethodData[]>;
		cuttingMethodsSynthetic.push(...data.data);
	}

	const cuttingMethodSyntheticOptions = cuttingMethodsSynthetic?.map(
		(cuttingMethod): SelectOption => {
			return {
				label: cuttingMethod.Description.replace("*_", ""),
				value: cuttingMethod.ID,
			};
		}
	);

	return { cuttingMethodsSynthetic, cuttingMethodSyntheticOptions };
};
