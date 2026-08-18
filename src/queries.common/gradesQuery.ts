import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { GradeData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const gradesQuery = (): QueryObserverOptions<
	AxiosResponse<GradeData[]>
> => ({
	queryKey: QUERY_KEYS.settings_grades,
	queryFn: async () => {
		const grades = await api.getGrades();

		if (!grades) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return grades;
	},
	staleTime: 1000 * 60 * 30,
});
