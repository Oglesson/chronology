import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { MachiningStepSettingData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const machiningStepsSettingsQuery = (): QueryObserverOptions<
	AxiosResponse<MachiningStepSettingData[]>
> => ({
	queryKey: QUERY_KEYS.settings_machining_steps,
	queryFn: async () => {
		const settings = await api.getMachiningStepsSettings();

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
});
