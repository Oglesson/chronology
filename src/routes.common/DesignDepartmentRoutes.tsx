import { AxiosResponse } from "axios";
import { RouteObject } from "react-router-dom";
import { DesignData, DesignDepartmentData } from "../api.common/types";
import { TextLink } from "../components/common/textLink/TextLink";
import { queryClient } from "../context.common/GlobalContext";
import {
	notesAction,
	styleDepartmentAction,
} from "../screens.design/design.department/Actions";
import { Department } from "../screens.design/design.department/Index";
import { Layout as DepartmentLayout } from "../screens.design/design.department/Layout";
import { styleDepartmentLoader } from "../screens.design/design.department/Loaders";
import { Notes } from "../screens.design/design.department/Notes";

const notesRoute: RouteObject = {
	path: "notes",
	element: <Notes />,
	action: notesAction(queryClient),
};

export const styleDepartmentRoute: RouteObject = {
	path: "/designs/:id/:departmentId",
	element: <DepartmentLayout />,
	action: styleDepartmentAction(queryClient),
	loader: styleDepartmentLoader(queryClient),
	children: [
		{
			index: true,
			element: <Department />,
			action: styleDepartmentAction(queryClient),
			loader: styleDepartmentLoader(queryClient),
		},
		notesRoute,
	],
	handle: {
		breadcrumb: async (data: {
			result: Promise<{
				styleDepartment: AxiosResponse<DesignDepartmentData>;
				style: AxiosResponse<DesignData>;
			}>;
		}) => {
			const result = await data.result;
			const { _Department } = result.styleDepartment.data;
			const { Code, ID } = result.style.data;

			return [
				<TextLink to="/designs" text="Designs" />,
				<TextLink to={`/styles/${ID}`} text={Code} />,
				<TextLink
					to={`/styles/${ID}/${_Department?.ID}`}
					text={_Department?.Description || ""}
				/>,
			];
		},
	},
};
