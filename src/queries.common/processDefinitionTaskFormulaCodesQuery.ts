import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import { ProcessDefinitionTaskFormulaCodeData } from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

export const processDefinitionTaskFormulaCodesQuery =
	(): QueryObserverOptions<
		AxiosResponse<ProcessDefinitionTaskFormulaCodeData[]>
	> => ({
		queryKey: QUERY_KEYS.process_definition_task_formulas,
		queryFn: async () => {
			const codes = await api.getProcessDefinitionTaskFormulaCodes();

			if (!codes) {
				throw new Response("", {
					status: 404,
					statusText:
						"Process Definition Task Formula Codes could not be found.",
				});
			}

			return codes;
		},
		staleTime: 1000 * 60 * 60,
	});
