import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import { TabbedNavigation } from "../../navigation.tabbed/TabbedNavigation";
import { Details } from "./partials/_Details";
import { DesignContextProvider } from "./partials/_DesignContext";

export const Layout = () => {
	const { t } = useTranslation();

	return (
		<AwaitLoaderData>
			<DesignContextProvider>
				<Details />
				<TabbedNavigation
					items={[
						{
							text: t("departments"),
							to: "",
						},
						{
							text: t("about"),
							to: "about",
						},
					]}
				/>
				<div className="mt-12">
					<Outlet />
				</div>
			</DesignContextProvider>
		</AwaitLoaderData>
	);
};
