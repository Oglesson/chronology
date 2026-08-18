import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ActionData } from "../api.common/types";
import { actionsQuery } from "../queries.common/actionsQuery";

export const useActions = () => {
	const query = useQuery(actionsQuery());
	const actions = query.data as AxiosResponse<ActionData[]>;

	return {
		actions: actions?.data,
		actionCodes: actions?.data?.map((action) => action.Code.toLowerCase()),
	};
};
