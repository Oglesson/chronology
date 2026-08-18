import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { ActionData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const actionQuery = (
	id: string
): QueryObserverOptions<AxiosResponse<ActionData>> => ({
	queryKey: [QUERY_KEYS.action, id],
	queryFn: async () => {
		const action = await api.getActionById(Number(id));

		if (!action) {
			throw new Response("", {
				status: 404,
				statusText: `Action with ID ${id} could not be found.`,
			});
		}

		const whereUsed = (await api.getActionWhereUsed(Number(id)))?.data;
		const occasionsUsed = (await api.getActionOccasionsUsed(Number(id)))
			?.data;

		action.data.WhereUsed = whereUsed;
		action.data.OccasionsUsed = occasionsUsed.OccasionsUsed;
		action.data.IsInUse =
			occasionsUsed.OccasionsUsed !== undefined &&
			occasionsUsed.OccasionsUsed > 0;

		return action;
	},
	staleTime: 1000 * 60 * 60,
});

export const actionByCodeQuery = (
	code: string
): QueryObserverOptions<AxiosResponse<ActionData>> => ({
	queryKey: [QUERY_KEYS.action, code],
	queryFn: async () => {
		const action = await api.getActionByCode(String(code));

		if (!action) {
			throw new Response("", {
				status: 404,
				statusText: `Action with Code ${code} could not be found.`,
			});
		}

		return action;
	},
	staleTime: 1000 * 60 * 60 * 30,
});
