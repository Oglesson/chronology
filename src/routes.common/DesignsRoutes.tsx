import { RouteObject } from "react-router-dom";
import { TextLink } from "../components/common/textLink/TextLink";
import { queryClient } from "../context.common/GlobalContext";
import { stylesAction } from "../screens.designs/designs.index/Actions";
import { Styles } from "../screens.designs/designs.index/Index";
import { Layout as StylesLayout } from "../screens.designs/designs.index/Layout";
import { stylesLoader } from "../screens.designs/designs.index/Loaders";
import { processSetsAction } from "../screens.designs/designs.process-sets/Actions";
import { ProcessSets } from "../screens.designs/designs.process-sets/Index";
import { processSetsLoader } from "../screens.designs/designs.process-sets/Loaders";

const processSetsRoute: RouteObject = {
	path: "process-sets",
	element: <ProcessSets />,
	action: processSetsAction(queryClient),
	loader: processSetsLoader(queryClient),
};

export const stylesRoute: RouteObject = {
	path: "/designs",
	element: <StylesLayout />,
	action: stylesAction(queryClient),
	children: [
		{
			index: true,
			element: <Styles />,
			action: stylesAction(queryClient),
			loader: stylesLoader(queryClient),
		},
		processSetsRoute,
	],
	handle: {
		breadcrumb: () => <TextLink to="/designs" text="Designs" />,
	},
};
