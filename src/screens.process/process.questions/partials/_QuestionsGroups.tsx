import { QuestionCategory } from "../../../hooks.queries/useProcessQuestions";
import { AdditionalStepsQuestions } from "./_AdditionalStepsQuestions";
import { CuttingQuestions } from "./_CuttingQuestions";
import { DefinitionQuestions } from "./_DefinitionQuestions";
import { GeneralQuestions } from "./_GeneralQuestions";
import { GroupProcessesQuestions } from "./_GroupProcessesQuestions";
import { KnivesQuestions } from "./_KnivesQuestions";
import { MachiningQuestions } from "./_MachiningQuestions";
import { PathsQuestions } from "./_PathsQuestions";
import { UnmannedQuestions } from "./_UnmannedQuestions";
import { Tooltip } from "../../../components/common/tooltip/Tooltip";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import Icons from "../../../config.common/Icons";
import { useQuestionsContext } from "../../../hooks.queries/useQuestionsContext";
import { PreviewGeneralQuestions } from "../../../screens.process-definition/definition.preview/partials/_PreviewGeneralQuestions";
import { PreviewMachiningQuestions } from "../../../screens.process-definition/definition.preview/partials/_PreviewMachiningQuestions";

export const QuestionsGroups = () => {
	const { previewMode, activeGroupId, groups } = useQuestionsContext();
	const currentGroupIndex = groups?.findIndex((c) => c.id === activeGroupId);
	const currentGroup: QuestionCategory | null = groups
		? groups[currentGroupIndex ?? 0]
		: null;

	if (!currentGroup) {
		return <></>;
	}

	const renderGroup = (id: QuestionCategory["id"]) => {
		switch (id) {
			case "general":
				return previewMode ? (
					<PreviewGeneralQuestions />
				) : (
					<GeneralQuestions />
				);
			case "machining":
				return previewMode ? (
					<PreviewMachiningQuestions />
				) : (
					<MachiningQuestions />
				);
			case "cutting":
				return <CuttingQuestions />;
			case "knives":
				return <KnivesQuestions />;
			case "additionalSteps":
				return <AdditionalStepsQuestions />;
			case "unmanned":
				return <UnmannedQuestions />;
			case "processes":
				return <GroupProcessesQuestions />;
			case "paths":
				return <PathsQuestions />;
			default:
				return (
					<DefinitionQuestions
						currentGroup={currentGroup}
						key={activeGroupId}
					/>
				);
		}
	};

	return (
		<>
			<div className="flex items-baseline mb-16">
				<h1 className="typo-h1 mr-5">{currentGroup.description}</h1>
				{currentGroup.tooltipContent && (
					<Tooltip content={currentGroup.tooltipContent}>
						<RenderIcon icon={Icons.Interface.Info} />
					</Tooltip>
				)}
			</div>
			{renderGroup(currentGroup.id)}
		</>
	);
};
