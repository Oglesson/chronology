import { QueryObserverOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from "../api.common";
import {
	ProcessDefinitionData,
	ProcessDefinitionQuestionData,
	ProcessDefinitionQuestionGroup,
} from "../api.common/types";
import { QUERY_KEYS } from "../constants.common/queryKeys";

interface Dictionary {
	[key: string]: ProcessDefinitionQuestionData[];
}

export const processDefinitionQuery = (
	id: string
): QueryObserverOptions<AxiosResponse<ProcessDefinitionData>> => ({
	queryKey: [QUERY_KEYS.process_definition, id],
	queryFn: async () => {
		const processDefinition = await api.getProcessDefinitionById(
			Number(id)
		);

		if (!processDefinition) {
			throw new Response("", {
				status: 404,
				statusText: `Process definition with ID ${id} could not be found.`,
			});
		}

		const questionGroups: ProcessDefinitionQuestionGroup[] = [];

		const groupById = processDefinition.data?.Questions?.reduce(
			(r: Dictionary, a) => {
				r[a.QuestionColumnID] = [...(r[a.QuestionColumnID] || []), a];
				return r;
			},
			{}
		);

		if (groupById) {
			const keys = Object.keys(groupById);

			for (const key of keys) {
				const definitionCategory = await api.getDefinitionCategoryById(
					Number(key)
				);
				questionGroups.push({
					QuestionColumnID: Number(key),
					QuestionColumnDescription:
						definitionCategory?.data?.Description,
					Questions: groupById[key],
				});
			}
		}

		processDefinition.data.QuestionGroups = questionGroups;

		const getID = Number(id);

		const occasionsUsed = await api.getProcessDefinitionOccasionsUsed(
			getID
		);

		const occasionsUsedOnProcesses =
			await api.getProcessDefinitionOccasionsUsedOnProcesses(getID);

		processDefinition.data.OccasionsUsed =
			occasionsUsed.data.OccasionsUsed;

		processDefinition.data.IsInUse =
			occasionsUsed.data.OccasionsUsed !== undefined &&
			occasionsUsed.data.OccasionsUsed > 0;

		processDefinition.data.IsInUseByOp =
			occasionsUsedOnProcesses.data.OccasionsUsed !== undefined &&
			occasionsUsedOnProcesses.data.OccasionsUsed > 0;

		return processDefinition;
	},
	staleTime: 1000 * 20,
});
