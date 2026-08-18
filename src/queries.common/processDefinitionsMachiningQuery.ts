import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { ProcessDefinitionsMachiningData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const processDefinitionsMachiningQuery = (): QueryObserverOptions<
	AxiosResponse<ProcessDefinitionsMachiningData>
> => ({
	queryKey: QUERY_KEYS.settings_machining_process_definitions_machining,
	queryFn: async () => {
		const settings = await api.getProcessDefinitionsMachining();

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
});
