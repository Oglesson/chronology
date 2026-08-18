import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { ProcessDefinitionData } from "../api.common/types";
import { processDefinitionQuery } from "../queries.common/processDefinitionQuery";

export const useProcessDefinition = () => {
	const params = useParams();
	const query = useQuery(processDefinitionQuery(params.id as string));
	const processDefinition =
		query.data as AxiosResponse<ProcessDefinitionData>;

	return processDefinition?.data ?? {};
};
