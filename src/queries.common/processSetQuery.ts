import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { ProcessSetData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const processSetQuery = (
	id: string
): QueryObserverOptions<AxiosResponse<ProcessSetData>> => ({
	queryKey: [QUERY_KEYS.process_set, id],
	queryFn: async () => {
		const processSet = await api.getProcessSetById(Number(id));

		if (!processSet) {
			throw new Response("", {
				status: 404,
				statusText: `Process Set with ID ${id} could not be found.`,
			});
		}

		return processSet;
	},
	staleTime: 1000 * 60 * 60,
});
