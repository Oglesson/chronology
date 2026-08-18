import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ProcessData, ProcessQueryFilters } from "../api.common/types";
import { processesQueryFiltered } from "../queries.common/processesQueryFiltered";

export const useProcessesFiltered = ({
	deptID = 0,
	classID = 0,
	typeID = 0,
	concise = false,
}: ProcessQueryFilters) => {
	const query = useQuery(
		processesQueryFiltered({ deptID, classID, typeID, concise })
	);
	const data = query.data as AxiosResponse<ProcessData[]>;
	const filteredProcesses = data?.data;

	return {
		filteredProcesses,
	};
};
