import { useTranslation } from "react-i18next";
import { z } from "zod";
import { DepartmentData } from "../api.common/types";
import { PATH_TYPES } from "../constants.common/path";
import {
	VALID_CHARS_CODE,
	VALID_CHARS_NOTES,
	VALID_CHARS_STRING,
} from "../constants.common/validChars";

export const useCodeFieldSchema = (
	existingCodes: string[],
	currentCode?: string,
	maxValue: number = 20
) => {
	const { t } = useTranslation();

	const minMessage = t("codeMinErrorMessage", {
		defaultValue: "Code must contain at least 1 character",
	});

	const maxMessage = t("codeMaxErrorMessage", {
		defaultValue: `Code cannot exceed ${maxValue} characters`,
	}).replace("%%VALUE%%", maxValue.toString());

	const invalidMessage = t("codeInvalidErrorMessage", {
		defaultValue: "Code contains invalid characters",
	});

	const inUseMessage = t("codeInUseErrorMessage", {
		defaultValue: "This code is already in use",
	});

	return z.object({
		code: z
			.string()
			.min(1, minMessage)
			.max(maxValue, maxMessage)
			.regex(new RegExp(VALID_CHARS_CODE), invalidMessage)
			.refine(
				(val) =>
					!existingCodes.includes(val.toLowerCase()) ||
					val.toLowerCase() === currentCode?.toLowerCase(),
				{
					message: inUseMessage,
				}
			),
	});
};

export const useDescriptionFieldSchema = (maxValue: number = 100) => {
	const { t } = useTranslation();

	const maxMessage = t("descriptionMaxErrorMessage", {
		defaultValue: `Description cannot exceed ${maxValue} characters`,
	});

	const invalidMessage = t("descriptionInvalidErrorMessage", {
		defaultValue: "Description contains invalid characters",
	});

	return z.object({
		description: z
			.string()
			.max(maxValue, maxMessage)
			.regex(new RegExp(VALID_CHARS_STRING), invalidMessage),
	});
};

export const useReflectLevelFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("reflectLevelInvalidTypeErrorMessage", {
		defaultValue: `Reflect level must be "Yes" or "No"`,
	});

	return z.object({
		reflectLevel: z.enum(["yes", "no"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useSecsAt100FieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("secsAt100InvalidTypeErrorMessage", {
		defaultValue: "Seconds must contain a number value between 0 and 10",
	});

	const requiredMessage = t("secsAt100RequiredErrorMessage", {
		defaultValue: "Seconds must contain a value between 0 and 10",
	});

	const minMessage = t("secsAt100MinErrorMessage", {
		defaultValue: "Seconds cannot be less than 0",
	});

	const maxMessage = t("secsAt100MaxErrorMessage", {
		defaultValue: "Seconds cannot be greater than 10",
	});

	return z.object({
		secsAt100: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.nonnegative(minMessage)
			.lte(10, maxMessage),
	});
};

export const useValueAddedFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("valueAddedInvalidTypeErrorMessage", {
		defaultValue: `Value added must be "Yes" or "No"`,
	});

	return z.object({
		valueAdded: z.enum(["yes", "no"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useNotesFieldSchema = () => {
	const { t } = useTranslation();

	const maxMessage = t("notesMaxErrorMessage", {
		defaultValue: "Notes cannot exceed 500 characters",
	});

	const invalidMessage = t("notesInvalidErrorMessage", {
		defaultValue: "Notes ontains invalid characters",
	});

	return z.object({
		notes: z
			.string()
			.max(500, maxMessage)
			.regex(new RegExp(VALID_CHARS_NOTES), invalidMessage),
	});
};

export const useMinutesInDayFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("minutesInDayInvalidTypeErrorMessage", {
		defaultValue:
			"Minutes in day must contain a number value between 1 and 1440",
	});

	const requiredMessage = t("minutesInDayRequiredErrorMessage", {
		defaultValue: "Minutes in day must contain a value between 1 and 1440",
	});

	const minMessage = t("minutesInDayMinErrorMessage", {
		defaultValue: "Minutes in day cannot be less than 1",
	});

	const maxMessage = t("minutesInDayMaxErrorMessage", {
		defaultValue: "Minutes in day cannot be greater than 1440",
	});

	const wholeNumMsg = t("minutesInDayIntErrorMessage", {
		defaultValue: "Minutes in day cannot be a decimal",
	});

	return z.object({
		minutesInDay: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int(wholeNumMsg)
			.positive(minMessage)
			.lte(1440, maxMessage),
	});
};

export const useDefaultMadeInPairsFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("defaultMadeInPairsInvalidTypeErrorMessage", {
		defaultValue: `Made in pairs must be "Yes" or "No"`,
	});

	return z.object({
		defaultMadeInPairs: z.enum(["yes", "no"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useMadeInPairsFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("madeInPairsInvalidTypeErrorMessage", {
		defaultValue: `Made in pairs must be "Yes" or "No"`,
	});

	return z.object({
		madeInPairs: z.enum(["yes", "no"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useGroupAllowanceFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("groupAllowanceInvalidTypeErrorMessage", {
		defaultValue: `Group Alowance must be "Yes" or "No"`,
	});

	return z.object({
		groupAllowance: z.enum(["yes", "no"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useActionFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("actionRequiredErrorMessage", {
		defaultValue: "Please select a Action from the list",
	});

	return z.object({
		action: z.preprocess(
			(val) =>
				(val as string)?.length ? JSON.parse(val as string).Code : val,
			z
				.string({
					required_error: requiredMessage,
				})
				.min(1, requiredMessage)
		),
	});
};

export const useCommentFieldSchema = () => {
	const { t } = useTranslation();

	const maxMessage = t("commentMaxErrorMessage", {
		defaultValue: "Comment cannot exceed 100 characters",
	});

	const invalidMessage = t("commentInvalidErrorMessage", {
		defaultValue: "Comment contains invalid characters",
	});

	return z.object({
		comment: z
			.string()
			.max(100, maxMessage)
			.regex(new RegExp(VALID_CHARS_STRING), invalidMessage),
	});
};

export const useFrequencyFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("frequencyInvalidTypeErrorMessage", {
		defaultValue:
			"Frequency must contain a number value between 0 and 9999",
	});

	const requiredMessage = t("frequencyRequiredErrorMessage", {
		defaultValue: "Frequency must contain a value between 0 and 9999",
	});

	const minMessage = t("frequencyMinErrorMessage", {
		defaultValue: "Frequency cannot be less than 0",
	});

	const maxMessage = t("frequencyMaxErrorMessage", {
		defaultValue: "Frequency cannot be greater than 9999",
	});

	return z.object({
		frequency: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(9999, maxMessage),
	});
};

export const useStepFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("stepRequiredErrorMessage", {
		defaultValue: "Please select an Step from the list",
	});

	return z.object({
		step: z.preprocess(
			(val) =>
				(val as string)?.length ? JSON.parse(val as string).Code : val,
			z
				.string({
					required_error: requiredMessage,
				})
				.min(1, requiredMessage)
		),
	});
};

export const useStepsConditionsFieldSchema = () => {
	return z.object({
		stepsConditions: z.preprocess(
			(val) =>
				(val as []).filter(
					(item) =>
						Object.values(item).findIndex(
							(v) => v !== undefined
						) !== -1
				),
			z.array(
				z.object({
					code: z.string().min(1),
					isEqual: z.boolean(),
					index: z.number(),
				})
			)
		),
	});
};

export const useFreqFormulaFieldSchema = () => {
	const { t } = useTranslation();
	const defaultMessage = t("freqFormulaRequiredMessage", {
		defaultValue: `Frequency Formula input must be completed`,
	});
	return z.object({
		freqFormula: z.string().min(1, defaultMessage),
	});
};

export const useEveryFormulaFieldSchema = () => {
	const { t } = useTranslation();
	const defaultMessage = t("everyFormulaRequiredMessage", {
		defaultValue: `'Per' input must be completed`,
	});
	return z.object({
		everyFormula: z.string().min(1, defaultMessage),
	});
};

export const useExtraConditionsFieldSchema = () => {
	return z.object({
		extraConditions: z.string(),
	});
};

export const useSimoFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("simoInvalidTypeErrorMessage", {
		defaultValue: "Simultaneous must contain a number value greater than 0",
	});

	return z.object({
		simo: z
			.enum(["0", "1", "2"], {
				invalid_type_error: invalidTypeMessage,
			})
			.optional(),
	});
};

export const usePerBatchFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("perBatchInvalidTypeErrorMessage", {
		defaultValue: "Must choose either Item or Batch",
	});

	return z.object({
		perBatch: z
			.string({
				invalid_type_error: requiredMessage,
				required_error: requiredMessage,
			})
			.min(1, requiredMessage),
	});
};

export const useNameFieldSchema = (maxValue: number = 40) => {
	const { t } = useTranslation();

	const minMessage = t("nameMinErrorMessage", {
		defaultValue: "Name must contain at least 1 character",
	});

	const maxMessage = t("nameMaxErrorMessage", {
		defaultValue: `Name cannot exceed ${maxValue} characters`,
	});

	const invalidMessage = t("nameInvalidErrorMessage", {
		defaultValue: "Name contains invalid characters",
	});

	return z.object({
		name: z
			.string()
			.min(1, minMessage)
			.max(maxValue, maxMessage)
			.regex(new RegExp(VALID_CHARS_STRING), invalidMessage),
	});
};

export const useTitleFieldSchema = () => {
	const { t } = useTranslation();

	const minMessage = t("titleMinErrorMessage", {
		defaultValue: "Title must contain at least 1 character",
	});

	const maxMessage = t("titleMaxErrorMessage", {
		defaultValue: "Title cannot exceed 50 characters",
	});

	const invalidMessage = t("commentInvalidErrorMessage", {
		defaultValue: "Title contains invalid characters",
	});

	return z.object({
		title: z
			.string()
			.min(1, minMessage)
			.max(50, maxMessage)
			.regex(new RegExp(VALID_CHARS_STRING), invalidMessage),
	});
};

export const useExplanationFieldSchema = () => {
	const { t } = useTranslation();

	const maxMessage = t("explanationMaxErrorMessage", {
		defaultValue: "Explanation cannot exceed 250 characters",
	});

	const invalidMessage = t("commentInvalidErrorMessage", {
		defaultValue: "Explanation contains invalid characters",
	});

	return z.object({
		explanation: z
			.string()
			.max(250, maxMessage)
			.regex(new RegExp(VALID_CHARS_STRING), invalidMessage),
	});
};

export const useProcessDefinitionTypeFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("typeInvalidTypeErrorMessage", {
		defaultValue: `Type must be "Handling" or "Task"`,
	});

	return z.object({
		type: z.enum(["handling", "task"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useBatchSizeFieldSchema = (maxValue: number = 99) => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("batchSizeInvalidTypeErrorMessage", {
		defaultValue: `Batch size must contain a number value between 1 and ${maxValue}`,
	});

	const requiredMessage = t("batchSizeRequiredErrorMessage", {
		defaultValue: `Batch size must contain a value between 1 and ${maxValue}`,
	});

	const minMessage = t("batchSizeMinErrorMessage", {
		defaultValue: `Batch size cannot be less than 1`,
	});

	const maxMessage = t("batchSizeMaxErrorMessage", {
		defaultValue: `Batch size cannot be greater than ${maxValue}`,
	});

	return z.object({
		batchSize: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.positive(minMessage)
			.lte(maxValue, maxMessage),
	});
};

export const useDepartmentNumberFieldSchema = (
	departments: DepartmentData[],
	id?: number
) => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("departmentNumberInvalidTypeErrorMessage", {
		defaultValue:
			"Department number must contain a number value between 1 and 9999",
	});

	const requiredMessage = t("departmentNumberRequiredErrorMessage", {
		defaultValue:
			"Department number must contain a value between 1 and 9999",
	});

	const minMessage = t("departmentNumberMinErrorMessage", {
		defaultValue: "Department number cannot be less than 1",
	});

	const maxMessage = t("departmentNumberMaxErrorMessage", {
		defaultValue: "Department number cannot be greater than 9999",
	});

	const inUseMessage = t("departmentNumberInUseErrorMessage", {
		defaultValue: "Department number is already in use",
	});

	return z.object({
		departmentNumber: z

			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.positive(minMessage)
			.lte(9999, maxMessage)
			.refine(
				(val) =>
					departments.findIndex(
						(department) =>
							department.No === val && department.ID !== id
					) === -1,
				{
					message: inUseMessage,
				}
			),
	});
};

export const useRatePerMinuteFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("ratePerMinuteInvalidTypeErrorMessage", {
		defaultValue:
			"Rate per minute must contain a number value between 0 and 1000",
	});

	const requiredMessage = t("ratePerMinuteRequiredErrorMessage", {
		defaultValue: "Rate per minute must contain a value between 0 and 1000",
	});

	const minMessage = t("ratePerMinuteMinErrorMessage", {
		defaultValue: "Rate per minute cannot be less than 0",
	});

	const maxMessage = t("ratePerMinuteMaxErrorMessage", {
		defaultValue: "Rate per minute cannot be greater than 1000",
	});

	return z.object({
		ratePerMinute: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.nonnegative(minMessage)
			.lte(1000, maxMessage),
	});
};

export const useNoFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("noInvalidTypeErrorMessage", {
		defaultValue: "No must contain a number value between 0 and 99",
	});

	const requiredMessage = t("noRequiredErrorMessage", {
		defaultValue: "No must contain a value between 0 and 99",
	});

	const minMessage = t("noMinErrorMessage", {
		defaultValue: "No cannot be less than 0",
	});

	const maxMessage = t("noMaxErrorMessage", {
		defaultValue: "No cannot be greater than 99",
	});

	return z.object({
		no: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(99, maxMessage),
	});
};

export const useEffectLevelFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("effectLevelInvalidTypeErrorMessage", {
		defaultValue:
			"Effect level must contain a number value between -100 and 200",
	});

	const requiredMessage = t("effectLevelRequiredErrorMessage", {
		defaultValue: "Effect level must contain a value between -100 and 200",
	});

	const minMessage = t("effectLevelMinErrorMessage", {
		defaultValue: "Effect level cannot be less than -100",
	});

	const maxMessage = t("effectLevelMaxErrorMessage", {
		defaultValue: "Effect level cannot be greater than 200",
	});

	return z.object({
		effectLevel: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.gte(-100, minMessage)
			.lte(200, maxMessage),
	});
};

export const useModifierFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("modifierInvalidTypeErrorMessage", {
		defaultValue: "Modifier must contain a number value between 0 and 200",
	});

	const requiredMessage = t("modifierRequiredErrorMessage", {
		defaultValue: "Modifier must contain a value between 0 and 200",
	});

	const minMessage = t("modifierMinErrorMessage", {
		defaultValue: "Modifier cannot be less than 0",
	});

	const maxMessage = t("modifierMaxErrorMessage", {
		defaultValue: "Modifier cannot be greater than 200",
	});

	return z.object({
		modifier: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(200, maxMessage),
	});
};

export const useFeatureFieldSchema = () => {
	const { t } = useTranslation();

	const minMessage = t("featureMinErrorMessage", {
		defaultValue: "Feature must contain at least 1 character",
	});

	const maxMessage = t("featureMaxErrorMessage", {
		defaultValue: "Feature cannot exceed 30 characters",
	});

	const invalidMessage = t("commentInvalidErrorMessage", {
		defaultValue: "Feature contains invalid characters",
	});

	return z.object({
		feature: z
			.string()
			.min(1, minMessage)
			.max(30, maxMessage)
			.regex(new RegExp(VALID_CHARS_STRING), invalidMessage),
	});
};

export const useIsProtectedFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("isProtectedInvalidTypeErrorMessage", {
		defaultValue: `Is protected must be "Yes" or "No"`,
	});

	return z.object({
		isProtected: z.enum(["yes", "no"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useFeatureTypeFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("featureTypeInvalidTypeErrorMessage", {
		defaultValue:
			"Feature type must contain a number value between 0 and 2",
	});

	const requiredMessage = t("featureTypeRequiredErrorMessage", {
		defaultValue: "Feature type must contain a value between 0 and 2",
	});

	const minMessage = t("featureTypeMinErrorMessage", {
		defaultValue: "Feature type cannot be less than 0",
	});

	const maxMessage = t("featureTypeMaxErrorMessage", {
		defaultValue: "Feature type cannot be greater than 2",
	});

	return z.object({
		featureType: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(2, maxMessage),
	});
};

export const useStopAtFeatureFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("stopAtFeatureInvalidTypeErrorMessage", {
		defaultValue: `Stop at feature must be "Yes" or "No"`,
	});

	return z.object({
		stopAtFeature: z.enum(["yes", "no"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useInUseFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("inUseInvalidTypeErrorMessage", {
		defaultValue: `In use must be "Yes" or "No"`,
	});

	return z.object({
		inUse: z.enum(["yes", "no"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useMachiningFeedRateFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("machiningFeedRateInvalidTypeErrorMessage", {
		defaultValue: "CM/s must contain a number value between 0.00 and 10",
	});

	const requiredMessage = t("machiningFeedRateRequiredErrorMessage", {
		defaultValue: "CM/s must contain a value between 0.00 and 10",
	});

	const minMessage = t("machiningFeedRateMinErrorMessage", {
		defaultValue: "CM/s cannot be less than 0.00",
	});

	const maxMessage = t("machiningFeedRateMaxErrorMessage", {
		defaultValue: "CM/s cannot be greater than 10",
	});

	const decimalMessage = t("machiningFeedDecimalErrorMessage", {
		defaultValue: "CM/s area cannot be greater than 2 decimal places",
	});

	return z.object({
		machiningFeedRate: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.nonnegative(minMessage)
			.lte(10, maxMessage)
			.multipleOf(0.01, decimalMessage),
	});
};

export const useSpeedRatioFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("speedRatioInvalidTypeErrorMessage", {
		defaultValue: "Speed must contain a number value between 0 and 200",
	});

	const requiredMessage = t("speedRatioRequiredErrorMessage", {
		defaultValue: "Speed must contain a value between 0 and 200",
	});

	const minMessage = t("speedRatioMinErrorMessage", {
		defaultValue: "Speed cannot be less than 0",
	});

	const maxMessage = t("speedRatioMaxErrorMessage", {
		defaultValue: "Speed cannot be greater than 200",
	});

	return z.object({
		speedRatio: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(200, maxMessage),
	});
};

export const useDistanceFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("distanceInvalidTypeErrorMessage", {
		defaultValue: "Distance must contain a number value between 0 and 50",
	});

	const requiredMessage = t("distanceRequiredErrorMessage", {
		defaultValue: "Distance must contain a value between 0 and 50",
	});

	const minMessage = t("distanceMinErrorMessage", {
		defaultValue: "Distance cannot be less than 0",
	});

	const maxMessage = t("distanceMaxErrorMessage", {
		defaultValue: "Distance cannot be greater than 50",
	});

	const decimalMessage = t("distanceDecimalErrorMessage", {
		defaultValue: "Distance cannot be greater than 2 decimal places",
	});

	return z.object({
		distance: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.nonnegative(minMessage)
			.lte(50, maxMessage)
			.multipleOf(0.01, decimalMessage),
	});
};

export const useCategoryIdFieldSchema = () => {
	return z.object({
		categoryId: z.number().int(),
	});
};

export const useProcessCategoryFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("processCategoryInvalidTypeErrorMessage", {
		defaultValue: "Please select a Process Category from the list",
	});

	const requiredMessage = t("processCategoryRequiredErrorMessage", {
		defaultValue: "Please select a Process Category from the list",
	});

	return z.object({
		processCategory: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.min(1, requiredMessage),
	});
};

export const useHandlingProcessDefinitionFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t(
		"handlingProcessDefinitionRequiredErrorMessage",
		{
			defaultValue:
				"Please select a Handling Process Definition from the list",
		}
	);

	return z.object({
		handlingProcessDefinition: z
			.union([
				z.preprocess(
					(val) =>
						(val as string)?.length
							? JSON.parse(val as string).Code
							: val,
					z
						.string({
							required_error: requiredMessage,
						})
						.min(1, requiredMessage)
				),
				z.literal(""),
			])
			.optional(),
	});
};

export const useTaskProcessDefinitionFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("taskProcessDefinitionRequiredErrorMessage", {
		defaultValue: "Please select a Task Process Definition from the list",
	});

	return z.object({
		taskProcessDefinition: z
			.union([
				z.preprocess(
					(val) =>
						(val as string)?.length
							? JSON.parse(val as string).Code
							: val,
					z
						.string({
							required_error: requiredMessage,
						})
						.min(1, requiredMessage)
				),
				z.literal(""),
			])
			.optional(),
	});
};

export const useDefaultItemsCoveredFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("defaultItemsCoveredInvalidTypeErrorMessage", {
		defaultValue:
			"Items Covered must contain a number value between 0.01 and 99",
	});

	const requiredMessage = t("defaultItemsCoveredRequiredErrorMessage", {
		defaultValue: "Items Covered must contain a value between 0.01 and 99",
	});

	const minMessage = t("defaultItemsCoveredMinErrorMessage", {
		defaultValue: "Items Covered cannot be less than 0.01",
	});

	const maxMessage = t("defaultItemsCoveredMaxErrorMessage", {
		defaultValue: "Items Covered cannot be greater than 99",
	});

	return z.object({
		defaultItemsCovered: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.gte(0.01, minMessage)
			.lte(99, maxMessage),
	});
};

export const useRestFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("restInvalidTypeErrorMessage", {
		defaultValue: "Rest must contain a number value between 0.00 and 50",
	});

	const requiredMessage = t("restRequiredErrorMessage", {
		defaultValue: "Rest must contain a value between 0.00 and 50",
	});

	const minMessage = t("restMinErrorMessage", {
		defaultValue: "Rest cannot be less than 0.00",
	});

	const maxMessage = t("restMaxErrorMessage", {
		defaultValue: "Rest cannot be greater than 50",
	});

	const decimalMessage = t("restDecimalErrorMessage", {
		defaultValue: "Rest cannot be greater than 2 decimal places",
	});

	return z.object({
		rest: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.nonnegative(minMessage)
			.lte(50, maxMessage)
			.multipleOf(0.01, decimalMessage),
	});
};

export const useContingencyFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("contingencyInvalidTypeErrorMessage", {
		defaultValue:
			"Contingency must contain a number value between 0.00 and 50",
	});

	const requiredMessage = t("contingencyRequiredErrorMessage", {
		defaultValue: "Contingency must contain a value between 0.00 and 50",
	});

	const minMessage = t("contingencyMinErrorMessage", {
		defaultValue: "Contingency cannot be less than 0.00",
	});

	const maxMessage = t("contingencyMaxErrorMessage", {
		defaultValue: "Contingency cannot be greater than 50",
	});

	const decimalMessage = t("contingencyDecimalErrorMessage", {
		defaultValue: "Contingency cannot be greater than 2 decimal places",
	});

	return z.object({
		contingency: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.nonnegative(minMessage)
			.lte(50, maxMessage)
			.multipleOf(0.01, decimalMessage),
	});
};

export const useGroupMemberFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("groupMemberInvalidTypeErrorMessage", {
		defaultValue: `In Group must be "Yes" or "No"`,
	});

	return z.object({
		groupMember: z.enum(["yes", "no"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const usePathFeatureFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("pathFeatureRequiredErrorMessage", {
		defaultValue: "Please select a Path Feature from the list",
	});

	return z.object({
		pathFeature: z.preprocess(
			(val) =>
				(val as string)?.length
					? JSON.parse(val as string).Description
					: val,
			z
				.string({
					required_error: requiredMessage,
				})
				.min(1, requiredMessage)
		),
	});
};

export const useProcessClassFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("processClassRequiredErrorMessage", {
		defaultValue: "Please select a Process Class from the list",
	});

	return z.object({
		processClass: z
			.string({
				required_error: requiredMessage,
			})
			.min(1, requiredMessage),
	});
};

export const useMainDesignFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("mainDesignInvalidTypeErrorMessage", {
		defaultValue: "Style must be a number",
	});
	return z.object({
		mainDesign: z
			.number({ invalid_type_error: invalidTypeMessage })
			.int()
			.optional(),
	});
};

export const useProcessTypeFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("processTypeRequiredErrorMessage", {
		defaultValue: "Please select a Process Type from the list",
	});

	return z.object({
		processType: z.number({
			invalid_type_error: requiredMessage,
			required_error: requiredMessage,
		}),
	});
};

export const useDepartmentFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("departmentRequiredErrorMessage", {
		defaultValue: "Please select a Department from the list",
	});

	return z.object({
		department: z
			.number({
				required_error: requiredMessage,
			})
			.int()
			.min(1, requiredMessage),
	});
};

export const useMachineFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("machineRequiredErrorMessage", {
		defaultValue: "Please select a Machine from the list",
	});

	return z.object({
		machine: z
			.union([
				z
					.number({
						required_error: requiredMessage,
					})
					.int()
					.min(1, requiredMessage),
				z.literal("null"),
			])
			.nullable()
			.optional(),
	});
};

export const useGradeFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("gradeRequiredErrorMessage", {
		defaultValue: "Please select a Grade from the list",
	});

	return z.object({
		grade: z
			.number({
				required_error: requiredMessage,
			})
			.int()
			.min(1, requiredMessage),
	});
};

export const useItemsTaskCoversFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("itemsTaskCoversInvalidTypeErrorMessage", {
		defaultValue:
			"Items task covers must contain a number value between 0.01 and 99",
	});

	const requiredMessage = t("itemsTaskCoversRequiredErrorMessage", {
		defaultValue:
			"Items task covers must contain a value between 0.01 and 99",
	});

	const minMessage = t("itemsTaskCoversMinErrorMessage", {
		defaultValue: "Items task covers cannot be less than 0.01",
	});

	const maxMessage = t("itemsTaskCoversMaxErrorMessage", {
		defaultValue: "Items task covers cannot be greater than 99",
	});

	return z.object({
		itemsTaskCovers: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.gte(0.01, minMessage)
			.lte(99, maxMessage),
	});
};

export const useMinimumSpeedFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("minimumSpeedInvalidTypeErrorMessage", {
		defaultValue:
			"Minimum speed must contain a number value between 0 and 8000",
	});

	const requiredMessage = t("minimumSpeedRequiredErrorMessage", {
		defaultValue: "Minimum speed must contain a value between 0 and 8000",
	});

	const minMessage = t("minimumSpeedMinErrorMessage", {
		defaultValue: "Minimum speed cannot be less than 0",
	});

	const maxMessage = t("minimumSpeedMaxErrorMessage", {
		defaultValue: "Minimum speed cannot be greater than 8000",
	});

	return z.object({
		minimumSpeed: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(8000, maxMessage),
	});
};

export const useMaximumSpeedFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("maximumSpeedInvalidTypeErrorMessage", {
		defaultValue:
			"Maximum speed must contain a number value between 0 and 8000",
	});

	const requiredMessage = t("maximumSpeedRequiredErrorMessage", {
		defaultValue: "Maximum speed must contain a value between 0 and 8000",
	});

	const minMessage = t("maximumSpeedMinErrorMessage", {
		defaultValue: "Maximum speed cannot be less than 0",
	});

	const maxMessage = t("maximumSpeedMaxErrorMessage", {
		defaultValue: "Maximum speed cannot be greater than 8000",
	});

	return z.object({
		maximumSpeed: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(8000, maxMessage),
	});
};

export const useProgrammedSpeedFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("programmedSpeedInvalidTypeErrorMessage", {
		defaultValue:
			"Programmed speed must contain a number value between 0 and 8000",
	});

	const requiredMessage = t("programmedSpeedRequiredErrorMessage", {
		defaultValue:
			"Programmed speed must contain a value between 0 and 8000",
	});

	const minMessage = t("programmedSpeedMinErrorMessage", {
		defaultValue: "Programmed speed cannot be less than 0",
	});

	const maxMessage = t("programmedSpeedMaxErrorMessage", {
		defaultValue: "Programmed speed cannot be greater than 8000",
	});

	return z.object({
		programmedSpeed: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(8000, maxMessage),
	});
};

export const useDensityUnitsFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("densityUnitInvalidTypeErrorMessage", {
		defaultValue: "Density units must be inch or cm",
	});

	return z.object({
		densityUnits: z.enum(["inch", "cm"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useDensityPerInchFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("densityInvalidTypeErrorMessage", {
		defaultValue: "Density must contain a number value between 1 and 99",
	});

	const requiredMessage = t("densityRequiredErrorMessage", {
		defaultValue: "Density must contain a value between 1 and 99",
	});

	const minMessage = t("densityMinErrorMessage", {
		defaultValue: "Density cannot be less than 1",
	});

	const maxMessage = t("densityMaxErrorMessage", {
		defaultValue: "Density cannot be greater than 99",
	});

	return z.object({
		densityPerInch: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.positive(minMessage)
			.lte(99, maxMessage),
	});
};

export const useStitchingModifierFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("stitchingModifierRequiredErrorMessage", {
		defaultValue: "Please select a Stitching Modifier from the list",
	});

	return z.object({
		stitchingModifier: z
			.number({
				required_error: requiredMessage,
			})
			.int()
			.min(1, requiredMessage),
	});
};

export const useMaterialPropertyFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("materialPropertyInvalidTypeErrorMessage", {
		defaultValue: `Material property must be "Floppy" or "Normal"`,
	});

	return z.object({
		materialProperty: z.enum(["floppy", "normal"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useMachineTypeFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("machineTypeInvalidTypeErrorMessage", {
		defaultValue: `Machine type must be "Post" or "Flat"`,
	});

	return z.object({
		machineType: z.enum(["post", "flat"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useNeedleTypeFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("needleTypeInvalidTypeErrorMessage", {
		defaultValue: `Needle type must be "Twin" or "Single"`,
	});

	return z.object({
		needleType: z.enum(["twin", "single"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useUnitsPerJobFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("unitsPerJobInvalidTypeErrorMessage", {
		defaultValue:
			"Units per job must contain a number value between 1 and 2000",
	});

	const requiredMessage = t("unitsPerJobRequiredErrorMessage", {
		defaultValue: "Units per job must contain a value between 1 and 2000",
	});

	const minMessage = t("unitsPerJobMinErrorMessage", {
		defaultValue: "Units per job cannot be less than 1",
	});

	const maxMessage = t("unitsPerJobMaxErrorMessage", {
		defaultValue: "Units per job cannot be greater than 2000",
	});

	return z.object({
		unitsPerJob: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.positive(minMessage)
			.lte(2000, maxMessage),
	});
};

export const useSizesFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("sizesInvalidTypeErrorMessage", {
		defaultValue: "Sizes must contain a number value between 1 and 30",
	});

	const requiredMessage = t("sizesRequiredErrorMessage", {
		defaultValue: "Sizes must contain a value between 1 and 30",
	});

	const minMessage = t("sizesMinErrorMessage", {
		defaultValue: "Sizes cannot be less than 1",
	});

	const maxMessage = t("sizesMaxErrorMessage", {
		defaultValue: "Sizes cannot be greater than 30",
	});

	return z.object({
		sizes: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.positive(minMessage)
			.lte(30, maxMessage),
	});
};

export const useMaterialTypeFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("materialTypeRequiredErrorMessage", {
		defaultValue: "Please select a Material Type from the list",
	});

	return z.object({
		materialType: z
			.number({
				required_error: requiredMessage,
			})
			.int()
			.min(1, requiredMessage),
	});
};

export const useUnitFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("unitRequiredErrorMessage", {
		defaultValue: "Please select a Unit from the list",
	});

	return z.object({
		unit: z
			.number({
				required_error: requiredMessage,
			})
			.int()
			.min(1, requiredMessage),
	});
};

export const useAreaFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("areaInvalidTypeErrorMessage", {
		defaultValue: "Area must contain a number value between 0 and 3000",
	});

	const requiredMessage = t("areaRequiredErrorMessage", {
		defaultValue: "Area must contain a value between 0 and 3000",
	});

	const minMessage = t("areaMinErrorMessage", {
		defaultValue: "Area cannot be less than 0",
	});

	const maxMessage = t("areaMaxErrorMessage", {
		defaultValue: "Area cannot be greater than 3000",
	});

	return z.object({
		area: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.nonnegative(minMessage)
			.lte(3000, maxMessage),
	});
};

export const useCoefficientFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("coefficientInvalidTypeErrorMessage", {
		defaultValue:
			"Coefficient must contain a number value between 60 and 100",
	});

	const requiredMessage = t("coefficientRequiredErrorMessage", {
		defaultValue: "Coefficient must contain a value between 60 and 100",
	});

	const minMessage = t("coefficientMinErrorMessage", {
		defaultValue: "Coefficient cannot be less than 60",
	});

	const maxMessage = t("coefficientMaxErrorMessage", {
		defaultValue: "Coefficient cannot be greater than 100",
	});

	return z.object({
		coefficient: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.gte(60, minMessage)
			.lte(100, maxMessage),
	});
};

export const useLayersFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("layersInvalidTypeErrorMessage", {
		defaultValue: "Layers must contain a number value between 1 and 99",
	});

	const requiredMessage = t("layersRequiredErrorMessage", {
		defaultValue: "Layers must contain a value between 1 and 99",
	});

	const minMessage = t("layersMinErrorMessage", {
		defaultValue: "Layers cannot be less than 1",
	});

	const maxMessage = t("layersMaxErrorMessage", {
		defaultValue: "Layers cannot be greater than 99",
	});

	return z.object({
		layers: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.positive(minMessage)
			.lte(99, maxMessage),
	});
};

export const useWidthFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("widthInvalidTypeErrorMessage", {
		defaultValue: "Width must contain a number value between 0 and 300",
	});

	const requiredMessage = t("widthRequiredErrorMessage", {
		defaultValue: "Width must contain a value between 0 and 300",
	});

	const minMessage = t("widthMinErrorMessage", {
		defaultValue: "Width cannot be less than 0",
	});

	const maxMessage = t("widthMaxErrorMessage", {
		defaultValue: "Width cannot be greater than 300",
	});

	return z.object({
		width: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.nonnegative(minMessage)
			.lte(300, maxMessage),
	});
};

export const useLengthFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("lengthInvalidTypeErrorMessage", {
		defaultValue: "Length must contain a number value between 0 and 2500",
	});

	const requiredMessage = t("lengthRequiredErrorMessage", {
		defaultValue: "Length must contain a value between 0 and 2500",
	});

	const minMessage = t("lengthMinErrorMessage", {
		defaultValue: "Length cannot be less than 0",
	});

	const maxMessage = t("lengthMaxErrorMessage", {
		defaultValue: "Length cannot be greater than 2500",
	});

	return z.object({
		fabricLength: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.nonnegative(minMessage)
			.lte(2500, maxMessage),
	});
};

export const useDepthFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("depthInvalidTypeErrorMessage", {
		defaultValue: "Depth must contain a number value between 0 and 40",
	});

	const requiredMessage = t("depthRequiredErrorMessage", {
		defaultValue: "Depth must contain a value between 0 and 40",
	});

	const minMessage = t("depthMinErrorMessage", {
		defaultValue: "Depth cannot be less than 0",
	});

	const maxMessage = t("depthMaxErrorMessage", {
		defaultValue: "Depth cannot be greater than 40",
	});

	return z.object({
		depth: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.nonnegative(minMessage)
			.lte(40, maxMessage),
	});
};

export const useCuttingTypeFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("cuttingTypeRequiredErrorMessage", {
		defaultValue: "Please select a Cutting Type from the list",
	});

	return z.object({
		cuttingType: z
			.number({
				required_error: requiredMessage,
			})
			.int()
			.min(1, requiredMessage),
	});
};

export const useCuttingMethodNaturalFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("cuttingMethodNaturalRequiredErrorMessage", {
		defaultValue: "Please select a Cutting Method (Natural) from the list",
	});

	return z.object({
		cuttingMethodNatural: z
			.number({
				required_error: requiredMessage,
			})
			.int()
			.min(1, requiredMessage),
	});
};

export const useCuttingMethodSyntheticFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("cuttingMethodSyntheticRequiredErrorMessage", {
		defaultValue:
			"Please select a Cutting Method (Synthetic) from the list",
	});

	return z.object({
		cuttingMethodSynthetic: z
			.number({
				required_error: requiredMessage,
			})
			.int()
			.min(1, requiredMessage),
	});
};

export const useFeedSystemFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("feedSystemRequiredErrorMessage", {
		defaultValue: "Please select a Feed System from the list",
	});

	return z.object({
		feedSystem: z
			.number({
				required_error: requiredMessage,
			})
			.int()
			.min(1, requiredMessage),
	});
};

export const useEmptyBeforeShutdownFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("emptyBeforeShutdownInvalidTypeErrorMessage", {
		defaultValue: `Empty before shutdown must be "Yes" or "No"`,
	});

	return z.object({
		emptyBeforeShutdown: z.enum(["yes", "no"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useEmptyItselfFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("emptyItselfInvalidTypeErrorMessage", {
		defaultValue: `Empty itself must be "Yes" or "No"`,
	});

	return z.object({
		emptyItself: z.enum(["yes", "no"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useWholeCycleTimeFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("wholeCycleTimeInvalidTypeErrorMessage", {
		defaultValue:
			"Whole cycle time must contain a number value between 0.001 and 500",
	});

	const requiredMessage = t("wholeCycleTimeRequiredErrorMessage", {
		defaultValue:
			"Whole cycle time must contain a value between 0.001 and 500",
	});

	const minMessage = t("wholeCycleTimeMinErrorMessage", {
		defaultValue: "Whole cycle time cannot be less than 0.001",
	});

	const maxMessage = t("wholeCycleTimeMaxErrorMessage", {
		defaultValue: "Whole cycle time cannot be greater than 500",
	});

	const decimalMessage = t("wholeCycleTimeDecimalErrorMessage", {
		defaultValue:
			"Whole cycle time cannot be greater than 3 decimal places",
	});

	return z.object({
		wholeCycleTime: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.gte(0.001, minMessage)
			.lte(500, maxMessage)
			.multipleOf(0.001, decimalMessage),
	});
};

export const useMaximumUnitsFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("maximumUnitsInvalidTypeErrorMessage", {
		defaultValue:
			"Maximum units must contain a number value between 1 and 100",
	});

	const requiredMessage = t("maximumUnitsRequiredErrorMessage", {
		defaultValue: "Maximum units must contain a value between 1 and 100",
	});

	const minMessage = t("maximumUnitsMinErrorMessage", {
		defaultValue: "Maximum units cannot be less than 1",
	});

	const maxMessage = t("maximumUnitsMaxErrorMessage", {
		defaultValue: "Maximum units cannot be greater than 100",
	});

	return z.object({
		maximumUnits: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.positive(minMessage)
			.lte(100, maxMessage),
	});
};

export const useLanesFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("lanesInvalidTypeErrorMessage", {
		defaultValue: "Lanes must contain a number value between 1 and 3",
	});

	const requiredMessage = t("lanesRequiredErrorMessage", {
		defaultValue: "Lanes cannot be less than 1",
	});

	const minMessage = t("lanesMinErrorMessage", {
		defaultValue: "Lanes cannot be less than 1",
	});

	const maxMessage = t("lanesMaxErrorMessage", {
		defaultValue: "Lanes cannot be greater than 3",
	});

	return z.object({
		lanes: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.positive(minMessage)
			.lte(3, maxMessage),
	});
};

export const useFreqFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("freqInvalidTypeErrorMessage", {
		defaultValue: "Freq must contain a number value between 0 and 10",
	});

	const requiredMessage = t("freqRequiredErrorMessage", {
		defaultValue: "Freq must contain a value between 0 and 10",
	});

	const minMessage = t("freqMinErrorMessage", {
		defaultValue: "Freq cannot be less than 0",
	});

	const maxMessage = t("freqMaxErrorMessage", {
		defaultValue: "Freq cannot be greater than 10",
	});

	return z.object({
		freq: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(10, maxMessage),
	});
};

export const useNettAreaFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("nettAreaInvalidTypeErrorMessage", {
		defaultValue: "Nett area must contain a number value between 0 and 3",
	});

	const requiredMessage = t("nettAreaRequiredErrorMessage", {
		defaultValue: "Nett area must contain a value between 0 and 3",
	});

	const minMessage = t("nettAreaMinErrorMessage", {
		defaultValue: "Nett area cannot be less than 0",
	});

	const maxMessage = t("nettAreaMaxErrorMessage", {
		defaultValue: "Nett area cannot be greater than 3",
	});

	const decimalMessage = t("nettAreaDecimalErrorMessage", {
		defaultValue: "Nett area cannot be greater than 4 decimal places",
	});

	return z.object({
		nettArea: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.nonnegative(minMessage)
			.lte(3, maxMessage)
			.multipleOf(0.0001, decimalMessage),
	});
};

export const usePiecesFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("piecesInvalidTypeErrorMessage", {
		defaultValue: "Pieces must contain a number value between 1 and 200",
	});

	const requiredMessage = t("piecesRequiredErrorMessage", {
		defaultValue: "Pieces must contain a value between 1 and 200",
	});

	const minMessage = t("piecesMinErrorMessage", {
		defaultValue: "Pieces cannot be less than 1",
	});

	const maxMessage = t("piecesMaxErrorMessage", {
		defaultValue: "Pieces cannot be greater than 200",
	});

	return z.object({
		pieces: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.positive(minMessage)
			.lte(200, maxMessage),
	});
};

export const usePeelsFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("peelsInvalidTypeErrorMessage", {
		defaultValue: "Peels must contain a number value between 0 and 20",
	});

	const requiredMessage = t("peelsRequiredErrorMessage", {
		defaultValue: "Peels must contain a value between 0 and 20",
	});

	const minMessage = t("peelsMinErrorMessage", {
		defaultValue: "Peels cannot be less than 0",
	});

	const maxMessage = t("peelsMaxErrorMessage", {
		defaultValue: "Peels cannot be greater than 20",
	});

	return z.object({
		peels: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(20, maxMessage),
	});
};

export const useClearsFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("clearsInvalidTypeErrorMessage", {
		defaultValue: "Clears must contain a number value between 1 and 10",
	});

	const requiredMessage = t("clearsRequiredErrorMessage", {
		defaultValue: "Clears must contain a value between 1 and 10",
	});

	const minMessage = t("clearsMinErrorMessage", {
		defaultValue: "Clears cannot be less than 1",
	});

	const maxMessage = t("clearsMaxErrorMessage", {
		defaultValue: "Clears cannot be greater than 10",
	});

	return z.object({
		clears: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.positive(minMessage)
			.lte(10, maxMessage),
	});
};

export const useCutsLRFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("cutsLRInvalidTypeErrorMessage", {
		defaultValue: `Cuts LR must be "Yes" or "No"`,
	});

	return z.object({
		cutsLR: z.enum(["yes", "no"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useThinFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("thinInvalidTypeErrorMessage", {
		defaultValue: `Tool must be "Yes" or "No"`,
	});

	return z.object({
		thin: z.enum(["yes", "no"], {
			invalid_type_error: invalidTypeMessage,
		}),
	});
};

export const useBandsFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("bandsInvalidTypeErrorMessage", {
		defaultValue: "Bands must contain a number value between 0 and 10",
	});

	const requiredMessage = t("bandsRequiredErrorMessage", {
		defaultValue: "Bands must contain a value between 0 and 10",
	});

	const minMessage = t("bandsMinErrorMessage", {
		defaultValue: "Bands cannot be less than 0",
	});

	const maxMessage = t("bandsMaxErrorMessage", {
		defaultValue: "Bands cannot be greater than 10",
	});

	return z.object({
		bands: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(10, maxMessage),
	});
};

export const useMarksFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("marksInvalidTypeErrorMessage", {
		defaultValue: "Marks must contain a number value between 0 and 10",
	});

	const requiredMessage = t("marksRequiredErrorMessage", {
		defaultValue: "Marks must contain a value between 0 and 10",
	});

	const minMessage = t("marksMinErrorMessage", {
		defaultValue: "Marks cannot be less than 0",
	});

	const maxMessage = t("marksMaxErrorMessage", {
		defaultValue: "Marks cannot be greater than 10",
	});

	return z.object({
		marks: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(10, maxMessage),
	});
};

export const useQuantityFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("quantityInvalidTypeErrorMessage", {
		defaultValue:
			"Quantity must contain a number value between -500 and 500",
	});

	const requiredMessage = t("quantityRequiredErrorMessage", {
		defaultValue: "Quantity must contain a value between -500 and 500",
	});

	const minMessage = t("quantityMinErrorMessage", {
		defaultValue: "Quantity cannot be less than -500",
	});

	const maxMessage = t("quantityMaxErrorMessage", {
		defaultValue: "Quantity cannot be greater than 500",
	});

	return z.object({
		quantity: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.gte(-500, minMessage)
			.lte(500, maxMessage),
	});
};

export const useEveryFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("everyInvalidTypeErrorMessage", {
		defaultValue: "Every must contain a number value between 1 and 999",
	});

	const requiredMessage = t("everyRequiredErrorMessage", {
		defaultValue: "Every must contain a value between 1 and 999",
	});

	const minMessage = t("everyMinErrorMessage", {
		defaultValue: "Every cannot be less than 1",
	});

	const maxMessage = t("everyMaxErrorMessage", {
		defaultValue: "Every cannot be greater than 999",
	});

	return z.object({
		every: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.positive(minMessage)
			.lte(999, maxMessage),
	});
};

export const usePairsCostedFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("pairsCostedInvalidTypeErrorMessage", {
		defaultValue:
			"Pairs costed must contain a number value between 1 and 2000",
	});

	const requiredMessage = t("pairsCostedRequiredErrorMessage", {
		defaultValue: "Pairs costed must contain a value between 1 and 2000",
	});

	const minMessage = t("pairsCostedMinErrorMessage", {
		defaultValue: "Pairs costed cannot be less than 1",
	});

	const maxMessage = t("pairsCostedMaxErrorMessage", {
		defaultValue: "Pairs costed cannot be greater than 2000",
	});

	return z.object({
		pairsCosted: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.positive(minMessage)
			.lte(2000, maxMessage),
	});
};

export const useProcessFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("processRequiredErrorMessage", {
		defaultValue: "Please select a Process from the list",
	});

	return z.object({
		process: z.preprocess(
			(val) =>
				(val as string)?.length ? JSON.parse(val as string).Code : val,
			z
				.string({
					required_error: requiredMessage,
				})
				.min(1, requiredMessage)
		),
	});
};

export const useProcessSetFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("processSetRequiredErrorMessage", {
		defaultValue: "Please select a Process set from the list",
	});

	return z.object({
		processSet: z.preprocess(
			(val) =>
				(val as string)?.length ? JSON.parse(val as string).Code : val,
			z
				.string({
					required_error: requiredMessage,
				})
				.min(1, requiredMessage)
		),
	});
};

export const useMannedProcessFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("mannedOperationRequiredErrorMessage", {
		defaultValue: "Please select a Manned Process from the list",
	});

	return z.object({
		process: z.preprocess(
			(val) =>
				(val as string)?.length ? JSON.parse(val as string).Code : val,
			z
				.string({
					required_error: requiredMessage,
				})
				.min(1, requiredMessage)
		),
	});
};

export const useUnmannedProcessFieldSchema = () => {
	const { t } = useTranslation();

	const requiredMessage = t("unmannedOperationRequiredErrorMessage", {
		defaultValue: "Please select an Unmanned Process from the list",
	});

	return z.object({
		process: z.preprocess(
			(val) =>
				(val as string)?.length ? JSON.parse(val as string).Code : val,
			z
				.string({
					required_error: requiredMessage,
				})
				.min(1, requiredMessage)
		),
	});
};

export const useImageSchema = () => {
	const { t } = useTranslation();

	const MAX_FILE_SIZE = 1000000;
	const ACCEPTED_IMAGE_TYPES = [
		"image/jpeg",
		"image/jpg",
		"image/bmp",
		"image/gif",
		"image/png",
	];

	const requiredMessage = t("photoRequiredErrorMessage", {
		defaultValue: "Please select an image",
	});

	const maxSizeMessage = t("photoMaxSizeErrorMessage", {
		defaultValue: "Image must be less than 1MB",
	});

	const fileTypeMessage = t("photoFileTypeErrorMessage", {
		defaultValue: "Only JPG/JPEG, BMP, GIF and PNG files are accepted",
	});

	return z.preprocess(
		(val) => (val as FileList)?.[0],
		z
			.custom<File>((val) => val)
			.refine((file: File) => file, requiredMessage)
			.refine(
				(file: File) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
				fileTypeMessage
			)
			.refine((file: File) => file?.size <= MAX_FILE_SIZE, maxSizeMessage)
			.optional()
	);
};

export const usePhotoFieldSchema = () => {
	const imageSchema = useImageSchema();

	return z.object({
		photo: imageSchema.optional(),
	});
};

export const usePathFileSchema = () => {
	const { t } = useTranslation();

	const MAX_FILE_SIZE = 1000000;

	const requiredMessage = t("pathFileRequiredErrorMessage", {
		defaultValue: "Please select a Path File",
	});

	const maxSizeMessage = t("pathFileMaxSizeErrorMessage", {
		defaultValue: "Path File must be less than 1MB",
	});

	const fileTypeMessage = t("pathFileFileTypeErrorMessage", {
		defaultValue: "Only DIG files are accepted",
	});

	return z.preprocess(
		(val) => val as FileList,
		z
			.custom<FileList>((val) => val)
			.refine((file: FileList) => file, requiredMessage)
			.refine(
				(files: FileList) => files[0]?.name?.endsWith(".dig"),
				fileTypeMessage
			)
			.refine(
				(files: FileList) => files[0]?.size <= MAX_FILE_SIZE,
				maxSizeMessage
			)
			.optional()
	);
};

export const usePathFileFieldSchema = () => {
	const pathFileSchema = usePathFileSchema();

	return z.object({
		pathFile: pathFileSchema,
	});
};

export const usePathFeaturesFieldSchema = () => {
	return z.object({
		pathFeature: z.preprocess(
			(val) => (val as []).filter((item) => typeof item === "number"),
			z.array(z.union([z.number(), z.literal("")]))
		),
	});
};

export const usePathTypeFieldSchema = () => {
	return z.object({
		pathType: z.enum(PATH_TYPES),
	});
};

export const useMinimumSpeedMinimumFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("minimumSpeedInvalidTypeErrorMessage", {
		defaultValue:
			"Minimum speed must contain a number value between 0 and 8000",
	});

	const requiredMessage = t("minimumSpeedRequiredErrorMessage", {
		defaultValue: "Minimum speed must contain a value between 0 and 8000",
	});

	const minMessage = t("minimumSpeedMinErrorMessage", {
		defaultValue: "Minimum speed cannot be less than 0",
	});

	const maxMessage = t("minimumSpeedMaxErrorMessage", {
		defaultValue: "Minimum speed cannot be greater than 8000",
	});

	return z.object({
		minimumSpeed_Min: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(8000, maxMessage),
	});
};

export const useMinimumSpeedMaximumFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("minimumSpeedInvalidTypeErrorMessage", {
		defaultValue:
			"Minimum speed must contain a number value between 0 and 8000",
	});

	const requiredMessage = t("minimumSpeedRequiredErrorMessage", {
		defaultValue: "Minimum speed must contain a value between 0 and 8000",
	});

	const minMessage = t("minimumSpeedMinErrorMessage", {
		defaultValue: "Minimum speed cannot be less than 0",
	});

	const maxMessage = t("minimumSpeedMaxErrorMessage", {
		defaultValue: "Minimum speed cannot be greater than 8000",
	});

	return z.object({
		minimumSpeed_Max: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(8000, maxMessage),
	});
};

export const useMaximumSpeedMinimumFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("maximumSpeedInvalidTypeErrorMessage", {
		defaultValue:
			"Maximum speed must contain a number value between 0 and 8000",
	});

	const requiredMessage = t("maximumSpeedRequiredErrorMessage", {
		defaultValue: "Maximum speed must contain a value between 0 and 8000",
	});

	const minMessage = t("maximumSpeedMinErrorMessage", {
		defaultValue: "Maximum speed cannot be less than 0",
	});

	const maxMessage = t("maximumSpeedMaxErrorMessage", {
		defaultValue: "Maximum speed cannot be greater than 8000",
	});

	return z.object({
		maximumSpeed_Min: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(8000, maxMessage),
	});
};

export const useMaximumSpeedMaximumFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("maximumSpeedInvalidTypeErrorMessage", {
		defaultValue:
			"Maximum speed must contain a number value between 0 and 8000",
	});

	const requiredMessage = t("maximumSpeedRequiredErrorMessage", {
		defaultValue: "Maximum speed must contain a value between 0 and 8000",
	});

	const minMessage = t("maximumSpeedMinErrorMessage", {
		defaultValue: "Maximum speed cannot be less than 0",
	});

	const maxMessage = t("maximumSpeedMaxErrorMessage", {
		defaultValue: "Maximum speed cannot be greater than 8000",
	});

	return z.object({
		maximumSpeed_Max: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(8000, maxMessage),
	});
};

export const usePalletProgrammedMinimumSpeedFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("minimumSpeedInvalidTypeErrorMessage", {
		defaultValue:
			"Minimum speed must contain a number value between 0 and 8000",
	});

	const requiredMessage = t("minimumSpeedRequiredErrorMessage", {
		defaultValue: "Minimum speed must contain a value between 0 and 8000",
	});

	const minMessage = t("minimumSpeedMinErrorMessage", {
		defaultValue: "Minimum speed cannot be less than 0",
	});

	const maxMessage = t("minimumSpeedMaxErrorMessage", {
		defaultValue: "Minimum speed cannot be greater than 8000",
	});

	return z.object({
		pallet_ProgrammedSpeed_Min: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(8000, maxMessage),
	});
};

export const usePalletProgrammedMaximumSpeedFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("maximumSpeedInvalidTypeErrorMessage", {
		defaultValue:
			"Maximum speed must contain a number value between 0 and 8000",
	});

	const requiredMessage = t("maximumSpeedRequiredErrorMessage", {
		defaultValue: "Maximum speed must contain a value between 0 and 8000",
	});

	const minMessage = t("maximumSpeedMinErrorMessage", {
		defaultValue: "Maximum speed cannot be less than 0",
	});

	const maxMessage = t("maximumSpeedMaxErrorMessage", {
		defaultValue: "Maximum speed cannot be greater than 8000",
	});

	return z.object({
		pallet_ProgrammedSpeed_Max: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.nonnegative(minMessage)
			.lte(8000, maxMessage),
	});
};

export const useDensityPerInchMinimumFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("densityPerInchInvalidTypeErrorMessage", {
		defaultValue:
			"Density per inch must contain a number value between 0.01 and 99",
	});

	const requiredMessage = t("densityPerInchRequiredErrorMessage", {
		defaultValue:
			"Density per inch must contain a value between 0.01 and 99",
	});

	const minMessage = t("densityPerInchMinErrorMessage", {
		defaultValue: "Density per inch cannot be less than 0.01",
	});

	const maxMessage = t("densityPerInchMaxErrorMessage", {
		defaultValue: "Density per inch cannot be greater than 99",
	});

	const decimalMessage = t("densityPerInchDecimalErrorMessage", {
		defaultValue:
			"Density per inch cannot be greater than 2 decimal places",
	});

	return z.object({
		density_Min: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.positive(minMessage)
			.lte(99, maxMessage)
			.multipleOf(0.01, decimalMessage),
	});
};

export const useDensityPerInchMaximumFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("densityPerInchInvalidTypeErrorMessage", {
		defaultValue:
			"Density per inch must contain a number value between 0.01 and 99",
	});

	const requiredMessage = t("densityPerInchRequiredErrorMessage", {
		defaultValue:
			"Density per inch must contain a value between 0.01 and 99",
	});

	const minMessage = t("densityPerInchMinErrorMessage", {
		defaultValue: "Density per inch cannot be less than 0.01",
	});

	const maxMessage = t("densityPerInchMaxErrorMessage", {
		defaultValue: "Density per inch cannot be greater than 99",
	});

	const decimalMessage = t("densityPerInchDecimalErrorMessage", {
		defaultValue:
			"Density per inch cannot be greater than 2 decimal places",
	});

	return z.object({
		density_Max: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.positive(minMessage)
			.lte(99, maxMessage)
			.multipleOf(0.01, decimalMessage),
	});
};

export const useDensityPerInchDefaultFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("densityPerInchInvalidTypeErrorMessage", {
		defaultValue:
			"Density per inch default must contain a number value between 0.01 and 99",
	});

	const requiredMessage = t("densityPerInchRequiredErrorMessage", {
		defaultValue:
			"Density per inch default must contain a value between 0.01 and 99",
	});
	const decimalMessage = t("densityPerInchDecimalErrorMessage", {
		defaultValue:
			"Density per inch default cannot be greater than 2 decimal places",
	});

	return z.object({
		density_Default: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.multipleOf(0.01, decimalMessage),
	});
};

export const useDensityPerInchDpsFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("densityPerInchDpsInvalidTypeErrorMessage", {
		defaultValue:
			"Decimal places must contain a number value between 0 and 3",
	});

	const requiredMessage = t("densityPerInchDpsRequiredErrorMessage", {
		defaultValue: "Decimal places must contain a value between 0 and 3",
	});

	const minMessage = t("densityPerInchDpsMinErrorMessage", {
		defaultValue: "Decimal places cannot be less than 0",
	});

	const maxMessage = t("densityPerInchDpsMaxErrorMessage", {
		defaultValue: "Decimal places cannot be greater than 3",
	});

	return z.object({
		density_dps: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.nonnegative(minMessage)
			.lte(3, maxMessage),
	});
};

export const usePalletDensityPerInchMinimumFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("densityPerInchInvalidTypeErrorMessage", {
		defaultValue:
			"Density per inch must contain a number value between 0.01 and 99",
	});

	const requiredMessage = t("densityPerInchRequiredErrorMessage", {
		defaultValue: "Density must contain a value between 0.01 and 99",
	});

	const minMessage = t("densityPerInchMinErrorMessage", {
		defaultValue: "Density cannot be less than 0.01",
	});

	const maxMessage = t("densityPerInchMaxErrorMessage", {
		defaultValue: "Density cannot be greater than 99",
	});

	return z.object({
		pallet_Density_Min: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.positive(minMessage)
			.lte(99, maxMessage),
	});
};

export const usePalletDensityPerInchMaximumFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("densityInvalidTypeErrorMessage", {
		defaultValue: "Density must contain a number value between 0.01 and 99",
	});

	const requiredMessage = t("densityRequiredErrorMessage", {
		defaultValue: "Density must contain a value between 0.01 and 99",
	});

	const minMessage = t("densityMinErrorMessage", {
		defaultValue: "Density cannot be less than 0.01",
	});

	const maxMessage = t("densityMaxErrorMessage", {
		defaultValue: "Density cannot be greater than 99",
	});

	const decimalMessage = t("densityDecimalErrorMessage", {
		defaultValue: "Density cannot be greater than 2 decimal places",
	});

	return z.object({
		pallet_Density_Max: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.positive(minMessage)
			.lte(99, maxMessage)
			.multipleOf(0.01, decimalMessage),
	});
};

export const usePalletDensityPerInchDefaultFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("densityDefaultInvalidTypeErrorMessage", {
		defaultValue:
			"Density default must contain a number value between 0.01 and 99",
	});

	const requiredMessage = t("densityDefaultRequiredErrorMessage", {
		defaultValue:
			"Density default must contain a value between 0.01 and 99",
	});

	const decimalMessage = t("densityDefaultDecimalErrorMessage", {
		defaultValue: "Density default cannot be greater than 2 decimal places",
	});

	return z.object({
		pallet_Density_Default: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.multipleOf(0.01, decimalMessage),
	});
};

export const usePalletDensityPerInchDpsFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("densityPerInchDpsInvalidTypeErrorMessage", {
		defaultValue:
			"Decimal places must contain a number value between 0 and 3",
	});

	const requiredMessage = t("densityPerInchDpsRequiredErrorMessage", {
		defaultValue: "Decimal places must contain a value between 0 and 3",
	});

	const minMessage = t("densityPerInchDpsMinErrorMessage", {
		defaultValue: "Decimal places cannot be less than 0",
	});

	const maxMessage = t("densityPerInchDpsMaxErrorMessage", {
		defaultValue: "Decimal places cannot be greater than 3",
	});

	return z.object({
		pallet_Density_dps: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.nonnegative(minMessage)
			.lte(3, maxMessage),
	});
};

export const useMaterialPropertyFloppyNotNormalFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t(
		"materialPropertyFloppyNotNormalInvalidTypeErrorMessage",
		{
			defaultValue:
				"Material property floppy not normal must contain a number value between -100 and 0",
		}
	);

	const requiredMessage = t(
		"materialPropertyFloppyNotNormalRequiredErrorMessage",
		{
			defaultValue:
				"Material property floppy not normal must contain a value between -100 and 0",
		}
	);

	const minMessage = t("materialPropertyFloppyNotNormalMinErrorMessage", {
		defaultValue:
			"Material property floppy not normal cannot be less than -100",
	});

	const maxMessage = t("materialPropertyFloppyNotNormalMaxErrorMessage", {
		defaultValue:
			"Material property floppy not normal cannot be greater than 0",
	});

	return z.object({
		materialPropertyFloppy: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.gte(-100, minMessage)
			.nonpositive(maxMessage),
	});
};

export const useMachineTypePostNotFlatFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t(
		"machineTypePostNotFlatInvalidTypeErrorMessage",
		{
			defaultValue:
				"Machine type post not flat must contain a number value between -100 and 0",
		}
	);

	const requiredMessage = t("machineTypePostNotFlatRequiredErrorMessage", {
		defaultValue:
			"Machine type post not flat must contain a value between -100 and 0",
	});

	const minMessage = t("machineTypePostNotFlatMinErrorMessage", {
		defaultValue: "Machine type post not flat cannot be less than -100",
	});

	const maxMessage = t("machineTypePostNotFlatMaxErrorMessage", {
		defaultValue: "Machine type post not flat cannot be greater than 0",
	});

	return z.object({
		machineTypePost: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.gte(-100, minMessage)
			.nonpositive(maxMessage),
	});
};

export const useNeedleTypeTwinNotSingleFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t(
		"needleTypeTwinNotSingleInvalidTypeErrorMessage",
		{
			defaultValue:
				"Machine type post not flat must contain a number value between -100 and 0",
		}
	);

	const requiredMessage = t("needleTypeTwinNotSingleRequiredErrorMessage", {
		defaultValue:
			"Machine type post not flat must contain a value between -100 and 0",
	});

	const minMessage = t("needleTypeTwinNotSingleMinErrorMessage", {
		defaultValue: "Machine type post not flat cannot be less than -100",
	});

	const maxMessage = t("needleTypeTwinNotSingleMaxErrorMessage", {
		defaultValue: "Machine type post not flat cannot be greater than 0",
	});

	return z.object({
		needleTypeTwin: z
			.number({
				invalid_type_error: invalidTypeMessage,
				required_error: requiredMessage,
			})
			.int()
			.gte(-100, minMessage)
			.nonpositive(maxMessage),
	});
};

export const usePathSimoFieldSchema = () => {
	const { t } = useTranslation();

	const invalidTypeMessage = t("pathSimoInvalidTypeErrorMessage", {
		defaultValue: "Path simo must be set to a value of 1 or 2",
	});

	const requiredMessage = t("pathSimoRequiredErrorMessage", {
		defaultValue: "Path simo must be set to a value of 1 or 2",
	});

	const minMessage = t("pathSimoMinErrorMessage", {
		defaultValue: "Path simo must be set to a value of 1 or 2",
	});

	const maxMessage = t("pathSimoMaxErrorMessage", {
		defaultValue: "Path simo must be set to a value of 1 or 2",
	});

	return z.object({
		pathSimo: z
			.union([
				z
					.number({
						invalid_type_error: invalidTypeMessage,
						required_error: requiredMessage,
					})
					.int()
					.gte(1, minMessage)
					.lte(2, maxMessage),
				z.nan(),
			])
			.optional(),
	});
};
