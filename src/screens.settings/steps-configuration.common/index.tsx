import { useTranslation } from "react-i18next";
import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import { HorizontalTabs } from "../../components/tabs/HorizontalTabs";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { CuttingStepsSettings } from "./partials/_CuttingStepsSettings";
import { MachiningStepsSettings } from "./partials/_MachiningStepsSettings";

export const StepsConfiguration = () => {
	const { permissions } = usePermissionsContext();
	const { t } = useTranslation();

	return (
		<AwaitLoaderData>
			{permissions.admin ? (
				<HorizontalTabs
					classes="mb-10 lg:mb-16"
					tabs={[
						{
							content: <MachiningStepsSettings />,
							label: t("machining"),
							value: "machining",
						},
						{
							content: <CuttingStepsSettings />,
							label: t("cutting"),
							value: "cutting",
						},
					]}
				/>
			) : (
				<CuttingStepsSettings />
			)}
		</AwaitLoaderData>
	);
};
