import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { ProcessSetData } from "../api.common/types";
import { processSetQuery } from "../queries.common/processSetQuery";

export const useProcessSet = () => {
	const params = useParams();
	const query = useQuery(processSetQuery(params.id as string));
	const processSets = query.data as AxiosResponse<ProcessSetData>;

	return processSets?.data ?? {};
};
