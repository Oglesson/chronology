import { RouteObject } from "react-router-dom";
import { TextLink } from "../components/common/textLink/TextLink";
import { queryClient } from "../context.common/GlobalContext";
import { Audit } from "../screens.audit/Index";
import { auditLoader } from "../screens.audit/Loaders";

export const auditsRoute: RouteObject = {
	path: "/audit",
	element: <Audit />,
	loader: auditLoader(queryClient),
	handle: {
		breadcrumb: () => <TextLink to="/audit" text="Audit" />,
	},
};
