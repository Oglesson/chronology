import { AxiosResponse } from "axios";
import { RouteObject } from "react-router-dom";
import { ProcessDefinitionData } from "../api.common/types";
import { TextLink } from "../components/common/textLink/TextLink";
import { queryClient } from "../context.common/GlobalContext";
import { Description } from "../screens.process-definition/definition.description/Index";
import { StepsForPathFeatures } from "../screens.process-definition/definition.steps-for-path-features/Index";
import { definitionStepsForPathFeaturesLoader } from "../screens.process-definition/definition.steps-for-path-features/Loaders";
import { StepsForPath } from "../screens.process-definition/definition.steps-for-path/Index";
import { definitionStepsForPathLoader } from "../screens.process-definition/definition.steps-for-path/Loaders";
import { Steps } from "../screens.process-definition/definition.steps/Index";
import { definitionStepsLoader } from "../screens.process-definition/definition.steps/Loaders";
import { processDefinitionAction } from "../screens.process-definition/definition.index/Actions";
import { ProcessDefinition } from "../screens.process-definition/definition.index/Index";
import { Layout as ProcessDefinitionLayout } from "../screens.process-definition/definition.index/Layout";
import { processDefinitionLoader } from "../screens.process-definition/definition.index/Loaders";

const descriptionRoute: RouteObject = {
	path: "description",
	element: <Description />,
	action: processDefinitionAction(queryClient),
};

const stepsRoute: RouteObject = {
	path: "steps",
	element: <Steps />,
	action: processDefinitionAction(queryClient),
	loader: definitionStepsLoader(queryClient),
};

const stepsForPathRoute: RouteObject = {
	path: "steps-for-path",
	element: <StepsForPath />,
	action: processDefinitionAction(queryClient),
	loader: definitionStepsForPathLoader(queryClient),
};

const stepsForPathFeaturesRoute: RouteObject = {
	path: "steps-for-path-features",
	element: <StepsForPathFeatures />,
	action: processDefinitionAction(queryClient),
	loader: definitionStepsForPathFeaturesLoader(queryClient),
};

export const processDefinitionRoute: RouteObject = {
	path: "/processes/definitions/:id",
	element: <ProcessDefinitionLayout />,
	action: processDefinitionAction(queryClient),
	loader: processDefinitionLoader(queryClient),
	children: [
		{
			index: true,
			element: <ProcessDefinition />,
			action: processDefinitionAction(queryClient),
		},
		descriptionRoute,
		stepsRoute,
		stepsForPathRoute,
		stepsForPathFeaturesRoute,
	],
	handle: {
		breadcrumb: async (data: {
			result: Promise<{
				definition: AxiosResponse<ProcessDefinitionData>;
			}>;
		}) => {
			const result = await data.result;
			const { Code, ID } = result.definition.data;

			return [
				<TextLink to="/processes" text="Processes" />,
				<TextLink to="/processes/definitions" text="Definitions" />,
				<TextLink to={`/processes/definitions/${ID}`} text={Code} />,
			];
		},
	},
};
