import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { ProcessData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const processesQuery = (): QueryObserverOptions<
	AxiosResponse<ProcessData[]>
> => ({
	queryKey: [QUERY_KEYS.processes],
	queryFn: async () => {
		const processes = await api.getProcesss();

		if (!processes) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return processes;
	},
});
