import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { StitchingModifierData } from "../api.common/types";
import { SelectOption } from "../forms.common/Select";
import { stitchingModifiersQuery } from "../queries.common/stitchingModifiersQuery";

export const useStitchingModifiers = () => {
	const query = useQuery(stitchingModifiersQuery());
	const stitchingModifiers: StitchingModifierData[] = [];

	if (query?.data) {
		const data = query?.data as AxiosResponse<StitchingModifierData[]>;
		stitchingModifiers.push(...data.data);
	}

	const stitchingModifierOptions = stitchingModifiers?.map(
		(stitchingModifier): SelectOption => {
			return {
				label: stitchingModifier?.Description,
				value: stitchingModifier?.ID,
			};
		}
	);

	return { stitchingModifiers, stitchingModifierOptions };
};
