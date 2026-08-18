import { AxiosResponse } from "axios";
import { RouteObject } from "react-router-dom";
import { ProcessData } from "../api.common/types";
import { TextLink } from "../components/common/textLink/TextLink";
import { queryClient } from "../context.common/GlobalContext";
import { About } from "../screens.process/process.about/Index";
import { processAction } from "../screens.process/process.index/Actions";
import { Process } from "../screens.process/process.index/Index";
import { Layout as ProcessLayout } from "../screens.process/process.index/Layout";
import { processLoader } from "../screens.process/process.index/Loaders";
import { processQuestionsAction } from "../screens.process/process.questions/Actions";
import { Questions } from "../screens.process/process.questions/Index";
import { processQuestionsLoader } from "../screens.process/process.questions/Loaders";
import { UsedBy } from "../screens.process/process.used-by/Index";
import { Path } from "../screens.process/process.path/Index";

const questionsRoute: RouteObject = {
	path: "questions",
	element: <Questions />,
	action: processQuestionsAction(queryClient),
	loader: processQuestionsLoader(queryClient),
};

const aboutRoute: RouteObject = {
	path: "about",
	element: <About />,
	action: processAction(queryClient),
};

const pathRoute: RouteObject = {
	path: "path",
	element: <Path />,
};

const usedByRoute: RouteObject = {
	path: "used-by",
	element: <UsedBy />,
};

export const processRoute: RouteObject = {
	path: "/processes/:id",
	element: <ProcessLayout />,
	action: processAction(queryClient),
	loader: processLoader(queryClient),
	children: [
		{
			index: true,
			element: <Process />,
		},
		questionsRoute,
		aboutRoute,
		pathRoute,
		usedByRoute,
	],
	handle: {
		breadcrumb: async (data: {
			result: Promise<{ process: AxiosResponse<ProcessData> }>;
		}) => {
			const result = await data.result;
			const { Code, ID } = result.process.data;

			return [
				<TextLink to="/processes" text="Processes" />,
				<TextLink to={`/processes/${ID}`} text={Code} />,
			];
		},
	},
};
