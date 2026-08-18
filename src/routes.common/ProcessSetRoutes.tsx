import { AxiosResponse } from "axios";
import { RouteObject } from "react-router-dom";
import { ProcessSetData } from "../api.common/types";
import { TextLink } from "../components/common/textLink/TextLink";
import { queryClient } from "../context.common/GlobalContext";
import { processSetAction } from "../screens.designs/designs.process-set/Actions";
import { ProcessSet } from "../screens.designs/designs.process-set/Index";
import { processSetLoader } from "../screens.designs/designs.process-set/Loaders";

export const processSetRoute: RouteObject = {
	path: "/designs/process-sets/:id",
	element: <ProcessSet />,
	action: processSetAction(queryClient),
	loader: processSetLoader(queryClient),
	handle: {
		breadcrumb: async (data: {
			result: Promise<{ processSet: AxiosResponse<ProcessSetData> }>;
		}) => {
			const result = await data.result;
			const { Code, ID } = result.processSet.data;

			return [
				<TextLink to="/designs" text="Designs" />,
				<TextLink to="/designs/process-sets" text="Process Sets" />,
				<TextLink to={`/styles/process-sets/${ID}`} text={Code} />,
			];
		},
	},
};
