import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { StitchingModifierData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const systemStitchingModifiersQuery = (): QueryObserverOptions<
	AxiosResponse<StitchingModifierData[]>
> => ({
	queryKey: QUERY_KEYS.system_machining_stitching_modifiers,
	queryFn: async () => {
		const settings = await api.getSystemStitchingModifiers();

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
	staleTime: 1000 * 60 * 30,
});
