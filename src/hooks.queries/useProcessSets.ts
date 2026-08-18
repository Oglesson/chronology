import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ProcessSetData } from "../api.common/types";
import { processSetsQuery } from "../queries.common/processSetsQuery";

export const useProcessSets = () => {
	const query = useQuery(processSetsQuery());

	const processSets = query.data as AxiosResponse<ProcessSetData[]>;

	return {
		processSets: processSets?.data,
		processSetCodes: processSets?.data?.map((processSet) =>
			processSet.Code.toLowerCase()
		),
	};
};
