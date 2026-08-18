import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { MachiningAmendmentData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const machiningAmendmentsQuery = (): QueryObserverOptions<
	AxiosResponse<MachiningAmendmentData[]>
> => ({
	queryKey: QUERY_KEYS.settings_machining_amendments,
	queryFn: async () => {
		const settings = await api.getMachiningAmendments();

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
});

export const machiningAmendmentsByCategoryQuery = (
	id: string
): QueryObserverOptions<AxiosResponse<MachiningAmendmentData[]>> => ({
	queryKey: [QUERY_KEYS.settings_machining_amendments, id],
	queryFn: async () => {
		const settings = await api.getMachiningAmendmentsForCategory(
			Number(id)
		);

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
});
