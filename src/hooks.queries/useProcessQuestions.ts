import { ReactNode } from "react";
import { ProcessDefinitionQuestionData } from "../api.common/types";
import { useProcess } from "./useProcess";
import { useProcessDefinitionCategories } from "./useProcessDefinitionCategories";

export type QuestionState = "initial" | "complete" | "incomplete" | "error";

export type QuestionCategory = {
	description: string;
	id?:
		| number
		| "general"
		| "machining"
		| "cutting"
		| "knives"
		| "additionalSteps"
		| "unmanned"
		| "processes"
		| "paths"
		| `altpath-${number | undefined}`;
	isDirty: boolean;
	questions: ProcessDefinitionQuestionData[];
	seq?: number;
	state: QuestionState;
	tooltipContent?: ReactNode;
	needsClass?: string;
};

export const useProcessQuestions = () => {
	const process = useProcess();
	const processDefinitionCategories = useProcessDefinitionCategories();
	const needsMachiningQuestions =
		process.CategoryKind === "ocFolding" ||
		process.CategoryKind === "ocPalletStitching" ||
		process.CategoryKind === "ocStitching" ||
		process.CategoryKind === "ocStrobelStitching";
	const needsCuttingQuestions = process.CategoryKind === "ocCutting";
	const needsUnmannedQuestions = process.CategoryKind === "ocUnmanned";
	const needsGroupQuestions = process.CategoryKind === "ocGroup";
	const needsPathsQuestions =
		(process.CategoryKind === "ocRegular" ||
			process.CategoryKind === "ocFolding" ||
			process.CategoryKind === "ocPalletStitching" ||
			process.CategoryKind === "ocStitching" ||
			process.CategoryKind === "ocStrobelStitching") &&
		process.FullTaskDefinition &&
		process.FullTaskDefinition.InnerIndex > -1;

	const categories: QuestionCategory[] | null =
		processDefinitionCategories &&
		processDefinitionCategories.length > 0
			? processDefinitionCategories.reduce(
					(list: QuestionCategory[], category) => {
						const questions = [
							...(process.FullHandlingDefinition?.Questions ||
								[]),
							...(process.FullTaskDefinition?.Questions || []),
						].filter((question) => {
							// return (
							// 	category.Description ===
							// 	question._QuestionColumn.Description
							// );
							return category.ID === question._QuestionColumn.ID;
						});

						if (questions.length) {
							let needsClass: string | undefined;
							if (
								category.ColumnType ===
								"ctTaskAlternativeToPath"
							) {
								needsClass = "pl-8";
								list.push({
									description: category.Description,
									id: `altpath-${category.ID}`,
									isDirty: false,
									questions: questions,
									state: "initial",
									tooltipContent: category.Explanation,
									needsClass,
								});
							} else {
								list.push({
									description: category.Description,
									id: category.ID,
									isDirty: false,
									questions: questions,
									seq: category.Seq,
									state: "initial",
									tooltipContent: category.Explanation,
									needsClass,
								});
							}
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
					[
						{
							description: "General",
							id: "general",
							isDirty: false,
							questions: [],
							state: "initial",
						},
					]
			  )
			: null;

	if (categories) {
		if (needsMachiningQuestions) {
			categories.splice(1, 0, {
				description: "Machining",
				id: "machining",
				isDirty: false,
				questions: [],
				state: "initial",
			});
		}

		if (needsCuttingQuestions) {
			categories.splice(1, 0, {
				description: "Knives",
				id: "knives",
				isDirty: false,
				questions: [],
				state: "initial",
			});

			categories.splice(1, 0, {
				description: "Cutting",
				id: "cutting",
				isDirty: false,
				questions: [],
				state: "initial",
			});
		}

		if (needsUnmannedQuestions) {
			categories.splice(1, 0, {
				description: "Unmanned",
				id: "unmanned",
				isDirty: false,
				questions: [],
				state: "initial",
			});
		}

		if (needsGroupQuestions) {
			categories.splice(1, 0, {
				description: "Processes",
				id: "processes",
				isDirty: false,
				questions: [],
				state: "initial",
			});
		}

		if (
			!needsGroupQuestions &&
			!needsUnmannedQuestions &&
			!process.Frozen
		) {
			categories.splice(categories.length, 0, {
				description: "Additional steps",
				id: "additionalSteps",
				isDirty: false,
				questions: [],
				state: "initial",
			});
		}
	}

	return { process, categories };
};
