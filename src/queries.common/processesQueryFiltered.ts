import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { ProcessData, ProcessQueryFilters } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const processesQueryFiltered = ({
	deptID,
	classID,
	typeID,
	concise,
}: ProcessQueryFilters): QueryObserverOptions<
	AxiosResponse<ProcessData[]>
> => ({
	queryKey: [QUERY_KEYS.processes_filtered],
	queryFn: async () => {
		const processes = await api.getFilteredProcesses(
			deptID,
			classID,
			typeID,
			concise
		);

		if (!processes) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return processes;
	},
});
