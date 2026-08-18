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
import { useLocation } from "react-router-dom";
import {
	AdditionalStepData,
	GroupProcessData,
	ProcessKnivesData,
	PointData,
	QuestionAnswerData,
	OpUpdateMap,
	CuttingQType,
} from "../../../api.common/types";
import { FORM_IDENTIFIERS } from "../../../constants.common/formIdentifiers";
import { NotificationContext } from "../../../context.common/NotificationContext";
import { useFetcher } from "../../../hooks.common/useFetcher";
import {
	QuestionCategory,
	QuestionState,
	useProcessQuestions,
} from "../../../hooks.queries/useProcessQuestions";
import ResponseDataUtilities from "../../../utilities.common/ResponseDataUtilities";
import { useProcessDefinitionsMachining } from "../../../hooks.queries/useProcessDefinitionsMachining";
import ObjectUtilities from "../../../utilities.common/ObjectUtilities";

export type QuestionId =
	| number
	| "general"
	| "machining"
	| "cutting"
	| "knives"
	| "additionalSteps"
	| "unmanned"
	| "processes"
	| "paths"
	| `altpath-${number | undefined}`
	| undefined;
export type QuestionValue = FormDataEntryValue | number | string | undefined;
export type Question = {
	answered: boolean;
	value: QuestionValue;
};

export type GeneralQuestionsState = {
	machine?: Question;
	itemsTaskCovers?: Question;
	batchSize?: Question;
	grade?: Question;
	madeInPairs?: Question;
	rest?: Question;
	contingency?: Question;
	groupAllowance?: Question;
};

export type MachiningStitchingQuestionsState = {
	minimumSpeed?: Question;
	maximumSpeed?: Question;
	densityUnits?: Question;
	densityPerInch?: Question;
	materialProperty?: Question;
	machineType?: Question;
	needleType?: Question;
	stitchingModifier?: Question;
};

export type MachiningPalletStitchingQuestionsState = {
	programmedSpeed?: Question;
	densityUnits?: Question;
	densityPerInch?: Question;
};

export type MachiningStrobelStitchingQuestionsState = {
	minimumSpeed?: Question;
	maximumSpeed?: Question;
	densityUnits?: Question;
	densityPerInch?: Question;
};

export type MachiningFoldingQuestionsState = {
	minimumSpeed?: Question;
	maximumSpeed?: Question;
	densityUnits?: Question;
	densityPerInch?: Question;
	materialProperty?: Question;
};

export type CuttingQuestionsState = {
	unitsPerJob?: Question;
	sizes?: Question;
	materialType?: Question;
	unit?: Question;
	area?: Question;
	coefficient?: Question;
	layers?: Question;
	width?: Question;
	fabricLength?: Question;
	cuttingType?: Question;
	cuttingMethodNatural?: Question;
	cuttingMethodSynthetic?: Question;
	feedSystem?: Question;
	depth?: Question;
};

export type KnivesQuestionState = {
	answered: boolean;
	value: ProcessKnivesData[];
};

export type AdditionalStepsState = {
	answered: boolean;
	value: AdditionalStepData[];
};

export type UnmannedQuestionsState = {
	wholeCycleTime?: Question;
	maximumUnits?: Question;
	valueAdded?: Question;
	emptyBeforeShutdown?: Question;
	emptyItself?: Question;
	lanes?: Question;
};

export type GroupProcessesQuestionsState = GroupProcessData[];

export type PathsQuestionState = {
	answered: boolean;
	value: PointData[] | "1";
};

type QuestionsContext = {
	previewMode?: boolean;
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
	generalQuestionsState: GeneralQuestionsState;
	setGeneralQuestionsState: Dispatch<SetStateAction<GeneralQuestionsState>>;
	machiningStitchingQuestionsState: MachiningStitchingQuestionsState;
	setMachiningStitchingQuestionsState: Dispatch<
		SetStateAction<MachiningStitchingQuestionsState>
	>;
	machiningPalletStitchingQuestionsState: MachiningPalletStitchingQuestionsState;
	setMachiningPalletStitchingQuestionsState: Dispatch<
		SetStateAction<MachiningPalletStitchingQuestionsState>
	>;
	machiningStrobelStitchingQuestionsState: MachiningStrobelStitchingQuestionsState;
	setMachiningStrobelStitchingQuestionsState: Dispatch<
		SetStateAction<MachiningStrobelStitchingQuestionsState>
	>;
	machiningFoldingQuestionsState: MachiningFoldingQuestionsState;
	setMachiningFoldingQuestionsState: Dispatch<
		SetStateAction<MachiningFoldingQuestionsState>
	>;
	cuttingQuestionsState: CuttingQuestionsState;
	setCuttingQuestionsState: Dispatch<SetStateAction<CuttingQuestionsState>>;
	knivesQuestionsState: KnivesQuestionState;
	setKnivesQuestionsState: Dispatch<SetStateAction<KnivesQuestionState>>;
	additionalStepsQuestionsState: AdditionalStepsState;
	setAdditionalStepsQuestionsState: Dispatch<
		SetStateAction<AdditionalStepsState>
	>;
	unmannedQuestionsState: UnmannedQuestionsState;
	setUnmannedQuestionsState: Dispatch<SetStateAction<UnmannedQuestionsState>>;
	groupProcessesQuestionsState: GroupProcessesQuestionsState;
	setGroupProcessesQuestionsState: Dispatch<
		SetStateAction<GroupProcessesQuestionsState>
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
	updateMap: OpUpdateMap | null;
	setUpdateMap: Dispatch<SetStateAction<OpUpdateMap | null>>;
	isUMapUpdated: (umap: OpUpdateMap) => boolean;
	formHasChanged: (dataType: string | string[]) => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const QuestionsContext = createContext<QuestionsContext>({
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
	machiningStitchingQuestionsState: {},
	setMachiningStitchingQuestionsState: () => {},
	machiningPalletStitchingQuestionsState: {},
	setMachiningPalletStitchingQuestionsState: () => {},
	machiningStrobelStitchingQuestionsState: {},
	setMachiningStrobelStitchingQuestionsState: () => {},
	machiningFoldingQuestionsState: {},
	setMachiningFoldingQuestionsState: () => {},
	cuttingQuestionsState: {},
	setCuttingQuestionsState: () => {},
	knivesQuestionsState: { answered: false, value: [] },
	setKnivesQuestionsState: () => {},
	additionalStepsQuestionsState: { answered: false, value: [] },
	setAdditionalStepsQuestionsState: () => {},
	unmannedQuestionsState: {},
	setUnmannedQuestionsState: () => {},
	groupProcessesQuestionsState: [],
	setGroupProcessesQuestionsState: () => {},
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
	updateMap: {},
	setUpdateMap: () => {},
	isUMapUpdated: () => false,
	formHasChanged: () => {},
});

export const QuestionsContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const previewMode = false;
	const { categories, process } = useProcessQuestions();
	const processDefinitionsMachining = useProcessDefinitionsMachining();

	const { fetcher, responseData } = useFetcher();
	const { processResponse } = useContext(NotificationContext);
	const location = useLocation();

	const [updateMap, setUpdateMap] = useState<null | OpUpdateMap>(null);
	const [activeGroupId, setActiveGroupId] = useState<null | QuestionId>(
		categories ? categories[0].id : null
	);
	const isAnswered = process.CreationStatus !== "ocsSkeleton";
	const [generalQuestionsState, setGeneralQuestionsState] =
		useState<GeneralQuestionsState>({
			machine: {
				answered: isAnswered,
				value: process.MachineID || "null",
			},
			itemsTaskCovers: {
				answered: isAnswered,
				value: process.ItemsCovered,
			},
			batchSize: {
				answered: isAnswered,
				value: process.BatchSize,
			},
			grade: {
				answered: isAnswered,
				value: process.GradeID ?? 1,
			},
			madeInPairs: {
				answered: isAnswered,
				value: process.MadeInPairs ? "yes" : "no",
			},
			groupAllowance: {
				answered: isAnswered,
				value: process.UseVGRestCont ? "yes" : "no",
			},
			rest: {
				answered: isAnswered,
				value: process.Rest,
			},
			contingency: {
				answered: isAnswered,
				value: process.Contingency,
			},
		});
	const [
		machiningStitchingQuestionsState,
		setMachiningStitchingQuestionsState,
	] = useState<MachiningStitchingQuestionsState>({
		densityUnits: {
			answered: isAnswered,
			value: process.Machining_Stitching?.DensityDisplayInches
				? "inch"
				: "cm",
		},
		densityPerInch: {
			answered: isAnswered,
			value: process.Machining_Stitching?.DensityDisplayInches
				? process.Machining_Stitching?.DensityPerInch.toFixed(
						processDefinitionsMachining.Density_dps
				  )
				: process.Machining_Stitching?._DensityPerCm.toFixed(
						processDefinitionsMachining.Density_dps
				  ),
		},
		machineType: {
			answered: isAnswered,
			value: process.Machining_Stitching?.MachineTypePost
				? "post"
				: "flat",
		},
		materialProperty: {
			answered: isAnswered,
			value: process.Machining_Stitching?.MaterialPropertyFloppy
				? "floppy"
				: "normal",
		},
		maximumSpeed: {
			answered: isAnswered,
			value: process.Machining_Stitching?.MaximumSpeed,
		},
		needleType: {
			answered: isAnswered,
			value: process.Machining_Stitching?.NeedleTypeTwin
				? "twin"
				: "single",
		},
		minimumSpeed: {
			answered: isAnswered,
			value: process.Machining_Stitching?.MinimumSpeed,
		},
		stitchingModifier: {
			answered: isAnswered,
			value: process.Machining_Stitching?.StitchingmodifierID ?? 1,
		},
	});
	const [
		machiningPalletStitchingQuestionsState,
		setMachiningPalletStitchingQuestionsState,
	] = useState<MachiningPalletStitchingQuestionsState>({
		densityUnits: {
			answered: isAnswered,
			value: process.Machining_Pallet_Stitching?.DensityDisplayInches
				? "inch"
				: "cm",
		},
		densityPerInch: {
			answered: isAnswered,
			value: process.Machining_Pallet_Stitching?.DensityDisplayInches
				? Number(
						process.Machining_Pallet_Stitching?.DensityPerInch.toFixed(
							processDefinitionsMachining.Pallet_Density_dps
						)
				  )
				: process.Machining_Pallet_Stitching?._DensityPerCm.toFixed(
						processDefinitionsMachining.Pallet_Density_dps
				  ),
		},
		programmedSpeed: {
			answered: isAnswered,
			value: process.Machining_Pallet_Stitching?.ProgrammedSpeed,
		},
	});
	const [
		machiningStrobelStitchingQuestionsState,
		setMachiningStrobelStitchingQuestionsState,
	] = useState<MachiningStrobelStitchingQuestionsState>({
		densityUnits: {
			answered: isAnswered,
			value: process.Machining_Strobel_Stitching?.DensityDisplayInches
				? "inch"
				: "cm",
		},
		densityPerInch: {
			answered: isAnswered,
			value: process.Machining_Strobel_Stitching?.DensityDisplayInches
				? process.Machining_Strobel_Stitching?.DensityPerInch.toFixed(
						processDefinitionsMachining.Density_dps
				  )
				: process.Machining_Strobel_Stitching?._DensityPerCm.toFixed(
						processDefinitionsMachining.Density_dps
				  ),
		},
		maximumSpeed: {
			answered: isAnswered,
			value: process.Machining_Strobel_Stitching?.MaximumSpeed,
		},
		minimumSpeed: {
			answered: isAnswered,
			value: process.Machining_Strobel_Stitching?.MinimumSpeed,
		},
	});
	const [machiningFoldingQuestionsState, setMachiningFoldingQuestionsState] =
		useState<MachiningFoldingQuestionsState>({
			densityUnits: {
				answered: isAnswered,
				value: process.Machining_Folding?.DensityDisplayInches
					? "inch"
					: "cm",
			},
			densityPerInch: {
				answered: isAnswered,
				value: process.Machining_Folding?.DensityDisplayInches
					? process.Machining_Folding?.DensityPerInch.toFixed(
							processDefinitionsMachining.Density_dps
					  )
					: process.Machining_Folding?._DensityPerCm.toFixed(
							processDefinitionsMachining.Density_dps
					  ),
			},
			materialProperty: {
				answered: isAnswered,
				value: process.Machining_Folding?.MaterialPropertyFloppy
					? "floppy"
					: "normal",
			},
			maximumSpeed: {
				answered: isAnswered,
				value: process.Machining_Folding?.MaximumSpeed,
			},
			minimumSpeed: {
				answered: isAnswered,
				value: process.Machining_Folding?.MinimumSpeed,
			},
		});
	const [cuttingQuestionsState, setCuttingQuestionsState] =
		useState<CuttingQuestionsState>({
			area: {
				answered: isAnswered,
				value: process.Cutting?.Area
					? process.Cutting?.Area.toFixed(3)
					: 0,
			},
			coefficient: {
				answered: isAnswered,
				value: process.Cutting?.Coefficient,
			},
			cuttingMethodNatural: {
				answered: isAnswered,
				value: process.Cutting?.CuttingMethodNaturalID,
			},
			cuttingMethodSynthetic: {
				answered: isAnswered,
				value: process.Cutting?.CuttingMethodSyntheticID,
			},
			cuttingType: {
				answered: isAnswered,
				value: process.Cutting?.CuttingtypeID,
			},
			depth: {
				answered: isAnswered,
				value: process.Cutting?.Depth
					? process.Cutting?.Depth.toFixed(3)
					: 0,
			},
			feedSystem: {
				answered: isAnswered,
				value: process.Cutting?.FeedsystemID,
			},
			layers: {
				answered: isAnswered,
				value: process.Cutting?.Layers,
			},
			fabricLength: {
				answered: isAnswered,
				value: process?.Cutting?.Length
					? process.Cutting?.Length.toFixed(3)
					: 0,
			},
			materialType: {
				answered: isAnswered,
				value: process.Cutting?.MaterialtypeID,
			},
			sizes: {
				answered: isAnswered,
				value: process.Cutting?.Sizes,
			},
			unit: {
				answered: isAnswered,
				value: process.Cutting?.UnitsID,
			},
			unitsPerJob: {
				answered: isAnswered,
				value: process.Cutting?.UnitsPerJob,
			},
			width: {
				answered: isAnswered,
				value: process.Cutting?.Width
					? process.Cutting?.Width.toFixed(3)
					: 0,
			},
		});
	const [knivesQuestionsState, setKnivesQuestionsState] =
		useState<KnivesQuestionState>({
			answered: !!process.Cutting?.Knives?.length || isAnswered,
			value: process.Cutting?.Knives || [],
		});
	const [
		additionalStepsQuestionsState,
		setAdditionalStepsQuestionsState,
	] = useState<AdditionalStepsState>({
		answered: !!process.AdditionalSteps?.length || isAnswered,
		value: process.AdditionalSteps || [],
	});
	const [unmannedQuestionsState, setUnmannedQuestionsState] =
		useState<UnmannedQuestionsState>({
			emptyBeforeShutdown: {
				answered: isAnswered,
				value: process.Unmanned?.EmptyBeforeShutdown ? "yes" : "no",
			},
			emptyItself: {
				answered: isAnswered,
				value: process.Unmanned?.EmptyItself ? "yes" : "no",
			},
			lanes: {
				answered: isAnswered,
				value: process.Unmanned?.Lanes,
			},
			maximumUnits: {
				answered: isAnswered,
				value: process.Unmanned?.MaximumUnits,
			},
			valueAdded: {
				answered: isAnswered,
				value: process.Unmanned?.ValueAdded ? "yes" : "no",
			},
			wholeCycleTime: {
				answered: isAnswered,
				value: process.Unmanned?.WholeCycleTime,
			},
		});
	const [groupProcessesQuestionsState, setGroupProcessesQuestionsState] =
		useState<GroupProcessesQuestionsState>(process.Group || []);
	const [pathsQuestionsState, setPathsQuestionsState] =
		useState<PathsQuestionState>({
			answered: !!process?.Points?.length,
			value: process.Points || [],
		});
	const [questionsAnswers, setQuestionsAnswers] = useState(
		process.QuestionsAnswers || []
	);
	const [groups, setGroups] = useState<null | QuestionCategory[]>(categories);
	const [percentageComplete, setPercentageComplete] = useState(0);
	const [groupSubmit, setGroupSubmit] = useState(false);
	const [availablePaths, setAvailablePaths] = useState<PointData[][]>([]);
	const [isSaving, setIsSaving] = useState(false);
	const [isPathRequired, setIsPathRequired] = useState(true);
	const previousGroupId = useRef(activeGroupId);

	useEffect(() => {
		if (responseData?.type === "error") {
			processResponse(responseData);
			ResponseDataUtilities.resetResponseData(responseData);
		}
	}, [responseData?.type, responseData, processResponse]);

	const getGroupComplete = (thisGroup: QuestionCategory) => {
		if (thisGroup) {
			switch (thisGroup.id) {
				case "general": {
					const generalQuestions = Object.values(
						generalQuestionsState
					);
					return {
						total: generalQuestions.length,
						complete: generalQuestions.filter(
							(q) => typeof q === "object" && q.answered
						).length,
					};
				}
				case "machining": {
					let machiningQuestions: Question[];
					switch (process.CategoryKind) {
						case "ocStitching":
							machiningQuestions = Object.values(
								machiningStitchingQuestionsState
							);
							break;
						case "ocPalletStitching":
							machiningQuestions = Object.values(
								machiningPalletStitchingQuestionsState
							);
							break;
						case "ocStrobelStitching":
							machiningQuestions = Object.values(
								machiningStrobelStitchingQuestionsState
							);
							break;
						case "ocFolding":
							machiningQuestions = Object.values(
								machiningFoldingQuestionsState
							);
							break;
						default:
							machiningQuestions = [];
					}
					return {
						total: machiningQuestions.length,
						complete: machiningQuestions.filter((q) => q.answered)
							.length,
					};
				}
				case "cutting": {
					const cuttingQuestions = Object.values(
						cuttingQuestionsState
					);
					return {
						total: cuttingQuestions.length,
						complete: cuttingQuestions.filter((q) => q.answered)
							.length,
					};
				}
				case "knives":
					return {
						total: 1,
						complete: knivesQuestionsState.answered ? 1 : 0,
					};
				case "additionalSteps":
					return {
						total: 1,
						complete: additionalStepsQuestionsState.answered
							? 1
							: 0,
					};
				case "unmanned": {
					const unmannedQuestions = Object.values(
						unmannedQuestionsState
					);
					return {
						total: unmannedQuestions.length,
						complete: unmannedQuestions.filter((q) => q.answered)
							.length,
					};
				}
				case "processes": {
					const processesQuestions = groupProcessesQuestionsState;
					return {
						total: Math.max(processesQuestions.length, 3),
						complete: processesQuestions.filter(
							(q) => Object.keys(q).length
						).length,
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
		} else {
			return { total: 0, complete: 0 };
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
		const isAltPath = id && /^altpath/.test(id.toString());
		const group = groupsToCheck.find(
			(g) => g.id === id
		) as QuestionCategory;
		const { total, complete } = getGroupComplete(group);
		let state: QuestionState = "initial";

		if (complete === total) {
			state = "complete";
			if (isAltPath) {
				setIsPathRequired(false);
			}
		} else if (complete > 0 || group?.isDirty) {
			state = "incomplete";
			if (isAltPath) {
				setIsPathRequired(true);
			}
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

				fetcher.submit(
					{
						[FORM_IDENTIFIERS.nameAttribute]:
							FORM_IDENTIFIERS.completeProcessQuestions,
						generalQuestionsState: JSON.stringify(
							generalQuestionsState
						),
						machiningStitchingQuestionsState: JSON.stringify(
							machiningStitchingQuestionsState
						),
						machiningPalletStitchingQuestionsState: JSON.stringify(
							machiningPalletStitchingQuestionsState
						),
						machiningStrobelStitchingQuestionsState: JSON.stringify(
							machiningStrobelStitchingQuestionsState
						),
						machiningFoldingQuestionsState: JSON.stringify(
							machiningFoldingQuestionsState
						),
						cuttingQuestionsState: JSON.stringify(
							cuttingQuestionsState
						),
						knivesQuestionsState:
							JSON.stringify(knivesQuestionsState),
						additionalStepsQuestionsState: JSON.stringify(
							additionalStepsQuestionsState
						),
						unmannedQuestionsState: JSON.stringify(
							unmannedQuestionsState
						),
						groupProcessesQuestionsState: JSON.stringify(
							groupProcessesQuestionsState
						),
						pathsQuestionsState:
							JSON.stringify(pathsQuestionsState),
						questionsAnswers: JSON.stringify(questionsAnswers),
						updateMap: JSON.stringify(updateMap),
					},
					{ method: "put", action: location.pathname }
				);
			}

			if (!isLastQuestion) {
				setActiveGroupId(groups[currentGroupIndex + 1].id);
				return;
			}
		}
	};

	useEffect(() => {
		const { next } = getGroupState("paths");
		setGroupState("paths", next, true);
	}, [isPathRequired]); // eslint-disable-line react-hooks/exhaustive-deps

	const isUMapUpdated = (umap: OpUpdateMap | null = updateMap) => {
		let qaHasUpdated = false;
		if (umap && !ObjectUtilities.objIsEmpty(umap)) {
			qaHasUpdated = Object.values(umap).find((v) => v === true)
				? true
				: false;
		}
		return qaHasUpdated;
	};

	const formHasChanged = (dataType: string | string[]) => {
		if (Array.isArray(dataType)) {
			setUpdateMap((previous) => {
				const next = { ...previous };
				next![dataType[0] as keyof OpUpdateMap]![
					dataType[1] as keyof CuttingQType
				] = true;

				return { ...next };
			});
		} else {
			if (dataType !== "Header") {
				setUpdateMap((previous) => {
					const next = { ...previous };
					next[dataType as keyof OpUpdateMap] = true;

					return { ...next };
				});
			}
		}
		setUpdateMap((previous) => {
			const next = { ...previous };
			next.Header = true;

			return { ...next };
		});
	};

	useEffect(() => {
		if (groups) {
			setPercentageComplete(getAllComplete().percentage);
			const {
				next,
				group: { state, isDirty },
			} = getGroupState(activeGroupId ?? 0);
			if (state === "error" && activeGroupId !== "processes") {
				return;
			}
			setGroupState(
				activeGroupId ?? 0,
				!isDirty && next === "incomplete" ? "initial" : next
			);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		questionsAnswers,
		generalQuestionsState,
		machiningStitchingQuestionsState,
		machiningPalletStitchingQuestionsState,
		machiningStrobelStitchingQuestionsState,
		machiningFoldingQuestionsState,
		cuttingQuestionsState,
		knivesQuestionsState,
		additionalStepsQuestionsState,
		unmannedQuestionsState,
		groupProcessesQuestionsState,
		pathsQuestionsState,
		activeGroupId,
		groups,
	]);

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

	useEffect(() => {
		setUpdateMap({
			Cutting: {
				Header: false,
				Knives: false,
			},
			AdditionalSteps: false,
			Group: false,
			Header: false,
			Machining_Folding: false,
			Machining_Pallet_Stitching: false,
			Machining_Stitching: false,
			Machining_Strobel_Stitching: false,
			Points: false,
			QuestionsAnswers: false,
			Unmanned: false,
		});
		if (groups) {
			groups.forEach((group) => {
				const { next } = getGroupState(group.id);
				setGroupState(
					group.id,
					next,
					next !== "initial" ? true : undefined
				);
			});
		}
	}, [groups]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<QuestionsContext.Provider
			value={{
				previewMode,
				activeGroupId,
				setActiveGroupId,
				groups,
				setGroups,
				setGroupState,
				getGroupState,
				generalQuestionsState,
				setGeneralQuestionsState,
				machiningStitchingQuestionsState,
				setMachiningStitchingQuestionsState,
				machiningPalletStitchingQuestionsState,
				setMachiningPalletStitchingQuestionsState,
				machiningStrobelStitchingQuestionsState,
				setMachiningStrobelStitchingQuestionsState,
				machiningFoldingQuestionsState,
				setMachiningFoldingQuestionsState,
				cuttingQuestionsState,
				setCuttingQuestionsState,
				knivesQuestionsState,
				setKnivesQuestionsState,
				additionalStepsQuestionsState,
				setAdditionalStepsQuestionsState,
				unmannedQuestionsState,
				setUnmannedQuestionsState,
				groupProcessesQuestionsState,
				setGroupProcessesQuestionsState,
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
				updateMap,
				setUpdateMap,
				isUMapUpdated,
				formHasChanged,
			}}
		>
			{children}
		</QuestionsContext.Provider>
	);
};
