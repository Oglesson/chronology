import { RouteObject } from "react-router-dom";
import { TextLink } from "../components/common/textLink/TextLink";
import { queryClient } from "../context.common/GlobalContext";
import { stepsAction } from "../screens.steps/Actions";
import { Steps } from "../screens.steps/Index";
import { stepsLoader } from "../screens.steps/Loaders";

export const stepsRoute: RouteObject = {
	path: "/steps",
	element: <Steps />,
	action: stepsAction(queryClient),
	loader: stepsLoader(queryClient),
	handle: {
		breadcrumb: () => <TextLink to="/steps" text="Steps" />,
	},
};
