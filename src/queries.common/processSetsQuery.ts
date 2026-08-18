import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { ProcessSetData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const processSetsQuery = (): QueryObserverOptions<
	AxiosResponse<ProcessSetData[]>
> => ({
	queryKey: [QUERY_KEYS.process_sets],
	queryFn: async () => {
		const processSets = await api.getProcessSets();

		if (!processSets) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return processSets;
	},
});
