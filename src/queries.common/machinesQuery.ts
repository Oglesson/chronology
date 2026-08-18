import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { MachineData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const machinesQuery = (): QueryObserverOptions<
	AxiosResponse<MachineData[]>
> => ({
	queryKey: QUERY_KEYS.settings_machining_machines,
	queryFn: async () => {
		const machines = await api.getMachines();

		if (!machines) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return machines;
	},
});
