import { AxiosResponse } from "axios";
import { RouteObject } from "react-router-dom";
import { ActionData } from "../api.common/types";
import { TextLink } from "../components/common/textLink/TextLink";
import { queryClient } from "../context.common/GlobalContext";
import { actionAction } from "../screens.action/Actions";
import { Action } from "../screens.action/Index";
import { actionLoader } from "../screens.action/Loaders";
import { actionsAction } from "../screens.actions/Actions";
import { Actions } from "../screens.actions/Index";
import { actionsLoader } from "../screens.actions/Loaders";

const actionRoute: RouteObject = {
	path: ":id",
	element: <Action />,
	loader: actionLoader(queryClient),
	action: actionAction(queryClient),
	handle: {
		breadcrumb: async (data: {
			result: Promise<{ action: AxiosResponse<ActionData> }>;
		}) => {
			const result = await data.result;
			const { Code, ID } = result.action.data;

			return <TextLink to={`/actions/${ID}`} text={Code} />;
		},
	},
};

export const actionsRoute: RouteObject = {
	path: "/actions",
	action: actionsAction(queryClient),
	children: [
		{
			index: true,
			element: <Actions />,
			action: actionsAction(queryClient),
			loader: actionsLoader(queryClient),
		},
		actionRoute,
	],
	handle: {
		breadcrumb: () => <TextLink to="/actions" text="Actions" />,
	},
};
