import { redirect, RouteObject } from "react-router-dom";
import { queryClient } from "../context.common/GlobalContext";
import { companyAction } from "../screens.settings/company.common/Actions";
import { Company } from "../screens.settings/company.common/Index";
import { companyLoader } from "../screens.settings/company.common/Loaders";
import { updateCuttingAction } from "../screens.settings/cutting.common/Actions";
import { Cutting } from "../screens.settings/cutting.common/Index";
import { cuttingLoader } from "../screens.settings/cutting.common/Loaders";
import { departmentsAction } from "../screens.settings/departments.common/Actions";
import { Departments } from "../screens.settings/departments.common/Index";
import { departmentsLoader } from "../screens.settings/departments.common/Loaders";
import { StepsConfiguration } from "../screens.settings/steps-configuration.common";
import { configurationAction } from "../screens.settings/steps-configuration.common/Actions";
import { configurationLoader } from "../screens.settings/steps-configuration.common/Loaders";
import { gradeAction } from "../screens.settings/grades.common/Actions";
import { Grades } from "../screens.settings/grades.common/Index";
import { gradesLoader } from "../screens.settings/grades.common/Loaders";
import { Layout } from "../screens.settings/Layout";
import { machiningAction } from "../screens.settings/machining.common/Actions";
import { Machining } from "../screens.settings/machining.common/Index";
import { machiningLoader } from "../screens.settings/machining.common/Loaders";
import { processDefinitionCategoriesAction } from "../screens.settings/process-definitions-categories.common/Actions";
import { ProcessDefinitionCategories } from "../screens.settings/process-definitions-categories.common/Index";
import { processDefinitionCategoriesLoader } from "../screens.settings/process-definitions-categories.common/Loaders";
import { pathsAction } from "../screens.settings/paths.common/Actions";
import { Paths } from "../screens.settings/paths.common/Index";
import { pathsLoader } from "../screens.settings/paths.common/Loaders";
import { performanceAction } from "../screens.settings/performance.common/Actions";
import { Performance } from "../screens.settings/performance.common/Index";
import { performanceLoader } from "../screens.settings/performance.common/Loaders";

//#region steps configuration
const stepsConfigurationRoute: RouteObject = {
	path: "steps-configuration",
	element: <StepsConfiguration />,
	action: configurationAction(queryClient),
	loader: configurationLoader(queryClient),
};
//#endregion

//#region steps configuration
const processDefinitionCategories: RouteObject = {
	path: "process-definition-categories",
	element: <ProcessDefinitionCategories />,
	action: processDefinitionCategoriesAction(queryClient),
	loader: processDefinitionCategoriesLoader(queryClient),
};
//#endregion

//#region company
const companyRoute: RouteObject = {
	path: "company",
	element: <Company />,
	action: companyAction(queryClient),
	loader: companyLoader(queryClient),
};
//#endregion

//#region departments
const departmentsRoute: RouteObject = {
	path: "departments",
	element: <Departments />,
	action: departmentsAction(queryClient),
	loader: departmentsLoader(queryClient),
};
//#endregion

//#region machining
const machiningRoute: RouteObject = {
	path: "machining",
	element: <Machining />,
	action: machiningAction(queryClient),
	loader: machiningLoader(queryClient),
};
//#endregion

//#region cutting
const cuttingRoute: RouteObject = {
	path: "cutting",
	element: <Cutting />,
	action: updateCuttingAction(queryClient),
	loader: cuttingLoader(queryClient),
};
//#endregion

//# region paths
const pathsRoute: RouteObject = {
	path: "paths",
	element: <Paths />,
	action: pathsAction(queryClient),
	loader: pathsLoader(queryClient),
};
//#endregion

//#region grades
const gradesRoute: RouteObject = {
	path: "grades",
	element: <Grades />,
	action: gradeAction(queryClient),
	loader: gradesLoader(queryClient),
};
//#endregion

//#region performance
const performanceRoute: RouteObject = {
	path: "performance",
	element: <Performance />,
	action: performanceAction(queryClient),
	loader: performanceLoader(queryClient),
};
//#endregion

export const indexRoute: RouteObject = {
	index: true,
	loader: async () => redirect("steps-configuration"),
};

export const systemRoute: RouteObject = {
	path: "/settings",
	element: <Layout />,
	children: [
		stepsConfigurationRoute,
		processDefinitionCategories,
		indexRoute,
		companyRoute,
		departmentsRoute,
		machiningRoute,
		cuttingRoute,
		pathsRoute,
		gradesRoute,
		performanceRoute,
	],
};
