import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { DesignData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const designsQuery = (): QueryObserverOptions<
	AxiosResponse<DesignData[]>
> => ({
	queryKey: [QUERY_KEYS.styles],
	queryFn: async () => {
		const styles = await api.getStyles();

		if (!styles) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return styles;
	},
	staleTime: 1000 * 60 * 5,
});
