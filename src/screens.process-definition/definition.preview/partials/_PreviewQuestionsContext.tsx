import { AxiosError } from "axios";
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import api from "../../../api.common";
import {
	PointData,
	PreviewProcessDefinitionStepData,
	QuestionAnswerData,
	ResponseMessage,
} from "../../../api.common/types";
import { NotificationContext } from "../../../context.common/NotificationContext";
import {
	QuestionCategory,
	QuestionState,
} from "../../../hooks.queries/useProcessQuestions";
import { useQuestionsPreview } from "../../../hooks.queries/useQuestionsPreview";
import {
	PathsQuestionState,
	Question,
	QuestionId,
} from "../../../screens.process/process.questions/partials/_QuestionsContext";

export type PreviewGeneralQuestionsState = {
	itemsTaskCovers?: Question;
	batchSize?: Question;
};

export type PreviewMachiningQuestionsState = {
	densityPerInch?: Question;
};

type PreviewQuestionsContext = {
	previewMode?: boolean;
	previewStep: number;
	setPreviewStep: Dispatch<SetStateAction<number>>;
	previewSteps: PreviewProcessDefinitionStepData[];
	setPreviewSteps: Dispatch<
		SetStateAction<PreviewProcessDefinitionStepData[]>
	>;
	activeGroupId: QuestionId | null;
	setActiveGroupId: Dispatch<SetStateAction<QuestionId | null>>;
	groups: QuestionCategory[] | null;
	setGroups: Dispatch<SetStateAction<QuestionCategory[] | null>>;
	setGroupState: (
		id: QuestionId,
		state: QuestionState,
		isDirty?: boolean,
		initialGroups?: QuestionCategory[]
	) => void;
	getGroupState: (id: QuestionId) => {
		next: QuestionState;
		group: QuestionCategory;
	};
	generalQuestionsState: PreviewGeneralQuestionsState;
	setGeneralQuestionsState: Dispatch<
		SetStateAction<PreviewGeneralQuestionsState>
	>;
	machiningQuestionsState: PreviewMachiningQuestionsState;
	setMachiningQuestionsState: Dispatch<
		SetStateAction<PreviewMachiningQuestionsState>
	>;
	pathsQuestionsState: PathsQuestionState;
	setPathsQuestionsState: Dispatch<SetStateAction<PathsQuestionState>>;
	questionsAnswers: QuestionAnswerData[];
	setQuestionsAnswers: Dispatch<SetStateAction<QuestionAnswerData[]>>;
	percentageComplete: number;
	setGroupSubmit: Dispatch<SetStateAction<boolean>>;
	availablePaths: PointData[][];
	setAvailablePaths: Dispatch<SetStateAction<PointData[][]>>;
	isSaving: boolean;
	setIsSaving: Dispatch<SetStateAction<boolean>>;
	isPathRequired: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
export const PreviewQuestionsContext = createContext<PreviewQuestionsContext>({
	previewStep: 0,
	setPreviewStep: () => {},
	previewSteps: [],
	setPreviewSteps: () => {},
	activeGroupId: 0,
	setActiveGroupId: () => {},
	groups: [],
	setGroups: () => {},
	setGroupState: () => {},
	getGroupState: () => ({
		next: "initial",
		group: {
			description: "",
			isDirty: false,
			questions: [],
			state: "initial",
		},
	}),
	generalQuestionsState: {},
	setGeneralQuestionsState: () => {},
	machiningQuestionsState: {},
	setMachiningQuestionsState: () => {},
	pathsQuestionsState: { answered: false, value: [] },
	setPathsQuestionsState: () => {},
	questionsAnswers: [],
	setQuestionsAnswers: () => {},
	percentageComplete: 0,
	setGroupSubmit: () => {},
	availablePaths: [],
	setAvailablePaths: () => {},
	isSaving: false,
	setIsSaving: () => {},
	isPathRequired: true,
});

export const PreviewQuestionsContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const previewMode = true;
	const { definition, categories, questions } = useQuestionsPreview();
	const { processResponse } = useContext(NotificationContext);
	const [activeGroupId, setActiveGroupId] = useState(
		categories ? categories[0].id : null
	);
	const isAnswered = false;
	const [generalQuestionsState, setGeneralQuestionsState] =
		useState<PreviewGeneralQuestionsState>({
			batchSize: {
				answered: isAnswered,
				value: 1,
			},
			itemsTaskCovers: {
				answered: isAnswered,
				value: 1,
			},
		});
	const [machiningQuestionsState, setMachiningQuestionsState] =
		useState<PreviewMachiningQuestionsState>({
			densityPerInch: {
				answered: isAnswered,
				value: 1,
			},
		});
	const [pathsQuestionsState, setPathsQuestionsState] =
		useState<PathsQuestionState>({
			answered: isAnswered,
			value: [],
		});
	const [questionsAnswers, setQuestionsAnswers] =
		useState<QuestionAnswerData[]>(questions);
	const [groups, setGroups] = useState(categories);
	const [percentageComplete, setPercentageComplete] = useState(0);
	const [groupSubmit, setGroupSubmit] = useState(false);
	const [availablePaths, setAvailablePaths] = useState<PointData[][]>([]);
	const [isSaving, setIsSaving] = useState(false);
	const [isPathRequired] = useState(true);
	const [previewStep, setPreviewStep] = useState(0);
	const [previewSteps, setPreviewSteps] = useState<
		PreviewProcessDefinitionStepData[]
	>([]);
	const previousGroupId = useRef(activeGroupId);

	const getGroupComplete = (thisGroup: QuestionCategory) => {
		switch (thisGroup.id) {
			case "general": {
				const generalQuestions = Object.values(generalQuestionsState);
				return {
					total: generalQuestions.length,
					complete: generalQuestions.filter((q) => q.answered).length,
				};
			}
			case "machining": {
				const machiningQuestions = Object.values(
					machiningQuestionsState
				);
				return {
					total: machiningQuestions.length,
					complete: machiningQuestions.filter((q) => q.answered)
						.length,
				};
			}
			case "paths":
				return {
					total: 1,
					complete:
						(pathsQuestionsState.answered &&
							pathsQuestionsState.value.length) ||
						!isPathRequired
							? 1
							: 0,
				};
			default:
				return {
					total: thisGroup?.questions.length,
					complete: thisGroup?.questions.filter(
						(q) =>
							questionsAnswers.find((a) => a.Code === q.Code)
								?.Answered
					).length,
				};
		}
	};

	const getAllComplete = () => {
		if (groups) {
			return groups.reduce(
				(a, g, i) => {
					const { total, complete } = getGroupComplete(g);
					a.complete += complete;
					a.total += total;
					if (i === groups.length - 1) {
						a.percentage = Math.ceil((a.complete / a.total) * 100);
					}
					return a;
				},
				{
					total: 0,
					complete: 0,
					percentage: 0,
				}
			);
		} else {
			return { total: 0, complete: 0, percentage: 0 };
		}
	};

	const setGroupState = (
		id: QuestionId,
		state: QuestionState,
		isDirty?: boolean,
		initialGroups?: QuestionCategory[]
	) => {
		setGroups((prevGroups) => {
			const nextGroups = prevGroups
				? [...prevGroups]
				: initialGroups
				? [...initialGroups]
				: [];
			const group = nextGroups.find(
				(group) => group.id === id
			) as QuestionCategory;
			if (group) {
				group.state = state;
				if (isDirty) {
					group.isDirty = true;
				}
			}
			return nextGroups;
		});
	};

	const getGroupState = useCallback((id: QuestionId, groupsToCheck = groups ?? []) => {
		const group = groupsToCheck.find(
			(g) => g.id === id
		) as QuestionCategory;
		const { total, complete } = getGroupComplete(group);
		let state: QuestionState = "initial";

		if (complete === total) {
			state = "complete";
		} else if (complete > 0 || group?.isDirty) {
			state = "incomplete";
		}
		return {
			next: state,
			group: group as QuestionCategory,
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groups]);

	const handleGroupSubmit = () => {
		if (groups) {
			const currentGroupIndex = groups.findIndex(
				(c) => c.id === activeGroupId
			);
			const isLastQuestion = currentGroupIndex === groups.length - 1;

			if (isLastQuestion) {
				const firstInvalidGroup = groups.find(
					(g) => g.state !== "complete"
				);

				if (
					firstInvalidGroup &&
					firstInvalidGroup !== groups[currentGroupIndex]
				) {
					setActiveGroupId(firstInvalidGroup.id);
					return;
				}

				setIsSaving(true);

				api.previewProcessDefinitionQuestions({
					ID: Number(definition.ID),
					BatchSize: Number(generalQuestionsState.batchSize?.value),
					ItemsCovered: Number(
						generalQuestionsState.itemsTaskCovers?.value
					),
					DensityPerSomething: Number(
						machiningQuestionsState.densityPerInch?.value
					),
					DensityPerIsInch: true,
					QuestionsAnswers: questionsAnswers,
					Points: pathsQuestionsState.value,
				})
					.then((response) => {
						setPreviewStep(1);
						setPreviewSteps(response.data);
					})
					.catch((e: AxiosError) => {
						processResponse({
							code: e.response?.status,
							message: e.response?.statusText,
							responseMessage: e.response
								?.data as ResponseMessage,
							type: "error",
						});
					})
					.finally(() => {
						setIsSaving(false);
					});
			}

			if (!isLastQuestion) {
				setActiveGroupId(groups[currentGroupIndex + 1].id);
				return;
			}
		}
	};

	useEffect(() => {
		if (groups) {
			setPercentageComplete(getAllComplete().percentage);
			const {
				next,
				group: { state, isDirty },
			} = getGroupState(activeGroupId ?? 0);
			if (state === "error") {
				return;
			}
			setGroupState(
				activeGroupId ?? 0,
				!isDirty && next === "incomplete" ? "initial" : next
			);
		}
	}, [questionsAnswers, generalQuestionsState, pathsQuestionsState, activeGroupId, groups]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (activeGroupId !== previousGroupId.current) {
			const {
				next,
				group: { state },
			} = getGroupState(previousGroupId.current as QuestionId);

			setGroupState(
				previousGroupId.current as QuestionId,
				state === "error"
					? "error"
					: next === "initial"
					? "incomplete"
					: next,
				true
			);
			previousGroupId.current = activeGroupId;
		}
	}, [activeGroupId, getGroupState]);

	useEffect(() => {
		if (groupSubmit) {
			handleGroupSubmit();
			setGroupSubmit(false);
		}
	}, [groupSubmit]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!groups && categories) {
			setActiveGroupId(categories[0].id);
			previousGroupId.current = categories[0].id;
			categories.forEach((group) => {
				const { next } = getGroupState(group.id, categories);
				setGroupState(
					group.id,
					next,
					next !== "initial" ? true : undefined,
					categories
				);
			});
		}
	}, [categories, groups]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<PreviewQuestionsContext.Provider
			value={{
				previewMode,
				previewStep,
				setPreviewStep,
				previewSteps,
				setPreviewSteps,
				activeGroupId,
				setActiveGroupId,
				groups,
				setGroups,
				setGroupState,
				getGroupState,
				generalQuestionsState,
				setGeneralQuestionsState,
				machiningQuestionsState,
				setMachiningQuestionsState,
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
				isPathRequired,
			}}
		>
			{children}
		</PreviewQuestionsContext.Provider>
	);
};
