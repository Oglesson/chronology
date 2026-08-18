import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { StitchingModifierData } from "../api.common/types";
import { SelectOption } from "../forms.common/Select";
import { systemStitchingModifiersQuery } from "../queries.common/systemStitchingModifiersQuery";

export const useSystemStitchingModifiers = () => {
	const query = useQuery(systemStitchingModifiersQuery());
	const systemStitchingModifiers: StitchingModifierData[] = [];

	if (query?.data) {
		const data = query?.data as AxiosResponse<StitchingModifierData[]>;
		systemStitchingModifiers.push(...data.data);
	}

	const systemStitchingModifierOptions = systemStitchingModifiers?.map(
		(stitchingModifier): SelectOption => {
			return {
				label: stitchingModifier?.Description,
				value: stitchingModifier?.ID,
			};
		}
	);

	return { systemStitchingModifiers, systemStitchingModifierOptions };
};
