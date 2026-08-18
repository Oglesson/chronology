import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import { TabbedNavigation } from "../../navigation.tabbed/TabbedNavigation";
import { Details } from "./partials/_Details";
import { DesignDepartmentContextProvider } from "./partials/_DesignDepartmentContext";
import { DesignContextProvider } from "../design.index/partials/_DesignContext";

export const Layout = () => {
	const { t } = useTranslation();

	return (
		<AwaitLoaderData>
			<DesignDepartmentContextProvider>
				<DesignContextProvider>
					<Details />
				</DesignContextProvider>
				<TabbedNavigation
					items={[
						{
							text: "Processes",
							to: "",
						},
						{
							text: t("notes"),
							to: "notes",
						},
					]}
				/>
				<div className="mt-12">
					<Outlet />
				</div>
			</DesignDepartmentContextProvider>
		</AwaitLoaderData>
	);
};
