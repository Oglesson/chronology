import { AxiosResponse } from "axios";
import { RouteObject } from "react-router-dom";
import { StepData } from "../api.common/types";
import { TextLink } from "../components/common/textLink/TextLink";
import { queryClient } from "../context.common/GlobalContext";
import { stepAction, notesAction } from "../screens.step/Actions";
import { Step } from "../screens.step/Index";
import { Layout as StepLayout } from "../screens.step/Layout";
import { stepLoader } from "../screens.step/Loaders";
import { About } from "../screens.step/About";
import { UsedBy } from "../screens.step/UsedBy";

const notesRoute: RouteObject = {
	path: "about",
	element: <About />,
	action: notesAction(queryClient),
};

const usedByRoute: RouteObject = {
	path: "used-by",
	element: <UsedBy />,
};

export const stepRoute: RouteObject = {
	path: "/steps/:id",
	element: <StepLayout />,
	action: stepAction(queryClient),
	loader: stepLoader(queryClient),
	children: [
		{
			index: true,
			element: <Step />,
			action: stepAction(queryClient),
		},
		notesRoute,
		usedByRoute,
	],
	handle: {
		breadcrumb: async (data: {
			result: Promise<{ step: AxiosResponse<StepData> }>;
		}) => {
			const result = await data.result;
			const { Code, ID } = result.step.data;

			return [
				<TextLink to="/steps" text="Steps" />,
				<TextLink to={`/steps/${ID}`} text={Code} />,
			];
		},
	},
};
