import { QueryObserverOptions } from "@tanstack/react-query";
import api from "../api.common";
import { ProcessClassData, ProcessTypeData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export type ProcessTypes = {
	processTypes: ProcessTypeData[];
	groupedProcessTypes: GroupedProcessTypes;
	processClasses: ProcessClassData[];
};

export type GroupedProcessTypes = {
	[key: string]: ProcessTypeData[];
};

export const processTypesQuery =
	(): QueryObserverOptions<ProcessTypes> => ({
		queryKey: [QUERY_KEYS.process_types],
		queryFn: async () => {
			const processTypes = await api.getProcessTypes();
			const processClasses = await api.getProcessClasses();

			if (!processTypes) {
				throw new Response("", {
					status: 404,
					statusText: `Process types could not be found.`,
				});
			}

			const groupedProcessTypes = processTypes.data?.reduce(
				(r: GroupedProcessTypes, a) => {
					if (a._Class) {
						r[a._Class.Description] = [
							...(r[a._Class.Description] || []),
							a,
						];
					}
					return r;
				},
				{}
			);

			return {
				processTypes: processTypes.data || [],
				groupedProcessTypes,
				processClasses: processClasses.data || [],
			};
		},
		staleTime: 1000 * 60 * 60,
	});
