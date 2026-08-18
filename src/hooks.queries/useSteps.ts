import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { StepData } from "../api.common/types";
import { stepsQuery } from "../queries.common/stepsQuery";

export const useSteps = (nm: boolean = false) => {
	const query = useQuery(stepsQuery(nm));
	const data = query.data as AxiosResponse<StepData[]>;
	const steps = data?.data;

	return {
		steps,
		stepCodes: steps?.map((step) => step.Code.toLowerCase()),
		nonMachiningSteps: steps
			?.filter((step) => !step.Machining)
			.map((nonMachStep) => {
				return { Code: nonMachStep.Code, ID: nonMachStep.ID };
			}),
	};
};
