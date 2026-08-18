import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { ProcessData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const processQuery = (
	id: string
): QueryObserverOptions<AxiosResponse<ProcessData>> => ({
	queryKey: [QUERY_KEYS.process, id],
	queryFn: async () => {
		const process = await api.getProcessById(Number(id));

		if (!process) {
			throw new Response("", {
				status: 404,
				statusText: `Process with ID ${id} could not be found.`,
			});
		}

		const whereUsed = (await api.getProcessWhereUsed(Number(id)))?.data;
		const occasionsUsed = (await api.getProcessOccasionsUsed(Number(id)))
			?.data;

		process.data.WhereUsed = whereUsed;
		process.data.OccasionsUsed = occasionsUsed.OccasionsUsed;
		process.data.IsInUse =
			occasionsUsed.OccasionsUsed !== undefined &&
			occasionsUsed.OccasionsUsed > 0;

		return process;
	},
	staleTime: 1000 * 60 * 30,
});
