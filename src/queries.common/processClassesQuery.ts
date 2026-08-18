import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { ProcessClassData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const processClassesQuery = (): QueryObserverOptions<
	AxiosResponse<ProcessClassData[]>
> => ({
	queryKey: [QUERY_KEYS.process_classes],
	queryFn: async () => {
		const processClasses = await api.getProcessClasses();

		if (!processClasses) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return processClasses;
	},
	staleTime: 1000 * 60 * 10,
});
