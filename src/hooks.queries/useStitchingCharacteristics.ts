import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { StitchingCharacteristicsData } from "../api.common/types";
import { stitchingCharacteristicsQuery } from "../queries.common/stitchingCharacteristicsQuery";

export const useStitchingCharacteristics = () => {
	const query = useQuery(stitchingCharacteristicsQuery());
	const stitchingCharacteristics =
		query.data as AxiosResponse<StitchingCharacteristicsData>;

	return stitchingCharacteristics?.data ?? {};
};
