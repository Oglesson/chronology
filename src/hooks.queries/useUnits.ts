import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { UnitData } from "../api.common/types";
import { SelectOption } from "../forms.common/Select";
import { unitsQuery } from "../queries.common/unitsQuery";

export const useUnits = () => {
	const query = useQuery(unitsQuery());
	const units: UnitData[] = [];

	if (query?.data) {
		const data = query?.data as AxiosResponse<UnitData[]>;
		units.push(...data.data);
	}

	const unitOptions = units?.map((unit): SelectOption => {
		return { label: unit?.Description.replace("*_", ""), value: unit?.ID };
	});

	return { units, unitOptions };
};
