import { RouteObject } from "react-router-dom";
import { TextLink } from "../components/common/textLink/TextLink";
import { queryClient } from "../context.common/GlobalContext";
import { processDefinitionsAction } from "../screens.process-definitions/Actions";
import { ProcessDefinitions } from "../screens.process-definitions/Index";
import { processDefinitionsLoader } from "../screens.process-definitions/Loaders";
import { processTypesAction } from "../screens.process-types/Actions";
import { ProcessTypes } from "../screens.process-types/Index";
import { processTypesLoader } from "../screens.process-types/Loaders";
import { processesAction } from "../screens.processes/Actions";
import { Processes } from "../screens.processes/Index";
import { Layout as ProcessesLayout } from "../screens.processes/Layout";
import { processesLoader } from "../screens.processes/Loaders";

const definitionsRoute: RouteObject = {
	path: "definitions",
	element: <ProcessDefinitions />,
	action: processDefinitionsAction(queryClient),
	loader: processDefinitionsLoader(queryClient),
};

const typesRoute: RouteObject = {
	path: "types",
	element: <ProcessTypes />,
	action: processTypesAction(queryClient),
	loader: processTypesLoader(queryClient),
};

export const processesRoute: RouteObject = {
	path: "/processes",
	element: <ProcessesLayout />,
	loader: processesLoader(queryClient),
	children: [
		{
			index: true,
			element: <Processes />,
			action: processesAction(queryClient),
			loader: processesLoader(queryClient),
		},
		definitionsRoute,
		typesRoute,
	],
	handle: {
		breadcrumb: () => <TextLink to="/processes" text="Processes" />,
	},
};
