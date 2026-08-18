import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { CuttingTypeData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const cuttingTypesQuery = (): QueryObserverOptions<
	AxiosResponse<CuttingTypeData[]>
> => ({
	queryKey: QUERY_KEYS.system_cutting_types,
	queryFn: async () => {
		const settings = await api.getCuttingTypes();

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
});
