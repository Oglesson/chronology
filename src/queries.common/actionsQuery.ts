import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { ActionData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const actionsQuery = (): QueryObserverOptions<
	AxiosResponse<ActionData[]>
> => ({
	queryKey: [QUERY_KEYS.actions],
	queryFn: async () => {
		const actions = await api.getActions();

		if (!actions) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return actions;
	},
	staleTime: 1000 * 60 * 5,
});
