import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { ProcessData } from "../api.common/types";
import { processQuery } from "../queries.common/processQuery";

export const useProcess = () => {
	const params = useParams();
	const query = useQuery(processQuery(params.id as string));
	const process = query.data as AxiosResponse<ProcessData>;

	return process?.data ?? {};
};
