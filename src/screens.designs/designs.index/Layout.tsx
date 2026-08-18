import { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { TabbedNavigation } from "../../navigation.tabbed/TabbedNavigation";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { CreateButton as CreateOpSetButton } from "../designs.process-sets/partials/_CreateButton";
import { CreateButton } from "./partials/_CreateButton";
import {
	DesignsContextProvider,
	DesignsContext,
} from "./partials/_DesignsContext";
import { GenericModal } from "../../components/modal/GenericModal";

const LayoutHeader = () => {
	const { permissions } = usePermissionsContext();
	const location = useLocation();
	const { openModalContent, openModalSettings } = useContext(DesignsContext);

	return (
		<>
			<div className="flex justify-between items-baseline mb-16">
				<h1 className="typo-large">Styles</h1>
				{(permissions?.edit || permissions?.admin) &&
					(location.pathname === "/designs/process-sets" ? (
						<CreateOpSetButton txtStyle={true} />
					) : (
						<CreateButton txtStyle={true} />
					))}
			</div>

			<GenericModal
				customContent={openModalContent}
				isOpen={openModalContent ? true : false}
				{...openModalSettings}
			/>
		</>
	);
};

export const Layout = () => {
	return (
		<DesignsContextProvider>
			<LayoutHeader />
			<TabbedNavigation
				items={[
					{ text: "Designs", to: "" },
					{ text: "Process Sets", to: "process-sets" },
				]}
			/>
			<div className="mt-12">
				<Outlet />
			</div>
		</DesignsContextProvider>
	);
};
