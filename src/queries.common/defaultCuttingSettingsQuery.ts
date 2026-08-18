import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { ProcessDefinitionsDefaultCuttingData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const defaultCuttingSettingsQuery = (): QueryObserverOptions<
	AxiosResponse<ProcessDefinitionsDefaultCuttingData>
> => ({
	queryKey: QUERY_KEYS.settings_cutting_process_definitions_default_cutting,
	queryFn: async () => {
		const settings = await api.getProcessDefinitionsDefaultCutting();

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
});
