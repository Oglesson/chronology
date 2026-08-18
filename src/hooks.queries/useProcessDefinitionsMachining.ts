import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ProcessDefinitionsMachiningData } from "../api.common/types";
import { processDefinitionsMachiningQuery } from "../queries.common/processDefinitionsMachiningQuery";

export const useProcessDefinitionsMachining = () => {
	const query = useQuery(processDefinitionsMachiningQuery());
	const processDefinitionsMachining =
		query.data as AxiosResponse<ProcessDefinitionsMachiningData>;

	return processDefinitionsMachining?.data ?? {};
};
