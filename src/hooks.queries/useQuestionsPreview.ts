import { useProcessDefinition } from "./useProcessDefinition";
import { useProcessDefinitionCategories } from "./useProcessDefinitionCategories";
import { QuestionCategory } from "./useProcessQuestions";

export const useQuestionsPreview = () => {
	const definition = useProcessDefinition();
	const processDefinitionCategories = useProcessDefinitionCategories();

	let needsGeneralQuestions = false;
	let needsMachiningQuestions = false;
	let needsPathsQuestions =
		(definition.Pathtypes && definition.Pathtypes.length > 0) ||
		(definition.PathfeaturesSteps &&
			definition.PathfeaturesSteps.length > 0);

	definition.Steps?.forEach((step) => {
		const tags = [
			...(step.EveryFormula || "").split(" "),
			...(step.ExtraConditions || "").split(" "),
			...(step.FreqFormula || "").split(" "),
		];

		// G1 = Batch size
		if (tags.includes("G1")) {
			needsGeneralQuestions = true;
		}
		// M4 = Density per inch
		// M5 = Density per CM
		if (tags.includes("M4") || tags.includes("M5")) {
			needsMachiningQuestions = true;
		}
		// M10 = Paths
		if (tags.includes("M10")) {
			needsPathsQuestions = true;
		}
	});

	const categories: QuestionCategory[] | null =
		processDefinitionCategories &&
		processDefinitionCategories.length > 0
			? processDefinitionCategories.reduce(
					(list: QuestionCategory[], category) => {
						const questions = [
							...(definition?.Questions || []),
						].filter((question) => {
							return category.ID === question._QuestionColumn.ID;
						});

						if (questions.length) {
							list.push({
								description: category.Description,
								id: category.ID,
								isDirty: false,
								questions: questions,
								seq: category.Seq,
								state: "initial",
								tooltipContent: category.Explanation,
							});
						}

						if (
							category.ColumnType === "ctPath" &&
							needsPathsQuestions
						) {
							list.push({
								description: category.Description,
								id: "paths",
								isDirty: false,
								questions: [],
								state: "initial",
								tooltipContent: category.Explanation,
							});
						}

						return list;
					},
					[]
			  )
			: null;
	if (categories) {
		if (needsMachiningQuestions) {
			categories.unshift({
				description: "Machining",
				id: "machining",
				isDirty: false,
				questions: [],
				state: "initial",
			});
		}

		if (needsGeneralQuestions) {
			categories.unshift({
				description: "General",
				id: "general",
				isDirty: false,
				questions: [],
				state: "initial",
			});
		}
	}

	const questions =
		definition.Questions?.map((question) => {
			return {
				Code: question.Code,
				ValueOrIndex: (question.IsNumbersQuestion
					? question.QuestionsNumbers?.DefaultValue
					: question.DefaultIndexIfChoice) as number,
				Answered: false,
			};
		}) || [];

	return { definition, categories, questions };
};
