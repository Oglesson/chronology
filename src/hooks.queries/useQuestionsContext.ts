import { useContext } from "react";
import { PreviewQuestionsContext } from "../screens.process-definition/definition.preview/partials/_PreviewQuestionsContext";
import { QuestionsContext } from "../screens.process/process.questions/partials/_QuestionsContext";

export const useQuestionsContext = () => {
	const questionsContext = useContext(QuestionsContext);
	const previewContext = useContext(PreviewQuestionsContext);
	const {
		previewMode,
		activeGroupId,
		setActiveGroupId,
		groups,
		setGroups,
		setGroupState,
		getGroupState,
		generalQuestionsState,
		setGeneralQuestionsState,
		pathsQuestionsState,
		setPathsQuestionsState,
		questionsAnswers,
		setQuestionsAnswers,
		percentageComplete,
		setGroupSubmit,
		availablePaths,
		setAvailablePaths,
		isSaving,
		setIsSaving,
	} = previewContext.previewMode ? previewContext : questionsContext;

	return {
		previewMode,
		activeGroupId,
		setActiveGroupId,
		groups,
		setGroups,
		setGroupState,
		getGroupState,
		generalQuestionsState,
		setGeneralQuestionsState,
		pathsQuestionsState,
		setPathsQuestionsState,
		questionsAnswers,
		setQuestionsAnswers,
		percentageComplete,
		setGroupSubmit,
		availablePaths,
		setAvailablePaths,
		isSaving,
		setIsSaving,
	};
};
