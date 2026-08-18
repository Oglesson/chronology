import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { UnitData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const unitsQuery = (): QueryObserverOptions<
	AxiosResponse<UnitData[]>
> => ({
	queryKey: QUERY_KEYS.system_units,
	queryFn: async () => {
		const settings = await api.getUnits();

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
});
