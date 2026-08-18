import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { StepData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const stepQuery = (
	id: string
): QueryObserverOptions<AxiosResponse<StepData>> => ({
	queryKey: [QUERY_KEYS.step, id],
	queryFn: async () => {
		const step = await api.getStepById(Number(id));

		if (!step) {
			throw new Response("", {
				status: 404,
				statusText: `Step with ID ${id} could not be found.`,
			});
		}

		const whereUsed = (await api.getStepWhereUsed(Number(id)))?.data;
		const occasionsUsed = (await api.getStepOccasionsUsed(Number(id)))
			?.data;

		step.data.WhereUsed = whereUsed;
		step.data.OccasionsUsed = occasionsUsed.OccasionsUsed;
		step.data.IsInUse =
			occasionsUsed.OccasionsUsed !== undefined &&
			occasionsUsed.OccasionsUsed > 0;

		return step;
	},
	staleTime: 1000 * 60 * 60,
});
