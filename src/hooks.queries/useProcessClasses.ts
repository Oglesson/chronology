import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ProcessClassData } from "../api.common/types";
import { processClassesQuery } from "../queries.common/processClassesQuery";

export const useProcessClasses = () => {
	const query = useQuery(processClassesQuery());
	const processes = query.data as AxiosResponse<ProcessClassData[]>;

	return processes?.data ?? [];
};
