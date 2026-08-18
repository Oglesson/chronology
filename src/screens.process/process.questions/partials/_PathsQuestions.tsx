import { useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ItemActionsMenu } from "../../../components/ItemActionsMenu/ItemActionsMenu";
import Icons from "../../../config.common/Icons";
import { AddExistingPath } from "./_AddExistingPath";
import { AddNewPath } from "./_AddNewPath";
import { RemovePath } from "./_RemovePath";
import { FormFooter } from "./_FormFooter";
import { PathCanvas } from "./_PathCanvas";
import { PathPreview } from "./_PathPreview";
import { PointData } from "../../../api.common/types";
import { useProcess } from "../../../hooks.queries/useProcess";
import { useFetcher } from "../../../hooks.common/useFetcher";
import { useQuestionsContext } from "../../../hooks.queries/useQuestionsContext";
import { QuestionsContext } from "./_QuestionsContext";

export const PathsQuestions = () => {
	const {
		previewMode,
		activeGroupId,
		groups,
		availablePaths,
		setAvailablePaths,
		getGroupState,
		setGroupState,
		setGroupSubmit,
		pathsQuestionsState,
		setPathsQuestionsState,
		setIsSaving,
	} = useQuestionsContext();

	const { isPathRequired } = useContext(QuestionsContext);
	const { fetcher, isFetching } = useFetcher();
	const process = useProcess();

	const { t } = useTranslation();

	const pathReference = !previewMode
		? process?.PathReference?.substring(
				process.PathReference.lastIndexOf("\\") + 1,
			)
		: undefined;
	const pathLength = !previewMode ? process?.PathLength : undefined;

	const currentGroupIndex = groups?.findIndex((c) => c.id === activeGroupId);
	const currentGroup =
		currentGroupIndex !== undefined ? groups?.[currentGroupIndex] : null;

	useEffect(() => {
		if (!previewMode) {
			setIsSaving(isFetching);
		}
	}, [isFetching, previewMode, setIsSaving]);

	const handlePreviewClick = (path: PointData[]) => {
		setPathsQuestionsState({
			answered: true,
			value: path,
		});
		setAvailablePaths([]);
		const {
			next,
			group: { isDirty },
		} = getGroupState(activeGroupId as number);
		setGroupState(
			activeGroupId as number,
			!isDirty && next === "incomplete" ? "initial" : next,
		);
	};

	return (
		<>
			{availablePaths.length > 1 ? (
				<ul className="grid-container">
					{availablePaths.map(
						(path, index) =>
							path.length > 0 && (
								<li key={index} className="col-span-4">
									<button
										className="relative block w-full bg-grey-light rounded-md overflow-hidden transition-opacity aspect-6/4 hover:opacity-70"
										onClick={() => {
											handlePreviewClick(path);
										}}
										type="button"
									>
										<PathPreview path={path} />
									</button>
								</li>
							),
					)}
				</ul>
			) : pathsQuestionsState.value.length > 0 ? (
				<>
					{pathReference && (
						<div className="text-grey-light mb-5">
							{t("name")}: {pathReference}
						</div>
					)}
					{pathLength && (
						<div className="mb-5">
							<span className="text-grey-light">
								{t("pathLength")}
							</span>
							{pathLength}
						</div>
					)}

					<PathCanvas />
				</>
			) : (
				pathsQuestionsState.answered && (
					<div>
						{t("noPaths", {
							defaultValue:
								"This file contains no paths, please select another one.",
						})}
					</div>
				)
			)}
			<ItemActionsMenu
				actions={[
					{
						step: <AddNewPath />,
					},
					{
						step: <AddExistingPath />,
					},
					{
						step: <RemovePath />,
					},
				]}
				buttonIcon={Icons.Edit.Plus}
				buttonLabel={
					pathsQuestionsState.value.length || availablePaths.length
						? t("changePath")
						: t("addPath")
				}
				className="mt-6"
				style="select"
			/>
			<fetcher.Form
				onSubmit={() => {
					if (
						currentGroup &&
						currentGroup.state !== "complete" &&
						isPathRequired
					) {
						setGroupState(activeGroupId as number, "error", true);
						return;
					}
					setGroupSubmit(true);
				}}
			>
				<FormFooter />
			</fetcher.Form>
		</>
	);
};
