import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { StitchingModifierData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const stitchingModifiersQuery = (): QueryObserverOptions<
	AxiosResponse<StitchingModifierData[]>
> => ({
	queryKey: QUERY_KEYS.settings_machining_stitching_modifiers,
	queryFn: async () => {
		const settings = await api.getStitchingModifiers();

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
	staleTime: 1000 * 60 * 15,
});
