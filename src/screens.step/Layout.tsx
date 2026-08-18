import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { AwaitLoaderData } from "../components/common/loader/AwaitLoaderData";
import { TabbedNavigation } from "../navigation.tabbed/TabbedNavigation";
import { Details } from "./partials/_Details";
import { ItemsContextProvider } from "./partials/_ActionItemsContext";

export const Layout = () => {
	const { t } = useTranslation();

	return (
		<AwaitLoaderData>
			<ItemsContextProvider>
				<Details />
				<TabbedNavigation
					items={[
						{ text: "Actions", to: "" },
						{ text: t("about"), to: "about" },
						{ text: t("usedBy"), to: "used-by" },
					]}
				/>
				<div className="mt-15">
					<Outlet />
				</div>
			</ItemsContextProvider>
		</AwaitLoaderData>
	);
};
