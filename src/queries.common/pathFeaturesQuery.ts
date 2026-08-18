import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { PathFeatureData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const pathFeaturesQuery = (): QueryObserverOptions<
	AxiosResponse<PathFeatureData[]>
> => ({
	queryKey: QUERY_KEYS.settings_machining_process_definitions_path_features,
	queryFn: async () => {
		const pathFeatures = await api.getPathFeatures();

		if (!pathFeatures) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return pathFeatures;
	},
	staleTime: 1000 * 60 * 15,
});
