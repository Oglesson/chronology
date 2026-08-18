import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ProcessDefinitionData } from "../api.common/types";
import { processDefinitionsQuery } from "../queries.common/processDefinitionsQuery";

export const useProcessDefinitions = () => {
	const query = useQuery(processDefinitionsQuery());
	const data = query.data as AxiosResponse<ProcessDefinitionData[]>;
	const processDefinitions = data?.data;

	return {
		processDefinitions,
		processDefinitionCodes: processDefinitions?.map(
			(processDefinition) => processDefinition.Code.toLowerCase()
		),
	};
};
