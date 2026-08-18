import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { CuttingMethodData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const cuttingMethodsNaturalQuery = (): QueryObserverOptions<
	AxiosResponse<CuttingMethodData[]>
> => ({
	queryKey: QUERY_KEYS.system_cutting_methods_natural,
	queryFn: async () => {
		const settings = await api.getCuttingMethodsNatural();

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
});

export const cuttingMethodsSyntheticQuery = (): QueryObserverOptions<
	AxiosResponse<CuttingMethodData[]>
> => ({
	queryKey: QUERY_KEYS.system_cutting_methods_synthetic,
	queryFn: async () => {
		const settings = await api.getCuttingMethodsSynthetic();

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
});
