import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ProcessDefinitionTaskFormulaCodeData } from "../api.common/types";
import { processDefinitionTaskFormulaCodesQuery } from "../queries.common/processDefinitionTaskFormulaCodesQuery";

export const useProcessDefinitionTaskFormulaCodes = () => {
	const query = useQuery(processDefinitionTaskFormulaCodesQuery());
	const processDefinitionTaskFormulaCodes = query.data as AxiosResponse<
		ProcessDefinitionTaskFormulaCodeData[]
	>;

	return processDefinitionTaskFormulaCodes?.data ?? [];
};
