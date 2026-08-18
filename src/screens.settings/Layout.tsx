import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useMatches } from "react-router-dom";
import { TabbedNavigation } from "../navigation.tabbed/TabbedNavigation";

export const Layout = () => {
	const { t } = useTranslation();
	const match = useMatches().at(-1);

	const [createButton, setCreateButton] = useState<ReactNode>(<></>);

	useEffect(() => {
		if (
			match?.pathname.endsWith("steps-configuration") ||
			match?.pathname.endsWith("process-definition-categories") ||
			match?.pathname.endsWith("company") ||
			match?.pathname.endsWith("cutting") ||
			match?.pathname.endsWith("performance")
		) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setCreateButton(<></>);
		}
	}, [match]);

	return (
		<SystemContext.Provider
			value={{
				createButton,
				setCreateButton,
			}}
		>
			<div className="flex justify-between items-end mb-16">
				<h1 className="typo-large">{t("settings")}</h1>
				{createButton}
			</div>

			<TabbedNavigation
				items={[
					{
						text: t("stepsConfiguration"),
						to: "steps-configuration",
					},
					{
						text: t("processDefinitionCategories"),
						to: "process-definition-categories",
					},
					{ text: t("company"), to: "company" },
					{
						text: t("departments"),
						to: "departments",
					},
					{ text: t("machining"), to: "machining" },
					{ text: t("cutting"), to: "cutting" },
					{ text: t("pathFeatures"), to: "paths" },
					{ text: t("grades"), to: "grades" },
					{
						text: t("performanceLevel"),
						to: "performance",
					},
				]}
			/>
			<div className="mt-10">
				<Outlet />
			</div>
		</SystemContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const SystemContext = createContext<{
	createButton: ReactNode;
	setCreateButton: Dispatch<SetStateAction<ReactNode>>;
}>({
	createButton: <></>,
	setCreateButton: () => {},
});
