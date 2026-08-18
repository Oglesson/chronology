import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { GeneralSettingsData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const generalSettingsQuery = (): QueryObserverOptions<
	AxiosResponse<GeneralSettingsData>
> => ({
	queryKey: QUERY_KEYS.settings_general,
	queryFn: async () => {
		const settings = await api.getGeneralSettings();

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
});
