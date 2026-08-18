import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useMatches } from "react-router-dom";
import { ItemActionsMenu } from "../../components/ItemActionsMenu/ItemActionsMenu";
import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import { EditableField } from "../../components/edit/EditableField";
import { EditableSection } from "../../components/edit/EditableSection";
import Icons from "../../config.common/Icons";
import { useProcess } from "../../hooks.queries/useProcess";
import { useCodeFieldSchema } from "../../hooks.schema/fields";
import { TabbedNavigation } from "../../navigation.tabbed/TabbedNavigation";
import { AMS } from "./partials/_AMS";
import { Delete } from "./partials/_Delete";
import { Copy } from "./partials/_Copy";
import { Details } from "./partials/_Details";
import { HelpModal } from "./partials/_HelpModal";
import { PartialSave } from "./partials/_PartialSave";
import { Type } from "./partials/_Type";
import { useProcesses } from "../../hooks.queries/useProcesses";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { SaveIndicator } from "./partials/_SaveIndicator";
import { QuestionsContextProvider } from "../process.questions/partials/_QuestionsContext";
import { RenderIcon } from "../../utilities.common/RenderIcon";

export const Layout = () => (
	<AwaitLoaderData>
		<Inner />
	</AwaitLoaderData>
);

const Inner = () => {
	const process = useProcess();
	const [keyNo, setKeyNo] = useState(0);
	const { processCodes } = useProcesses();
	const isImported = process.CreationStatus === "ocsImported";
	const matches = useMatches();
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();
	const isQuestionScreen =
		matches.find((m) => m.pathname.endsWith("/questions")) != undefined;
	const codeFieldSchema = useCodeFieldSchema(processCodes, process.Code);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setKeyNo(keyNo + 1);
	}, [process]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<QuestionsContextProvider key={keyNo}>
			<EditableSection>
				<div key={process?.ID} className="relative mb-14">
					{!isQuestionScreen && (
						<div className="absolute top-10 right-0">
							<ItemActionsMenu
								actions={[
									{
										step: (data) =>
											data &&
											(permissions?.edit ||
												permissions?.admin) && (
												<Copy process={data} />
											),
									},
									{
										step: (data) =>
											data &&
											!isImported &&
											(permissions?.edit ||
												permissions?.admin) && (
												<Link to="questions">
													{t("amendQuestions")}
												</Link>
											),
									},
									{
										step: (data) =>
											data &&
											(permissions?.edit ||
												permissions?.admin) && (
												<Delete process={data} />
											),
									},
								]}
								data={process}
								buttonIcon={Icons.Interface.MoreHorizontal}
								buttonLabel={t("moreActions")}
							/>
						</div>
					)}
					<div className="grid-container">
						<div className="col-span-8">
							<EditableField
								defaultElement={
									<h1 className="typo-large">
										{process.Code}
									</h1>
								}
								disableEdit={
									!(
										permissions?.edit || permissions?.admin
									) ||
									isQuestionScreen ||
									isImported
								}
								inputName="code"
								label={t("code")}
								schema={codeFieldSchema}
							/>
						</div>
						{process.Frozen && (
							<RenderIcon
								icon={Icons.Interface.Frozen}
								classes="self-center mt-6 col-span-1"
								sizes="w-12 h-12"
							/>
						)}
						{isQuestionScreen && (
							<div
								className={`col-span-${
									process.Frozen ? "3" : "4"
								} flex items-center justify-end pt-8`}
							>
								<SaveIndicator />
								<HelpModal />
								<PartialSave
									opID={process?.ID}
									changeKey={setKeyNo}
									conKey={keyNo}
								/>
							</div>
						)}
					</div>
				</div>
				{!isQuestionScreen && (
					<div className="grid-container mb-16">
						<div className="col-span-6">
							<Details />
						</div>
						<div className="col-span-6">
							<div className="max-w-md ml-auto">
								<AMS />
								<Type />
							</div>
						</div>
					</div>
				)}
			</EditableSection>
			{!isQuestionScreen && (
				<TabbedNavigation
					items={[
						{
							text:
								process.CategoryKind === "ocGroup"
									? "Processes"
									: "Steps",
							to: "",
						},
						{ text: t("about"), to: "about" },
						...(process.Points && process.Points?.length > 0
							? [{ text: t("path"), to: "path" }]
							: []),
						{ text: t("usedBy"), to: "used-by" },
					]}
				/>
			)}
			<div className="mt-15">
				<Outlet />
			</div>
		</QuestionsContextProvider>
	);
};
