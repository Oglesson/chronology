import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../layout.common/Layout";
import { Error } from "../components/common/error/Error";
import { stepRoute } from "./StepRoutes";
import { stepsRoute } from "./StepsRoutes";
import { indexRoute } from "./IndexRoutes";
import { actionsRoute } from "./ActionsRoutes";
import { processDefinitionRoute } from "./ProcessDefinitionRoutes";
import { processRoute } from "./ProcessRoutes";
import { processesRoute } from "./ProcessesRoutes";
import { styleRoute } from "./DesignRoutes";
import { stylesRoute } from "./DesignsRoutes";
import { systemRoute } from "./SystemRoutes";
import { styleDepartmentRoute } from "./DesignDepartmentRoutes";
import { processSetRoute } from "./ProcessSetRoutes";
import { refreshRoute } from "./RefreshRoutes";
import { auditsRoute } from "./AuditRoutes";
import { privacyPolicyRoute } from "./PrivacyPolicyRoutes";
import { termsOfUseRoute } from "./TermsOfUseRoutes";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			indexRoute,
			actionsRoute,
			stepsRoute,
			stepRoute,
			processesRoute,
			processRoute,
			processDefinitionRoute,
			stylesRoute,
			styleRoute,
			systemRoute,
			styleDepartmentRoute,
			processSetRoute,
			refreshRoute,
			auditsRoute,
			privacyPolicyRoute,
			termsOfUseRoute,
		],
		errorElement: <Error />,
	},
]);
