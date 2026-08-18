import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { DesignDepartmentData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const designDepartmentQuery = (
	id: string
): QueryObserverOptions<AxiosResponse<DesignDepartmentData>> => ({
	queryKey: [QUERY_KEYS.design_department, id],
	queryFn: async () => {
		const styleDepartment = await api.getDesignDepartmentById(Number(id));

		if (!styleDepartment) {
			throw new Response("", {
				status: 404,
				statusText: `Style Department with ID ${id} could not be found.`,
			});
		}

		return styleDepartment;
	},
	staleTime: 1000 * 60 * 10,
});
