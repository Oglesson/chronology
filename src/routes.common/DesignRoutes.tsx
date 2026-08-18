import { AxiosResponse } from "axios";
import { RouteObject } from "react-router-dom";
import { DesignData } from "../api.common/types";
import { TextLink } from "../components/common/textLink/TextLink";
import { queryClient } from "../context.common/GlobalContext";
import { About } from "../screens.design/design.about";
import { notesAction, styleAction } from "../screens.design/design.index/Actions";
import { Style } from "../screens.design/design.index/Index";
import { Layout as StyleLayout } from "../screens.design/design.index/Layout";
import { styleLoader } from "../screens.design/design.index/Loaders";

const aboutRoute: RouteObject = {
	path: "about",
	element: <About />,
	action: notesAction(queryClient),
};

export const styleRoute: RouteObject = {
	path: "/designs/:id",
	element: <StyleLayout />,
	action: styleAction(queryClient),
	loader: styleLoader(queryClient),
	children: [
		{
			index: true,
			element: <Style />,
			action: styleAction(queryClient),
			loader: styleLoader(queryClient),
		},
		aboutRoute,
	],
	handle: {
		breadcrumb: async (data: {
			result: Promise<{ style: AxiosResponse<DesignData> }>;
		}) => {
			const result = await data.result;
			const { Code, ID } = result.style.data;

			return [
				<TextLink to="/designs" text="Designs" />,
				<TextLink to={`/styles/${ID}`} text={Code} />,
			];
		},
	},
};
