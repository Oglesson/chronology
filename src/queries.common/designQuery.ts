import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { DesignData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const designQuery = (
	id: string
): QueryObserverOptions<AxiosResponse<DesignData>> => ({
	queryKey: [QUERY_KEYS.style, id],
	queryFn: async () => {
		const style = await api.getStyleById(Number(id));

		if (!style) {
			throw new Response("", {
				status: 404,
				statusText: `Style with ID ${id} could not be found.`,
			});
		}

		return style;
	},
	staleTime: 1000 * 60 * 60,
});
