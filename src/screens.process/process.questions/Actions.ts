import { QueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { Params, redirect } from "react-router-dom";
import api from "../../api.common";
import {
	ProcessCreationStatus,
	ProcessData,
	QuestionAnswerData,
	ResponseData,
	ResponseMessage,
} from "../../api.common/types";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";
import {
	AdditionalStepsState,
	CuttingQuestionsState,
	GeneralQuestionsState,
	GroupProcessesQuestionsState,
	KnivesQuestionState,
	MachiningFoldingQuestionsState,
	MachiningPalletStitchingQuestionsState,
	MachiningStitchingQuestionsState,
	MachiningStrobelStitchingQuestionsState,
	PathsQuestionState,
	UnmannedQuestionsState,
} from "./partials/_QuestionsContext";
import { convertBetweenInchCM } from "../../utilities.common/MathsUtilities";

export const processQuestionsAction =
	(queryClient: QueryClient) =>
	async ({ request, params }: { request: Request; params: Params }) => {
		const formData = await request.formData();

		const { identifier } = Object.fromEntries(formData.entries());

		switch (identifier) {
			case FORM_IDENTIFIERS.completeProcessQuestions:
				return await updateProcessQuestionsAction(
					queryClient,
					formData,
					params,
					"ocsReadyToComplete"
				);
			case FORM_IDENTIFIERS.partialSaveProcessQuestions:
				return await updateProcessQuestionsAction(
					queryClient,
					formData,
					params,
					"ocsIntermediate"
				);
		}

		return null;
	};

const updateProcessQuestionsAction = async (
	queryClient: QueryClient,
	formData: FormData,
	params: Params,
	creationStatus: ProcessCreationStatus
) => {
	const cache = queryClient
		.getQueryCache()
		.find([QUERY_KEYS.process, params.id]);
	const { data: cachedProcess } = cache?.state
		.data as AxiosResponse<ProcessData>;
	const process = ObjectUtilities.deepCopy(cachedProcess);
	const clonedProcess = ObjectUtilities.deepCopy(process);

	hydrate(clonedProcess, formData, creationStatus);
	clonedProcess.CreationStatus = creationStatus;

	let errorData: ResponseData | undefined;

	await api.updateProcess(clonedProcess).catch((e: AxiosError) => {
		errorData = {
			code: e.response?.status,
			message: e.response?.statusText,
			responseMessage: e.response?.data as ResponseMessage,
			type: "error",
		};
	});

	if (errorData) return errorData;

	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.processes]});
	await queryClient.invalidateQueries({queryKey: [QUERY_KEYS.process, params.id]});

	return redirect(`/processes/${params.id}`);
};

const hydrate = (
	clonedProcess: ProcessData,
	formData: FormData,
	creationStatus: ProcessCreationStatus
) => {
	const {
		generalQuestionsState,
		machiningStitchingQuestionsState,
		machiningPalletStitchingQuestionsState,
		machiningStrobelStitchingQuestionsState,
		machiningFoldingQuestionsState,
		cuttingQuestionsState,
		knivesQuestionsState,
		additionalStepsQuestionsState,
		unmannedQuestionsState,
		groupOperationsQuestionsState: groupProcessesQuestionsState,
		pathsQuestionsState,
		questionsAnswers,
		updateMap,
	} = Object.fromEntries(formData.entries());

	clonedProcess.UpdateMap = JSON.parse(updateMap as string);

	const category = clonedProcess.CategoryKind;

	if (generalQuestionsState && clonedProcess.UpdateMap.Header) {
		const {
			batchSize,
			contingency,
			grade,
			machine,
			madeInPairs,
			rest,
			itemsTaskCovers,
			groupAllowance,
		}: GeneralQuestionsState = JSON.parse(generalQuestionsState as string);

		if (batchSize) {
			clonedProcess.BatchSize = Number(batchSize.value);
		}

		if (contingency) {
			clonedProcess.Contingency = Number(contingency.value);
		}

		if (grade) {
			clonedProcess.GradeID = Number(grade.value);
		}

		if (machine) {
			clonedProcess.MachineID = Number(machine.value);
		}

		if (madeInPairs) {
			clonedProcess.MadeInPairs = madeInPairs.value === "yes";
		}

		if (groupAllowance) {
			clonedProcess.UseVGRestCont = groupAllowance.value === "yes";
		}

		if (rest) {
			clonedProcess.Rest = Number(rest.value);
		}

		if (itemsTaskCovers) {
			clonedProcess.ItemsCovered = Number(itemsTaskCovers.value);
		}
	}

	if (
		machiningStitchingQuestionsState &&
		category === "ocStitching" &&
		clonedProcess.UpdateMap.Machining_Stitching
	) {
		const {
			densityUnits,
			densityPerInch,
			machineType,
			materialProperty,
			maximumSpeed,
			minimumSpeed,
			needleType,
			stitchingModifier,
		}: MachiningStitchingQuestionsState = JSON.parse(
			machiningStitchingQuestionsState as string
		);

		if (densityUnits && densityUnits.value === "inch") {
			clonedProcess.Machining_Stitching!.DensityDisplayInches = true;
		} else {
			clonedProcess.Machining_Stitching!.DensityDisplayInches = false;
		}

		if (densityPerInch) {
			if (densityUnits?.value === "inch") {
				clonedProcess.Machining_Stitching!.DensityPerInch = Number(
					densityPerInch.value
				);
			} else if (densityUnits?.value === "cm") {
				clonedProcess.Machining_Stitching!.DensityPerInch =
					convertBetweenInchCM(Number(densityPerInch.value), false);
			}
		}

		if (machineType) {
			clonedProcess.Machining_Stitching!.MachineTypePost =
				machineType.value === "post";
		}

		if (materialProperty) {
			clonedProcess.Machining_Stitching!.MaterialPropertyFloppy =
				materialProperty.value === "floppy";
		}

		if (maximumSpeed) {
			clonedProcess.Machining_Stitching!.MaximumSpeed = Number(
				maximumSpeed.value
			);
		}

		if (minimumSpeed) {
			clonedProcess.Machining_Stitching!.MinimumSpeed = Number(
				minimumSpeed.value
			);
		}

		if (needleType) {
			clonedProcess.Machining_Stitching!.NeedleTypeTwin =
				needleType.value === "twin";
		}

		if (stitchingModifier) {
			clonedProcess.Machining_Stitching!.StitchingmodifierID = Number(
				stitchingModifier.value
			);
		}
	}

	if (
		machiningPalletStitchingQuestionsState &&
		category === "ocPalletStitching" &&
		clonedProcess.UpdateMap.Machining_Pallet_Stitching
	) {
		const {
			densityUnits,
			densityPerInch,
			programmedSpeed,
		}: MachiningPalletStitchingQuestionsState = JSON.parse(
			machiningPalletStitchingQuestionsState as string
		);

		if (densityUnits && densityUnits.value === "inch") {
			clonedProcess.Machining_Pallet_Stitching!.DensityDisplayInches =
				true;
		} else {
			clonedProcess.Machining_Pallet_Stitching!.DensityDisplayInches =
				false;
		}

		if (densityPerInch) {
			if (densityUnits?.value === "inch") {
				clonedProcess.Machining_Pallet_Stitching!.DensityPerInch =
					Number(densityPerInch.value);
			} else if (densityUnits?.value === "cm") {
				clonedProcess.Machining_Pallet_Stitching!.DensityPerInch =
					convertBetweenInchCM(Number(densityPerInch.value), false);
			}
		}

		if (programmedSpeed) {
			clonedProcess.Machining_Pallet_Stitching!.ProgrammedSpeed =
				Number(programmedSpeed.value);
		}
	}

	if (
		machiningStrobelStitchingQuestionsState &&
		category === "ocStrobelStitching" &&
		clonedProcess.UpdateMap.Machining_Strobel_Stitching
	) {
		const {
			densityUnits,
			densityPerInch,
			maximumSpeed,
			minimumSpeed,
		}: MachiningStrobelStitchingQuestionsState = JSON.parse(
			machiningStrobelStitchingQuestionsState as string
		);

		if (densityUnits && densityUnits.value === "inch") {
			clonedProcess.Machining_Strobel_Stitching!.DensityDisplayInches =
				true;
		} else {
			clonedProcess.Machining_Strobel_Stitching!.DensityDisplayInches =
				false;
		}

		if (densityPerInch) {
			if (densityUnits?.value === "inch") {
				clonedProcess.Machining_Strobel_Stitching!.DensityPerInch =
					Number(densityPerInch.value);
			} else if (densityUnits?.value === "cm") {
				clonedProcess.Machining_Strobel_Stitching!.DensityPerInch =
					convertBetweenInchCM(Number(densityPerInch.value), false);
			}
		}

		if (maximumSpeed) {
			clonedProcess.Machining_Strobel_Stitching!.MaximumSpeed = Number(
				maximumSpeed.value
			);
		}

		if (minimumSpeed) {
			clonedProcess.Machining_Strobel_Stitching!.MinimumSpeed = Number(
				minimumSpeed.value
			);
		}
	}

	if (
		machiningFoldingQuestionsState &&
		category === "ocFolding" &&
		clonedProcess.UpdateMap.Machining_Folding
	) {
		const {
			densityUnits,
			densityPerInch,
			materialProperty,
			maximumSpeed,
			minimumSpeed,
		}: MachiningFoldingQuestionsState = JSON.parse(
			machiningFoldingQuestionsState as string
		);

		if (densityUnits && densityUnits.value === "inch") {
			clonedProcess.Machining_Folding!.DensityDisplayInches = true;
		} else {
			clonedProcess.Machining_Folding!.DensityDisplayInches = false;
		}

		if (densityPerInch) {
			if (densityUnits?.value === "inch") {
				clonedProcess.Machining_Folding!.DensityPerInch = Number(
					densityPerInch.value
				);
			} else if (densityUnits?.value === "cm") {
				clonedProcess.Machining_Folding!.DensityPerInch =
					convertBetweenInchCM(Number(densityPerInch.value), false);
			}
		}

		if (materialProperty) {
			clonedProcess.Machining_Folding!.MaterialPropertyFloppy =
				materialProperty.value === "floppy";
		}

		if (maximumSpeed) {
			clonedProcess.Machining_Folding!.MaximumSpeed = Number(
				maximumSpeed.value
			);
		}

		if (minimumSpeed) {
			clonedProcess.Machining_Folding!.MinimumSpeed = Number(
				minimumSpeed.value
			);
		}
	}

	if (
		cuttingQuestionsState &&
		category === "ocCutting" &&
		clonedProcess.UpdateMap.Cutting?.Header
	) {
		const {
			area,
			coefficient,
			cuttingMethodNatural,
			cuttingMethodSynthetic,
			cuttingType,
			depth,
			feedSystem,
			layers,
			fabricLength,
			materialType,
			sizes,
			unit,
			unitsPerJob,
			width,
		}: CuttingQuestionsState = JSON.parse(cuttingQuestionsState as string);

		if (area) {
			clonedProcess.Cutting!.Area = Number(area.value);
		}

		if (coefficient) {
			clonedProcess.Cutting!.Coefficient = Number(coefficient.value);
		}

		if (cuttingMethodNatural) {
			clonedProcess.Cutting!.CuttingMethodNaturalID = Number(
				cuttingMethodNatural.value
			);
		}

		if (cuttingMethodSynthetic) {
			clonedProcess.Cutting!.CuttingMethodSyntheticID = Number(
				cuttingMethodSynthetic.value
			);
		}

		if (cuttingType) {
			clonedProcess.Cutting!.CuttingtypeID = Number(cuttingType.value);
		}

		if (depth) {
			clonedProcess.Cutting!.Depth = Number(depth.value);
		}

		if (feedSystem) {
			clonedProcess.Cutting!.FeedsystemID = Number(feedSystem.value);
		}

		if (layers) {
			clonedProcess.Cutting!.Layers = Number(layers.value);
		}

		if (fabricLength) {
			clonedProcess.Cutting!.Length = Number(fabricLength.value);
		}

		if (materialType) {
			clonedProcess.Cutting!.MaterialtypeID = Number(
				materialType.value
			);
		}

		if (sizes) {
			clonedProcess.Cutting!.Sizes = Number(sizes.value);
		}

		if (unit) {
			clonedProcess.Cutting!.UnitsID = Number(unit.value);
		}

		if (unitsPerJob) {
			clonedProcess.Cutting!.UnitsPerJob = Number(unitsPerJob.value);
		}

		if (width) {
			clonedProcess.Cutting!.Width = Number(width.value);
		}
	}

	if (
		knivesQuestionsState &&
		category === "ocCutting" &&
		clonedProcess.UpdateMap.Cutting?.Knives
	) {
		const knives: KnivesQuestionState = JSON.parse(
			knivesQuestionsState as string
		);

		clonedProcess.Cutting!.Knives = knives.value;
	}

	if (
		additionalStepsQuestionsState &&
		category !== "ocUnmanned" &&
		category !== "ocGroup" &&
		clonedProcess.UpdateMap.AdditionalSteps
	) {
		const steps: AdditionalStepsState = JSON.parse(
			additionalStepsQuestionsState as string
		);

		for (const step of steps.value) {
			delete step._Step;
		}

		clonedProcess.AdditionalSteps = steps.value;
	}

	if (
		unmannedQuestionsState &&
		category === "ocUnmanned" &&
		clonedProcess.UpdateMap.Unmanned
	) {
		const {
			emptyBeforeShutdown,
			emptyItself,
			lanes,
			maximumUnits,
			valueAdded,
			wholeCycleTime,
		}: UnmannedQuestionsState = JSON.parse(
			unmannedQuestionsState as string
		);

		if (emptyBeforeShutdown) {
			clonedProcess.Unmanned!.EmptyBeforeShutdown =
				emptyBeforeShutdown.value === "yes";
		}

		if (emptyItself) {
			clonedProcess.Unmanned!.EmptyItself = emptyItself.value === "yes";
		}

		if (lanes) {
			clonedProcess.Unmanned!.Lanes = Number(lanes.value);
		}

		if (maximumUnits) {
			clonedProcess.Unmanned!.MaximumUnits = Number(maximumUnits.value);
		}

		if (valueAdded) {
			clonedProcess.Unmanned!.ValueAdded = valueAdded.value === "yes";
		}

		if (wholeCycleTime) {
			clonedProcess.Unmanned!.WholeCycleTime = Number(
				wholeCycleTime.value
			);
		}
	}

	if (
		groupProcessesQuestionsState &&
		category === "ocGroup" &&
		clonedProcess.UpdateMap.Group
	) {
		const processes: GroupProcessesQuestionsState = JSON.parse(
			groupProcessesQuestionsState as string
		);

		for (const process of processes) {
			delete process._GroupOperation;
		}

		clonedProcess.Group = processes;
	}

	if (
		pathsQuestionsState &&
		(category === "ocRegular" ||
			category === "ocFolding" ||
			category === "ocPalletStitching" ||
			category === "ocStitching" ||
			category === "ocStrobelStitching") &&
		clonedProcess.UpdateMap.Points
	) {
		const points: PathsQuestionState = JSON.parse(
			pathsQuestionsState as string
		);
		if (points.value === "1") {
			clonedProcess.UpdateMap.Points = false;
			delete clonedProcess.Points;
		} else {
			clonedProcess.Points = points.value;
		}
	}

	if (
		questionsAnswers &&
		category !== "ocCutting" &&
		category !== "ocGroup" &&
		category !== "ocUnmanned" &&
		clonedProcess.UpdateMap.QuestionsAnswers
	) {
		const parsedQuestions: QuestionAnswerData[] = JSON.parse(
			questionsAnswers as string
		);

		if (creationStatus === "ocsReadyToComplete") {
			parsedQuestions.forEach((q) => {
				if (!q.Answered) {
					q.Answered = true;
				}
			});
		}

		clonedProcess.QuestionsAnswers = parsedQuestions;
	}
};
