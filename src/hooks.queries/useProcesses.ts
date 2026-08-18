import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ProcessData } from "../api.common/types";
import { processesQuery } from "../queries.common/processesQuery";

export const useProcesses = () => {
	const query = useQuery(processesQuery());
	const data = query.data as AxiosResponse<ProcessData[]>;
	const processes = data?.data;

	return {
		processes,
		processCodes: processes?.map((process) =>
			process.Code.toLowerCase()
		),
	};
};
