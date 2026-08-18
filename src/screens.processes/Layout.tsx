import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useMatches } from "react-router-dom";
import { Button } from "../components/common/button/Button";
import { TabbedNavigation } from "../navigation.tabbed/TabbedNavigation";
import {
	ProcessTypeContext,
	ProcessTypeContextProvider,
} from "../screens.process-types/partials/_ProcessTypeContext";
import {
	ProcessesContext,
	ProcessesContextProvider,
} from "./partials/_ProcessesContext";
import {
	ProcessDefinitionContext,
	ProcessDefinitionContextProvider,
} from "../screens.process-definitions/partials/_ProcessDefinitionContext";
import { usePermissionsContext } from "../hooks.common/usePermissionsContext";
import { Create } from "./partials/_Create";

export const Layout = () => {
	const { t } = useTranslation();
	const [showCreate, setCreate] = useState(false);
	const match = useMatches().at(-1);

	useEffect(() => {
		const loadData = async () => {
			setCreate(false);
			await (match?.data as { result: Promise<unknown> }).result;
			setCreate(true);
		};

		loadData();
	}, [match]);

	return (
		<ProcessesContextProvider>
			<ProcessTypeContextProvider>
				<ProcessDefinitionContextProvider>
					<div className="flex justify-between items-end mb-16">
						<h1 className="typo-large">Processes</h1>
						{showCreate && <CreateHeader />}
					</div>
					<TabbedNavigation
						items={[
							{ text: t("processes"), to: "" },
							{ text: t("classes"), to: "types" },
							{ text: t("definitions"), to: "definitions" },
						]}
					/>
					<div className="mt-15">
						<Outlet />
					</div>
				</ProcessDefinitionContextProvider>
			</ProcessTypeContextProvider>
		</ProcessesContextProvider>
	);
};

const CreateHeader = () => {
	const match = useMatches().at(-1);
	const { setOpenModalContent } = useContext(ProcessesContext);
	const { setOpenCreateClassModal } = useContext(ProcessTypeContext);
	const { setOpenCreateProcessDefinitionModal } = useContext(
		ProcessDefinitionContext,
	);
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	if ((permissions?.edit || permissions?.admin) && match?.pathname.endsWith("/")) {
		return (
			<Button
				text={t("createAProcess")}
				onClick={() => setOpenModalContent(<Create />)}
			/>
		);
	}

	if ((permissions?.edit || permissions?.admin) && match?.pathname.endsWith("types")) {
		return (
			<Button
				text={t("createProcessClass")}
				onClick={setOpenCreateClassModal}
			/>
		);
	}

	if ((permissions?.edit || permissions?.admin) && match?.pathname.endsWith("definitions")) {
		return (
			<Button
				text={t("createProcessDefinition")}
				onClick={setOpenCreateProcessDefinitionModal}
			/>
		);
	}

	return <></>;
};
