import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { StitchingCharacteristicsData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const stitchingCharacteristicsQuery = (): QueryObserverOptions<
	AxiosResponse<StitchingCharacteristicsData>
> => ({
	queryKey: QUERY_KEYS.settings_machining_stitching_characteristics,
	queryFn: async () => {
		const settings = await api.getStitchingCharacteristics();

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
});
