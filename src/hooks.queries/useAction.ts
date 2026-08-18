import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { ActionData } from "../api.common/types";
import { actionQuery, actionByCodeQuery } from "../queries.common/actionQuery";

export const useAction = (byID: boolean = true, code?: string) => {
	const params = useParams();
	const query = useQuery(
		byID
			? actionQuery(params.id as string)
			: actionByCodeQuery(code as string)
	);
	const action = query.data as AxiosResponse<ActionData>;

	return action?.data ?? {};
};
