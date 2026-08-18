import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { ProcessDefinitionData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const processDefinitionsQuery = (): QueryObserverOptions<
	AxiosResponse<ProcessDefinitionData[]>
> => ({
	queryKey: [QUERY_KEYS.process_definitions],
	queryFn: async () => {
		const definitions = await api.getProcessDefinitions();

		if (!definitions) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return definitions;
	},
	staleTime: 1000 * 60 * 10,
});
