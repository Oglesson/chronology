import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { DepartmentData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const departmentSettingsQuery = (): QueryObserverOptions<
	AxiosResponse<DepartmentData[]>
> => ({
	queryKey: QUERY_KEYS.settings_departments,
	queryFn: async () => {
		const departments = await api.getDepartments();

		if (!departments) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return departments;
	},
	staleTime: 1000 * 60 * 5,
});
