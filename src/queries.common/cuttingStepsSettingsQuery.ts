import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { CuttingStepSettingData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const cuttingStepsSettingsQuery = (): QueryObserverOptions<
	AxiosResponse<CuttingStepSettingData[]>
> => ({
	queryKey: QUERY_KEYS.settings_cutting_steps,
	queryFn: async () => {
		const settings = await api.getCuttingStepsSettings();

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
});
