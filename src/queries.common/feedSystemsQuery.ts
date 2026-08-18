import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { FeedSystemData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const feedSystemsQuery = (): QueryObserverOptions<
	AxiosResponse<FeedSystemData[]>
> => ({
	queryKey: QUERY_KEYS.system_feed_systems,
	queryFn: async () => {
		const settings = await api.getFeedSystems();

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
});
