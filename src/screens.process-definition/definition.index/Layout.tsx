import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { ItemActionsMenu } from "../../components/ItemActionsMenu/ItemActionsMenu";
import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import { EditableField } from "../../components/edit/EditableField";
import { EditableSection } from "../../components/edit/EditableSection";
import Icons from "../../config.common/Icons";
import { useProcessDefinition } from "../../hooks.queries/useProcessDefinition";
import { useCodeFieldSchema } from "../../hooks.schema/fields";
import { TabbedNavigation } from "../../navigation.tabbed/TabbedNavigation";
import { Delete } from "./partials/_Delete";
import { useProcessDefinitions } from "../../hooks.queries/useProcessDefinitions";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { Preview } from "../definition.preview/Index";
import { Copy } from "./partials/_Copy";

export const Layout = () => (
	<AwaitLoaderData>
		<Inner />
	</AwaitLoaderData>
);

const Inner = () => {
	const definition = useProcessDefinition();
	const { processDefinitionCodes } = useProcessDefinitions();
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();
	const codeFieldSchema = useCodeFieldSchema(
		processDefinitionCodes,
		definition?.Code,
	);

	if (!definition) {
		return <></>;
	}

	return (
		<>
			<div key={definition?.ID} className="relative mb-16">
				<div className="absolute top-10 right-0">
					<ItemActionsMenu
						actions={[
							{
								step: (data) =>
									(permissions?.edit ||
										permissions?.admin) && (
										<Delete definition={data} />
									),
							},
							{
								step: (data) =>
									(permissions?.edit ||
										permissions?.admin) && (
										<Copy definition={data} />
									),
							},
							{
								step: <Preview />,
							},
						]}
						data={definition}
						buttonIcon={Icons.Interface.MoreHorizontal}
						buttonLabel={t("moreActions")}
					/>
				</div>
				<EditableSection>
					<div className="grid-container gap-y-16 mt-6">
						<div className="col-span-12 xl:col-span-10">
							<EditableField
								defaultElement={
									<h1 className="typo-large">
										{definition.Code}
									</h1>
								}
								disableEdit={
									!(
										permissions?.edit || permissions?.admin
									) || definition.IsInUseByOp
								}
								inputName="code"
								label={t("code")}
								schema={codeFieldSchema}
							/>
						</div>
						<div className="col-span-12 lg:col-span-6 lg:row-start-2">
							<span className="block text-grey-light mb-1.5">
								{t("type")}
							</span>
							<p className="typo-h5">
								{definition.Handling ? "Handling" : "Task"}
							</p>
						</div>
					</div>
				</EditableSection>
			</div>
			<TabbedNavigation
				items={[
					{ text: t("questions"), to: "" },
					{ text: "Steps", to: "steps" },
					{
						text: t("stepsForPath"),
						to: "steps-for-path",
						hidden: definition.Handling,
					},
					{
						text: t("stepsForPathFeatures"),
						to: "steps-for-path-features",
						hidden: definition.Handling,
					},
					{ text: t("description"), to: "description" },
				]}
			/>
			<div className="mt-15">
				<Outlet />
			</div>
		</>
	);
};
