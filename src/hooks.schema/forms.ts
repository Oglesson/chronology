import { FieldValues } from "react-hook-form/dist/types/fields";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { DepartmentData } from "../api.common/types";
import {
	useAreaFieldSchema,
	useBandsFieldSchema,
	useBatchSizeFieldSchema,
	useClearsFieldSchema,
	useCodeFieldSchema,
	useCoefficientFieldSchema,
	useCommentFieldSchema,
	useContingencyFieldSchema,
	useCutsLRFieldSchema,
	useCuttingMethodNaturalFieldSchema,
	useCuttingMethodSyntheticFieldSchema,
	useCuttingTypeFieldSchema,
	useDefaultItemsCoveredFieldSchema,
	useDensityUnitsFieldSchema,
	useDensityPerInchFieldSchema,
	useDepartmentFieldSchema,
	useDepartmentNumberFieldSchema,
	useDepthFieldSchema,
	useDescriptionFieldSchema,
	useDistanceFieldSchema,
	useEffectLevelFieldSchema,
	useStepFieldSchema,
	useStepsConditionsFieldSchema,
	useEmptyBeforeShutdownFieldSchema,
	useEmptyItselfFieldSchema,
	useEveryFieldSchema,
	useEveryFormulaFieldSchema,
	useExplanationFieldSchema,
	useExtraConditionsFieldSchema,
	useFeedSystemFieldSchema,
	useFreqFieldSchema,
	useFreqFormulaFieldSchema,
	useFrequencyFieldSchema,
	useGradeFieldSchema,
	useGroupAllowanceFieldSchema,
	useGroupMemberFieldSchema,
	useHandlingProcessDefinitionFieldSchema,
	useLanesFieldSchema,
	useLayersFieldSchema,
	useLengthFieldSchema,
	useMachineFieldSchema,
	useMachineTypeFieldSchema,
	useMadeInPairsFieldSchema,
	useMainDesignFieldSchema,
	useMarksFieldSchema,
	useMaterialPropertyFieldSchema,
	useMaterialTypeFieldSchema,
	useMaximumSpeedFieldSchema,
	useMaximumUnitsFieldSchema,
	useMinimumSpeedFieldSchema,
	useModifierFieldSchema,
	useActionFieldSchema,
	useNameFieldSchema,
	useNeedleTypeFieldSchema,
	useNettAreaFieldSchema,
	useNoFieldSchema,
	useProcessCategoryFieldSchema,
	useProcessClassFieldSchema,
	useProcessDefinitionTypeFieldSchema,
	useProcessTypeFieldSchema,
	usePairsCostedFieldSchema,
	usePathFeatureFieldSchema,
	usePathFeaturesFieldSchema,
	usePathTypeFieldSchema,
	usePeelsFieldSchema,
	usePerBatchFieldSchema,
	usePhotoFieldSchema,
	usePiecesFieldSchema,
	useProgrammedSpeedFieldSchema,
	useQuantityFieldSchema,
	useRatePerMinuteFieldSchema,
	useReflectLevelFieldSchema,
	useRestFieldSchema,
	useSecsAt100FieldSchema,
	useItemsTaskCoversFieldSchema,
	useSimoFieldSchema,
	useSizesFieldSchema,
	useSpeedRatioFieldSchema,
	useStitchingModifierFieldSchema,
	useTaskProcessDefinitionFieldSchema,
	useThinFieldSchema,
	useTitleFieldSchema,
	useUnitFieldSchema,
	useUnitsPerJobFieldSchema,
	useValueAddedFieldSchema,
	useWholeCycleTimeFieldSchema,
	useWidthFieldSchema,
} from "./fields";

export const useActionFormSchema = (existingCodes: string[] = []) => {
	const code = useCodeFieldSchema(existingCodes);
	const description = useDescriptionFieldSchema();
	const reflectLevel = useReflectLevelFieldSchema();
	const secsAt100 = useSecsAt100FieldSchema();

	return code.merge(description).merge(reflectLevel).merge(secsAt100);
};

export const useStepFormSchema = (existingCodes: string[] = []) => {
	const code = useCodeFieldSchema(existingCodes);
	const description = useDescriptionFieldSchema();
	const valueAdded = useValueAddedFieldSchema();

	return code.merge(description).merge(valueAdded);
};

export const useStepActionFormSchema = () => {
	const action = useActionFieldSchema();
	const comment = useCommentFieldSchema();
	const frequency = useFrequencyFieldSchema();

	return action.merge(comment).merge(frequency);
};

export const useStepActionTitleFormSchema = () => {
	const title = useTitleFieldSchema();

	return title;
};

export const useDefinitionStepFormSchema = () => {
	const step = useStepFieldSchema();
	const stepsConditions = useStepsConditionsFieldSchema();
	const freqFormula = useFreqFormulaFieldSchema();
	const everyFormula = useEveryFormulaFieldSchema();
	const extraConditions = useExtraConditionsFieldSchema();
	const simo = useSimoFieldSchema();
	const perBatch = usePerBatchFieldSchema();

	return step
		.merge(stepsConditions)
		.merge(freqFormula)
		.merge(everyFormula)
		.merge(extraConditions)
		.merge(simo)
		.merge(perBatch);
};

export const useDefinitionStepForPathFeatureFormSchema = () => {
	const pathFeature = usePathFeatureFieldSchema();
	const step = useStepFieldSchema();
	const stepsConditions = useStepsConditionsFieldSchema();
	const freqFormula = useFreqFormulaFieldSchema();
	const everyFormula = useEveryFormulaFieldSchema();
	const extraConditions = useExtraConditionsFieldSchema();
	const simo = useSimoFieldSchema();

	return pathFeature
		.merge(step)
		.merge(stepsConditions)
		.merge(freqFormula)
		.merge(everyFormula)
		.merge(extraConditions)
		.merge(simo);
};

export const usePathTypeFormSchema = () => {
	const name = useNameFieldSchema();
	const { t } = useTranslation();

	const requiredMessage = t("stepRequiredErrorMessage", {
		defaultValue: "Please select an Step from the list",
	});

	const radiiSchema = z.preprocess(
		(val) =>
			(val as string)?.length ? JSON.parse(val as string).Code : val,
		z
			.string({
				required_error: requiredMessage,
			})
			.min(1, requiredMessage)
	);

	return name.merge(
		z.object({
			radii5: radiiSchema,
			radii10: radiiSchema,
			radii15: radiiSchema,
			radii20: radiiSchema,
			radii30: radiiSchema,
			radii40: radiiSchema,
			radii50: radiiSchema,
			radii60: radiiSchema,
			radii80: radiiSchema,
			radii110: radiiSchema,
		})
	);
};

const useBaseQuestionFormSchema = () => {
	const title = useTitleFieldSchema();
	const explanation = useExplanationFieldSchema();

	return title.merge(explanation);
};

export const useChoiceQuestionFormSchema = () => {
	const baseQuestionFormSchema = useBaseQuestionFormSchema();

	return baseQuestionFormSchema.merge(
		z.object({
			defaultIndex: z.number({
				invalid_type_error: "Required",
			}),
			choices: z.array(
				z.object({ value: z.string().min(1), index: z.number() })
			),
		})
	);
};

export const useNumberQuestionFormSchema = (getValues: () => FieldValues) => {
	const baseQuestionFormSchema = useBaseQuestionFormSchema();

	return baseQuestionFormSchema.merge(
		z.object({
			minValue: z
				.number({
					invalid_type_error: "Minimum must contain a number",
				})
				.superRefine((val, ctx) => {
					const { maxValue } = getValues();
					if (val > maxValue) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Minimum must not be greater than Maximum",
						});
					}
				}),
			maxValue: z
				.number({
					invalid_type_error: "Maximum must contain a number",
				})
				.superRefine((val, ctx) => {
					const { minValue } = getValues();
					if (val < minValue) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Maximum must not be less than Minimum",
						});
					}
				}),
			defaultValue: z
				.number({
					invalid_type_error: "Default must contain a number",
				})
				.superRefine((val, ctx) => {
					const { minValue, maxValue } = getValues();
					if (val < minValue) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Default must not be less than Minimum",
						});
					} else if (val > maxValue) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Default must not be greater than Maximum",
						});
					}
				}),
			decimalPlaces: z
				.number({
					invalid_type_error:
						"Decimal places must contain a number value between 0 and 4",
					required_error:
						"Decimal places must contain a number value between 0 and 4",
				})
				.int()
				.gte(0, "Decimal places cannot be less than 0")
				.lte(4, "Decimal places cannot be greater than 4"),
		})
	);
};

export const useProcessDefinitionFormSchema = (
	existingCodes: string[] = []
) => {
	const code = useCodeFieldSchema(existingCodes);
	const processDefinitionType = useProcessDefinitionTypeFieldSchema();

	return code.merge(processDefinitionType);
};

export const useDepartmentsFormSchema = (
	departments: DepartmentData[],
	id?: number
) => {
	const batchSize = useBatchSizeFieldSchema(2000);
	const departmentNumber = useDepartmentNumberFieldSchema(departments, id);
	const description = useDescriptionFieldSchema();

	return batchSize.merge(departmentNumber).merge(description);
};

export const useGradeFormSchema = (
	existingCodes: string[] = [],
	currentCode?: string
) => {
	const code = useCodeFieldSchema(existingCodes, currentCode, 2);
	const ratePerMinute = useRatePerMinuteFieldSchema();

	return code.merge(ratePerMinute);
};

export const useMachineFormSchema = (
	existingCodes: string[] = [],
	currentCode?: string
) => {
	const code = useCodeFieldSchema(existingCodes, currentCode);
	const description = useDescriptionFieldSchema();

	return code.merge(description).merge(
		z.object({
			departmentId: z
				.union([z.number(), z.literal("null")])
				.nullable()
				.optional(),
		})
	);
};

export const useStitchingModifierFormSchema = () => {
	const no = useNoFieldSchema();
	const description = useDescriptionFieldSchema(25);
	const effectLevel = useEffectLevelFieldSchema();
	const modifier = useModifierFieldSchema();

	return no.merge(description).merge(effectLevel).merge(modifier);
};

export const useDefinitionPathFormSchema = () => {
	const description = useDescriptionFieldSchema(30);

	return description;
};

export const useAmendmentsFormSchema = () => {
	const speedRatio = useSpeedRatioFieldSchema();
	const distance = useDistanceFieldSchema();

	return speedRatio.merge(distance);
};

export const useCreateProcessTypeFormSchema = () => {
	const name = useNameFieldSchema(20);
	const processCategorySchema = useProcessCategoryFieldSchema();
	const handlingProcessDefinition =
		useHandlingProcessDefinitionFieldSchema();
	const taskProcessDefinition = useTaskProcessDefinitionFieldSchema();
	const defaultItemsCovered = useDefaultItemsCoveredFieldSchema();
	const rest = useRestFieldSchema();
	const contingency = useContingencyFieldSchema();
	const groupMember = useGroupMemberFieldSchema();

	return name
		.merge(processCategorySchema)
		.merge(handlingProcessDefinition)
		.merge(taskProcessDefinition)
		.merge(defaultItemsCovered)
		.merge(rest)
		.merge(contingency)
		.merge(groupMember);
};

export const useEditProcessTypeFormSchema = () => {
	const name = useNameFieldSchema(20);
	const defaultItemsCovered = useDefaultItemsCoveredFieldSchema();
	const rest = useRestFieldSchema();
	const contingency = useContingencyFieldSchema();
	const groupMember = useGroupMemberFieldSchema();

	return name
		.merge(defaultItemsCovered)
		.merge(rest)
		.merge(contingency)
		.merge(groupMember);
};

export const useProcessFormSchema = (existingCodes: string[] = []) => {
	const code = useCodeFieldSchema(existingCodes);
	const description = useDescriptionFieldSchema();
	const processClass = useProcessClassFieldSchema();
	const processType = useProcessTypeFieldSchema();
	const department = useDepartmentFieldSchema();
	const mainDesign = useMainDesignFieldSchema();

	return code
		.merge(description)
		.merge(processClass)
		.merge(processType)
		.merge(department)
		.merge(mainDesign);
};

export const useProcessSetFormSchema = (existingCodes: string[] = []) => {
	const code = useCodeFieldSchema(existingCodes);
	const description = useDescriptionFieldSchema();
	const department = useDepartmentFieldSchema();

	return code.merge(description).merge(department);
};

export const useProcessDefinitionCategoryFormSchema = () => {
	const description = useDescriptionFieldSchema(30);
	const explanation = useExplanationFieldSchema();

	return description.merge(explanation);
};

export const useProcessGeneralQuestionsFormSchema = (isRequired: boolean) => {
	const machine = useMachineFieldSchema();
	const itemsTaskCovers = useItemsTaskCoversFieldSchema();
	const batchSize = useBatchSizeFieldSchema(2000);
	const grade = useGradeFieldSchema();
	const madeInPairs = useMadeInPairsFieldSchema();
	const rest = useRestFieldSchema();
	const contingency = useContingencyFieldSchema();
	const groupAllowance = useGroupAllowanceFieldSchema();

	const opGenSchema = batchSize
		.merge(grade)
		.merge(rest)
		.merge(contingency)
		.merge(madeInPairs)
		.merge(machine)
		.merge(groupAllowance);

	if (isRequired) {
		return opGenSchema.merge(itemsTaskCovers);
	} else {
		return opGenSchema;
	}
};

export const useProcessMachiningStitchingQuestionsFormSchema = () => {
	const minimumSpeed = useMinimumSpeedFieldSchema();
	const maximumSpeed = useMaximumSpeedFieldSchema();
	const densityUnits = useDensityUnitsFieldSchema();
	const densityPerInch = useDensityPerInchFieldSchema();
	const materialProperty = useMaterialPropertyFieldSchema();
	const machineType = useMachineTypeFieldSchema();
	const needleType = useNeedleTypeFieldSchema();
	const stitchingModifier = useStitchingModifierFieldSchema();

	return minimumSpeed
		.merge(maximumSpeed)
		.merge(densityUnits)
		.merge(densityPerInch)
		.merge(materialProperty)
		.merge(machineType)
		.merge(needleType)
		.merge(stitchingModifier);
};

export const useProcessMachiningPalletStitchingQuestionsFormSchema = () => {
	const programmedSpeed = useProgrammedSpeedFieldSchema();
	const densityUnits = useDensityUnitsFieldSchema();
	const densityPerInch = useDensityPerInchFieldSchema();

	return programmedSpeed.merge(densityUnits).merge(densityPerInch);
};

export const useProcessMachiningStrobelStitchingQuestionsFormSchema = () => {
	const minimumSpeed = useMinimumSpeedFieldSchema();
	const maximumSpeed = useMaximumSpeedFieldSchema();
	const densityUnits = useDensityUnitsFieldSchema();
	const densityPerInch = useDensityPerInchFieldSchema();

	return minimumSpeed
		.merge(maximumSpeed)
		.merge(densityUnits)
		.merge(densityPerInch);
};

export const useProcessMachiningFoldingQuestionsFormSchema = () => {
	const minimumSpeed = useMinimumSpeedFieldSchema();
	const maximumSpeed = useMaximumSpeedFieldSchema();
	const densityUnits = useDensityUnitsFieldSchema();
	const densityPerInch = useDensityPerInchFieldSchema();
	const materialProperty = useMaterialPropertyFieldSchema();

	return minimumSpeed
		.merge(maximumSpeed)
		.merge(densityUnits)
		.merge(densityPerInch)
		.merge(materialProperty);
};

export const useProcessCuttingQuestionsFormSchema = () => {
	const unitsPerJob = useUnitsPerJobFieldSchema();
	const sizes = useSizesFieldSchema();
	const materialType = useMaterialTypeFieldSchema();
	const unit = useUnitFieldSchema();
	const area = useAreaFieldSchema();
	const coefficient = useCoefficientFieldSchema();
	const layers = useLayersFieldSchema();

	const width = useWidthFieldSchema();
	const length = useLengthFieldSchema();
	const cuttingType = useCuttingTypeFieldSchema();
	const cuttingMethodNatural = useCuttingMethodNaturalFieldSchema();
	const cuttingMethodSynthetic = useCuttingMethodSyntheticFieldSchema();
	const feedSystem = useFeedSystemFieldSchema();
	const depth = useDepthFieldSchema();

	// TypeScript doesn't like having lots of fields merging at once for some reason
	const part1 = unitsPerJob
		.merge(sizes)
		.merge(materialType)
		.merge(unit)
		.merge(area)
		.merge(coefficient)
		.merge(layers);

	const part2 = width
		.merge(length)
		.merge(cuttingType)
		.merge(cuttingMethodNatural)
		.merge(cuttingMethodSynthetic)
		.merge(feedSystem)
		.merge(depth);

	return part1.merge(part2);
};

export const useProcessKnivesFormSchema = () => {
	const description = useDescriptionFieldSchema(20);
	const freq = useFreqFieldSchema();
	const nettArea = useNettAreaFieldSchema();
	const pieces = usePiecesFieldSchema();
	const peels = usePeelsFieldSchema();
	const clears = useClearsFieldSchema();
	const cutsLR = useCutsLRFieldSchema();
	const thin = useThinFieldSchema();
	const bands = useBandsFieldSchema();
	const marks = useMarksFieldSchema();

	// TypeScript doesn't like having lots of fields merging at once for some reason
	const part1 = description
		.merge(freq)
		.merge(nettArea)
		.merge(pieces)
		.merge(peels)
		.merge(clears);

	const part2 = cutsLR.merge(thin).merge(bands).merge(marks);

	return part1.merge(part2);
};

export const useProcessUnmannedQuestionsFormSchema = () => {
	const wholeCycleTime = useWholeCycleTimeFieldSchema();
	const maximumUnits = useMaximumUnitsFieldSchema();
	const valueAdded = useValueAddedFieldSchema();
	const emptyBeforeShutdown = useEmptyBeforeShutdownFieldSchema();
	const emptyItself = useEmptyItselfFieldSchema();
	const lanes = useLanesFieldSchema();

	return wholeCycleTime
		.merge(maximumUnits)
		.merge(valueAdded)
		.merge(emptyBeforeShutdown)
		.merge(emptyItself)
		.merge(lanes);
};

export const useProcessAdditionalStepsFormSchema = () => {
	const step = useStepFieldSchema();
	const quantity = useQuantityFieldSchema();
	const every = useEveryFieldSchema();
	const perBatch = usePerBatchFieldSchema();

	return step.merge(quantity).merge(every).merge(perBatch);
};

export const useProcessPathFeatureFormSchema = () => {
	const pathFeature = usePathFeaturesFieldSchema();
	const pathType = usePathTypeFieldSchema();

	return pathFeature.merge(pathType);
};

export const useDesignFormSchema = (existingCodes: string[] = []) => {
	const code = useCodeFieldSchema(existingCodes);
	const description = useDescriptionFieldSchema();
	const pairsCosted = usePairsCostedFieldSchema();
	const photo = usePhotoFieldSchema();

	return code.merge(description).merge(pairsCosted).merge(photo);
};

export const useDesignDepartmentFormSchema = () => {
	const department = useDepartmentFieldSchema();
	const batchSize = useBatchSizeFieldSchema(2000);
	const pairsCosted = usePairsCostedFieldSchema();

	return department.merge(batchSize).merge(pairsCosted);
};
