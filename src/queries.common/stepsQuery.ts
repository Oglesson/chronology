import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { StepData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const stepsQuery = (
	nm: boolean = false
): QueryObserverOptions<AxiosResponse<StepData[]>> => ({
	queryKey: [nm ? QUERY_KEYS.stepsNM : QUERY_KEYS.steps],
	queryFn: async () => {
		const steps = (await nm)
			? api.getNonMachiningSteps()
			: api.getSteps();

		if (!steps) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return steps;
	},
	staleTime: 1000 * 60 * 5,
});
