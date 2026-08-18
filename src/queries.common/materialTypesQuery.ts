import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { MaterialTypeData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const materialTypesQuery = (): QueryObserverOptions<
	AxiosResponse<MaterialTypeData[]>
> => ({
	queryKey: QUERY_KEYS.system_material_types,
	queryFn: async () => {
		const settings = await api.getMaterialTypes();

		if (!settings) {
			throw new Response("", {
				status: 404,
				statusText: "Not Found",
			});
		}

		return settings;
	},
});
