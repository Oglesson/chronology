import { ApprovalStatusEnum } from "../components/common/status/approval/ApprovalStatus";
import { PATH_TYPES } from "../constants.common/path";
import { RADII } from "../constants.common/radii";

export type AssignedItemData = {
	hasNotification?: boolean;
	status?: ApprovalStatusEnum;
	timeRemaining: string;
	title: string;
	version: string;
};

export type ResponseData = {
	code?: number | string;
	message?: string;
	type?: "success" | "error";
	responseMessage?: ResponseMessage;
};

export type ResponseMessage = {
	Reason?: string;
	Detail?: string;
	Type?: "etError" | "etWarning" | "etInfo";
	Info?: string;
	message?: string;
};

// * API response Types

export type ActionData = OccasionsUsedData &
	WhereUsedData & {
		readonly ID?: number;
		Code: string;
		Description: string;
		SecsAt100: number;
		readonly System?: boolean;
		ReflectLevel: boolean;
	};

export type CopyData = {
	readonly ID?: number;
	Code: string;
};

type CuttingCategoryType = "S" | "M" | "C" | "P" | "A";

export type StepData = OccasionsUsedData &
	WhereUsedData & {
		readonly ID?: number;
		Code: string;
		Description: string;
		readonly Machining?: boolean;
		readonly MachiningFeedRate?: number;
		readonly Cutting?: boolean;
		readonly CuttingCategory?: CuttingCategoryType;
		Notes?: string;
		ValueAdded?: boolean;
		Actions?: StepActionData[];
		readonly Time_Seconds?: number;
		readonly Time_Minutes?: number;
		Level?: number;
		UpdateMap?: {
			Header: boolean;
			Actions: boolean;
		};
		readonly DominantLeftHand?: boolean[];
	};

export type StepActionData = StepLeftHandActionData &
	StepRightHandActionData &
	StepMainActionData;

export type StepMainActionData = {
	ID?: number;
	Seq?: number;
	SimoLinkPrev: boolean;
};

export type StepLeftHandActionData = {
	LHActionID?: number | null;
	_LHAction?: ActionData | null;
	LHComment?: string | null;
	LHQuantity?: number | null;
	LHTime_Seconds?: number | null;
	LHTime_Minutes?: number | null;
};

export type StepRightHandActionData = {
	RHActionID?: number | null;
	_RHAction?: ActionData | null;
	RHComment?: string | null;
	RHQuantity?: number | null;
	RHTime_Seconds?: number | null;
	RHTime_Minutes?: number | null;
};

export type OccasionsUsedData = {
	OccasionsUsed?: number;
	IsInUse?: boolean;
	IsInUseByOp?: boolean;
};
export type WhereUsedData = {
	WhereUsed?: WhereUsedItemData[];
};

export type WhereUsedItemData = {
	readonly ID: number;
	readonly Code: string;
	readonly Description?: string;
};

export type ProcessDefinitionData = OccasionsUsedData & {
	UpdateMap?: {
		Header: boolean;
		Questions: boolean;
		Steps: boolean;
		Pathtypes: boolean;
		PathfeaturesSteps: boolean;
	};
	readonly ID?: number;
	Code: string;
	Notes?: string;
	Handling: boolean;
	InnerIndex?: number;
	PathSimo?: number;
	Method0Description?: string;
	Method1Description?: string;
	Method2Description?: string;
	Method3Description?: string;
	Method4Description?: string;
	Method5Description?: string;
	Questions?: ProcessDefinitionQuestionData[];
	Steps?: ProcessDefinitionStepData[];
	Pathtypes?: ProcessDefinitionPathTypeData[];
	PathfeaturesSteps?: ProcessDefinitionPathFeaturesStepData[];
	// * Custom property not read from the API
	QuestionGroups?: ProcessDefinitionQuestionGroup[];
};

export type ProcessDefinitionPathTypeData = {
	readonly ID?: number;
	ProcessDefinitionID?: number;
	Seq: number;
	Name: string;
	PathtypesSteps: ProcessDefinitionPathTypeStep[];
};

export type ProcessDefinitionPathTypeStep = {
	readonly ID?: number;
	ProcessDefinitionPathtypeID?: number;
	Radius: (typeof RADII)[number];
	StepID?: number;
	_Step?: StepData;
};

export type ProcessDefinitionStepData = {
	readonly ID?: number;
	ProcessDefinitionID?: number;
	OutputIndex?: number;
	StepID?: number;
	_Step: StepData;
	FreqFormula?: string;
	EveryFormula?: string;
	PerBatch: boolean;
	ExtraConditions?: string;
	Simo: number | null;
	StepsConditions?: {
		ProcessDefinitionStepID?: number;
		Code: string;
		CodeValueIndex: number;
		IsEqual: boolean;
	}[];
};

export type ProcessDefinitionPathFeaturesStepData = {
	readonly ID?: number;
	ProcessDefinitionID?: number;
	OutputIndex?: number;
	FeatureID?: number;
	_Feature: PathFeatureData;
	StepID?: number;
	_Step: StepData;
	FreqFormula?: string;
	EveryFormula?: string;
	ExtraConditions?: string;
	Simo: number | null;
	PathfeaturesStepsConditions?: {
		ProcessDefinitionPathfeatureStepID?: number;
		Code: string;
		CodeValueIndex: number;
		IsEqual: boolean;
	}[];
};

export type ProcessDefinitionQuestionData = {
	QuestionColumnID: number;
	Code: string;
	Description: string;
	Explanation: string;
	DefaultIndexIfChoice: number | null;
	IsNumbersQuestion: boolean;
	QuestionsNumbers: {
		MinValue: number;
		MaxValue: number;
		DefaultValue: number;
		Dps: number;
	} | null;
	QuestionsChoices: QuestionChoice[] | null;
	_QuestionColumn: {
		ID: number;
		Seq: number;
		Description: string;
		Explanation: string;
		Pathmarker: boolean;
		PathAlternative: boolean;
	};
};

type QuestionChoice = {
	ChoiceIndex: number;
	ChoiceValue: string;
};

export type ProcessDefinitionQuestionGroup = {
	QuestionColumnID?: number;
	QuestionColumnDescription?: string;
	Questions?: ProcessDefinitionQuestionData[];
};

export type ProcessDefinitionTaskFormulaCodeData = {
	Code: string;
	Description: string;
};

export type ProcessClassData = OccasionsUsedData & {
	readonly ID?: number;
	Description: string;
};

export type ProcessTypeData = OccasionsUsedData & {
	readonly ID?: number;
	Description: string;
	ClassID: number;
	_Class?: ProcessClassData;
	CategoryID: number;
	_Category?: ProcessCategoryData;
	HandlingDefinitionID: number;
	_HandlingDefinition?: ProcessDefinitionData;
	TaskDefinitionID: number;
	_TaskDefinition?: ProcessDefinitionData;
	DefaultItemsCovered: number;
	Rest: number;
	Contingency: number;
	GroupMember: boolean;
};

export type ProcessCategoryData = {
	readonly ID: number;
	readonly No: number;
	readonly Description: string;
	readonly Kind: ProcessCategoryKind;
};

export type ProcessCategoryKind =
	| "ocRegular"
	| "ocStitching"
	| "ocFolding"
	| "ocPalletStitching"
	| "ocCutting"
	| "ocGroup"
	| "ocStrobelStitching"
	| "ocUnmanned";

export type ProcessCreationStatus =
	| "ocsSkeleton"
	| "ocsIntermediate"
	| "ocsImported"
	| "ocsReadyToComplete"
	| "ocsComplete";

export type MachiningStepSettingData = {
	readonly ID: number;
	Code: string;
	Description: string;
	MachiningFeedRate: number;
};

export type CuttingStepSettingData = {
	readonly ID: number;
	StepNo: number;
	Reason: string;
	StepID: number;
	_Step: StepData;
	InUse: boolean;
};

export type GeneralSettingsData = {
	readonly ID?: number;
	LevelOn75To100: number;
	DefaultMadeInPairs: boolean;
	_DefaultGrade?: GradeData;
	DefaultGradeID?: number;
	MinutesInDay: number;
};

export type DepartmentData = OccasionsUsedData & {
	readonly ID?: number;
	No: number;
	Description: string;
	BatchSize: number;
};

export type GradeData = OccasionsUsedData & {
	readonly ID?: number;
	Code: string;
	Rate: number;
};

export type MachineData = OccasionsUsedData & {
	readonly ID?: number;
	Code: string;
	Description: string;
	_Department?: DepartmentData;
	DepartmentID?: number;
};

export type MachiningAmendmentData = {
	readonly ID: number;
	No: number;
	Description: string;
	SpeedRatio: number;
	Distance: number;
};

export type PathFeatureData = OccasionsUsedData & {
	readonly ID?: number;
	Description: string;
	System?: boolean;
};

export type StitchingModifierData = OccasionsUsedData & {
	readonly ID?: number;
	No: number;
	Description: string;
	Modifier: number;
	EffectLevel: number;
};

export type StitchingCharacteristicsData = {
	readonly ID: number;
	MaterialPropertyFloppy: number;
	MachineTypePost: number;
	NeedleTypeTwin: number;
};

export type ProcessDefinitionsDefaultCuttingData = {
	readonly ID: number;
	UnitsPerJob: number;
	Sizes: number;
	MaterialtypeID: number;
	_Materialtype?: MaterialTypeData;
	UnitsID: number;
	_Units?: UnitData;
	Area: number;
	Coefficient: number;
	Layers: number;
	Width: number;
	Length: number;
	CuttingtypeID: number;
	_Cuttingtype?: CuttingTypeData;
	CuttingmethodnaturalID: number;
	_Cuttingmethodnatural?: CuttingMethodData;
	CuttingmethodsyntheticID: number;
	_Cuttingmethodsynthetic?: CuttingMethodData;
	FeedsystemID: number;
	_Feedsystem?: FeedSystemData;
	Depth: number;
};

export type ProcessDefinitionsMachiningData = {
	readonly ID: number;
	MinimumSpeed_Min: number;
	MinimumSpeed_Max: number;
	MinimumSpeed_Default: number;
	MaximumSpeed_Min: number;
	MaximumSpeed_Max: number;
	MaximumSpeed_Default: number;
	Density_Min: number;
	Density_Max: number;
	Density_Default: number;
	Density_dps: number;
	Pallet_ProgrammedSpeed_Min: number;
	Pallet_ProgrammedSpeed_Max: number;
	Pallet_ProgrammedSpeed_Default: number;
	Pallet_Density_Min: number;
	Pallet_Density_Max: number;
	Pallet_Density_Default: number;
	Pallet_Density_dps: number;
	MaterialPropertyFloppy: boolean;
	MachineTypePost: boolean;
	NeedleTypeTwin: boolean;
	StitchingmodifierID?: number;
	_Stitchingmodifier?: StitchingModifierData;
};

export type ProcessDefinitionsCategoryData = {
	readonly ID?: number;
	Seq: number;
	Description: string;
	Explanation: string;
	ColumnType: "ctHandling" | "ctTask" | "ctPath" | "ctTaskAlternativeToPath";
};

export type CuttingMethodData = {
	readonly ID: number;
	Seq: number;
	Code: string;
	Description: string;
};

export type CuttingTypeData = {
	readonly ID: number;
	Seq: number;
	Code: string;
	Description: string;
};

export type FeedSystemData = {
	readonly ID: number;
	Seq: number;
	Code: string;
	Description: string;
};

export type MaterialTypeData = {
	readonly ID: number;
	Seq: number;
	Code: string;
	Description: string;
};

export type UnitData = {
	readonly ID: number;
	Seq: number;
	Code: string;
	Description: string;
};

export type MachiningRateData = {
	DistancePerSecond_cms: number;
	DistancePerSecond_inches: number;
	Speed_StitchesPerMinute: number;
};

export type ProcessKnivesData = {
	readonly ID?: number;
	readonly Seq?: number;
	Description: string;
	Freq: number;
	NettArea: number;
	Pieces: number;
	Peels: number;
	Clears: number;
	CutsLR: boolean;
	Thin: boolean;
	Bands: number;
	Marks: number;
};

export type ProcessUnmannedData = {
	WholeCycleTime: number;
	MaximumUnits: number;
	ValueAdded: boolean;
	EmptyBeforeShutdown: boolean;
	EmptyItself: boolean;
	Lanes: number;
};

export type AdditionalStepData = {
	readonly ID?: number;
	readonly Seq?: number;
	StepID: number;
	_Step?: StepData;
	Quantity: number;
	Every: number;
	PerBatch: boolean;
};

export type ProcessSetData = {
	UpdateMap?: {
		Header: boolean;
		Processes: boolean;
	};
	readonly ID?: number;
	DepartmentID: number;
	_Department?: DepartmentData;
	Code: string;
	Description: string;
	Processes?: ProcessSetProcessData[];
};
export type ProcessSetProcessData = {
	readonly ID?: number;
	Seq?: number;
	ProcessID: number;
	_Operation?: ProcessData;
};

export type GroupProcessData = {
	readonly ID?: number;
	Seq?: number;
	Group_OperationID?: number;
	_GroupOperation?: ProcessData;
};

export type PathTypes = (typeof PATH_TYPES)[number];

export type PointTypes = "ptNormal" | "ptCorner" | "ptNewPath";

export type PathFileContentData = {
	Paths: {
		Success: boolean;
		LengthMM: number;
		Points: {
			X: number;
			Y: number;
			PointType: PointTypes;
			RawPoint: boolean;
			PathType: PathTypes;
			Features: {
				readonly ID?: number;
				Code: string;
				Description: string;
			}[];
		}[];
	}[];
};

export type FileData = {
	readonly FileName: string;
};

export type FeatureData = {
	readonly Seq?: number;
	FeatureID: number;
	_Feature?: {
		readonly ID?: number;
		Code: string;
		Description: string;
		FeatureType: number;
		StopAtFeature: boolean;
		System: boolean;
	};
};

export type PointData = {
	readonly ID?: number;
	readonly Seq?: number;
	X: number;
	Y: number;
	PointType: PointTypes;
	RawPoint: boolean;
	PathType: PathTypes;
	Features: FeatureData[];
};

export type ProcessWhereUsedForDesignItemData = {
	readonly ID: number;
	readonly DesignID: number;
	readonly DesignCode: string;
	readonly DesignDescription: string;
	readonly DepartmentID: number;
	readonly DepartmentNo: number;
	readonly DepartmentDescription: string;
};

export interface ProcessQueryFilters {
	deptID?: number;
	classID?: number;
	typeID?: number;
	concise?: boolean;
}

export type CuttingQType = {
	Header?: boolean;
	Knives?: boolean;
};

export type OpUpdateMap = {
	Header?: boolean;
	QuestionsAnswers?: boolean;
	Points?: boolean;
	Machining_Stitching?: boolean;
	Machining_Pallet_Stitching?: boolean;
	Machining_Strobel_Stitching?: boolean;
	Machining_Folding?: boolean;
	Cutting?: CuttingQType;
	AdditionalSteps?: boolean;
	Unmanned?: boolean;
	Group?: boolean;
};

export type ProcessData = OccasionsUsedData & {
	readonly ID?: number;
	UpdateMap: OpUpdateMap;
	CategoryKind?: ProcessCategoryKind;
	TypeID: number;
	_Type?: ProcessTypeData;
	_Type_Description: string;
	_Type_Class_Description: string;
	_Department_Description: string;
	_Type_Category: ProcessCategoryKind;
	Code: string;
	Description: string;
	CreationStatus?: ProcessCreationStatus;
	DesignID?: number | null;
	DepartmentID: number;
	_Department?: DepartmentData;
	GradeID?: number;
	_Grade?: GradeData;
	BatchSize?: number;
	ItemsCovered?: number;
	Rest?: number;
	Contingency?: number;
	UseVGRestCont?: boolean;
	Notes?: string;
	PathLength?: number;
	PathReference?: string;
	PhotoURL?: string;
	MadeInPairs?: boolean;
	MachineID?: number;
	_Machine?: MachineData;
	Frozen: boolean;
	QuestionsAnswers?: QuestionAnswerData[];
	Points?: PointData[];
	AdditionalSteps?: AdditionalStepData[];

	Steps?: {
		ID: number;
		Seq: number;
		StepID: number;
		_Step: StepData;
		Simo: number;
		Quantity: number;
		Every: number;
		PerBatch: boolean;
		MachiningamendmentID: number;
		_Machiningamendment: MachiningAmendmentData;
		PerBatchFreq: number;
		Basic_Seconds: number;
		Basic_Minutes: number;
		MachiningRate: MachiningRateData;
		SecsPerUnit: number;
	}[];
	Machining_Stitching?: {
		MinimumSpeed: number;
		MaximumSpeed: number;
		DensityPerInch: number;
		DensityDisplayInches: boolean;
		_DensityPerCm: number;
		MaterialPropertyFloppy: boolean;
		MachineTypePost: boolean;
		NeedleTypeTwin: boolean;
		StitchingmodifierID: number;
		_Stitchingmodifier: StitchingModifierData;
	};
	Machining_Pallet_Stitching?: {
		ProgrammedSpeed: number;
		DensityPerInch: number;
		DensityDisplayInches: boolean;
		_DensityPerCm: number;
	};
	Machining_Strobel_Stitching?: {
		MinimumSpeed: number;
		MaximumSpeed: number;
		DensityPerInch: number;
		DensityDisplayInches: boolean;
		_DensityPerCm: number;
	};
	Machining_Folding?: {
		MinimumSpeed: number;
		MaximumSpeed: number;
		DensityPerInch: number;
		DensityDisplayInches: boolean;
		_DensityPerCm: number;
		MaterialPropertyFloppy: boolean;
	};
	Cutting?: {
		ProcessID: number;
		UnitsPerJob: number;
		Sizes: number;
		MaterialtypeID: number;
		_Materialtype: MaterialTypeData;
		UnitsID: number;
		_Units: UnitData;
		Area: number;
		Coefficient: number;
		Layers: number;
		Width: number;
		Length: number;
		CuttingtypeID: number;
		_Cuttingtype: CuttingTypeData;
		CuttingMethodNaturalID: number;
		_CuttingMethodNatural: CuttingMethodData;
		CuttingMethodSyntheticID: number;
		_CuttingMethodSynthetic: CuttingMethodData;
		FeedsystemID: number;
		_Feedsystem: FeedSystemData;
		Depth: number;
		Knives: ProcessKnivesData[];
	};
	Unmanned?: ProcessUnmannedData;
	Group?: GroupProcessData[];
	FullHandlingDefinition?: {
		ID: number;
		Code: string;
		Notes: string;
		Handling: boolean;
		InnerIndex: number;
		PathSimo: number;
		Questions: {
			ID: number;
			ProcessDefinitionID: number;
			Seq: number;
			QuestionColumnID: number;
			_QuestionColumn: {
				ID: number;
				Seq: number;
				Description: string;
				Explanation: string;
				Pathmarker: boolean;
				PathAlternative: boolean;
			};
			Code: string;
			Description: string;
			Explanation: string;
			DefaultIndexIfChoice: number;
			IsNumbersQuestion: boolean;
			QuestionsNumbers: {
				ProcessDefinitionQuestionID: number;
				MinValue: number;
				MaxValue: number;
				DefaultValue: number;
				Dps: number;
			};
			QuestionsChoices: {
				ID: number;
				ProcessDefinitionQuestionID: number;
				ChoiceIndex: number;
				ChoiceValue: string;
			}[];
		}[];
		AllowedPathFeatures: {
			ID: number;
			Feature: string;
		}[];
	};
	FullTaskDefinition?: {
		ID: number;
		Code: string;
		Notes: string;
		Handling: boolean;
		InnerIndex: number;
		PathSimo: number;
		Questions: {
			ID: number;
			ProcessDefinitionID: number;
			Seq: number;
			QuestionColumnID: number;
			_QuestionColumn: {
				ID: number;
				Seq: number;
				Description: string;
				Explanation: string;
				Pathmarker: boolean;
				PathAlternative: boolean;
			};
			Code: string;
			Description: string;
			Explanation: string;
			DefaultIndexIfChoice: number;
			IsNumbersQuestion: boolean;
			QuestionsNumbers: {
				ProcessDefinitionQuestionID: number;
				MinValue: number;
				MaxValue: number;
				DefaultValue: number;
				Dps: number;
			};
			QuestionsChoices: {
				ID: number;
				ProcessDefinitionQuestionID: number;
				ChoiceIndex: number;
				ChoiceValue: string;
			}[];
		}[];
		AllowedPathTypes: {
			readonly ID: number;
			Seq: number;
			Name: string;
		}[];
		AllowedPathFeatures: {
			readonly ID: number;
			Description: string;
		}[];
	};
	Calculations?: {
		PairsCosted: number;
		PairsCosted_BatchSize: number;
		Basic_Time: {
			PairsCosted: number;
			PairsCosted_BatchSize: number;
			Seconds: {
				Total: number;
				VA: number;
				NVA: number;
				Costed_Total: number;
				Costed_VA: number;
				Costed_NVA: number;
				Sequential: number;
				Simo1: number;
				Simo2: number;
				Cutting: {
					Setup: number;
					MaterialHandling: number;
					Cutting: number;
					CutPartHandling: number;
					Additional: number;
				};
				Group: {
					Notional_Total: number;
					Notional_VA: number;
					Notional_NVA: number;
				};
			};
			Minutes: {
				Total: number;
				VA: number;
				NVA: number;
				Costed_Total: number;
				Costed_VA: number;
				Costed_NVA: number;
				Sequential: number;
				Simo1: number;
				Simo2: number;
				Cutting: {
					Setup: number;
					MaterialHandling: number;
					Cutting: number;
					CutPartHandling: number;
					Additional: number;
				};
				Group: {
					Notional_Total: number;
					Notional_VA: number;
					Notional_NVA: number;
				};
			};
		};
		Allowed_Time: {
			PairsCosted: number;
			PairsCosted_BatchSize: number;
			Seconds: {
				Total: number;
				VA: number;
				NVA: number;
				Costed_Total: number;
				Costed_VA: number;
				Costed_NVA: number;
				Sequential: number;
				Simo1: number;
				Simo2: number;
				Cutting: {
					Setup: number;
					MaterialHandling: number;
					Cutting: number;
					CutPartHandling: number;
					Additional: number;
				};
				Group: {
					Notional_Total: number;
					Notional_VA: number;
					Notional_NVA: number;
				};
			};
			Minutes: {
				Total: number;
				VA: number;
				NVA: number;
				Costed_Total: number;
				Costed_VA: number;
				Costed_NVA: number;
				Sequential: number;
				Simo1: number;
				Simo2: number;
				Cutting: {
					Setup: number;
					MaterialHandling: number;
					Cutting: number;
					CutPartHandling: number;
					Additional: number;
				};
				Group: {
					Notional_Total: number;
					Notional_VA: number;
					Notional_NVA: number;
				};
			};
		};
		SecsPerUnit: number;
		UnitsPerHr: number;
		UnitsPerDay: number;
		Cost_Batch: number;
		Cost_PairsCosted: number;
		Simo: number;
		LevelOn75To100: number;
		ValidGroup: boolean;
	};
	WhereUsed?: ProcessWhereUsedForDesignItemData[];
};

export type QuestionAnswerData = {
	readonly ID?: number;
	readonly Code: string;
	ValueOrIndex: number;
	Answered: boolean;
};

export type PreviewProcessDefinitionQuestionsData = {
	ID: number;
	BatchSize: number;
	ItemsCovered: number;
	DensityPerSomething: number;
	DensityPerIsInch: boolean;
	QuestionsAnswers: {
		Code: string;
		ValueOrIndex: number;
		Answered: boolean;
	}[];
	Points:
		| {
				X: number;
				Y: number;
				PointType: PointTypes;
				RawPoint: boolean;
				PathType: PathTypes;
				Features: {
					FeatureID: number;
				}[];
		  }[]
		| string;
};

export type PreviewProcessDefinitionStepData = {
	StepID?: number;
	_Step: {
		ID: number;
		Code: string;
		Description: string;
	};
	Simo: number;
	Quantity: number;
	Every: number;
	PerBatch: boolean;
	MachiningamendmentID: number;
};

export type MadeInPairsStatusType = "mipsYes" | "mipsNo" | "mipsMixed";

export type DesignData = {
	readonly ID?: number;
	Code: string;
	Description?: string;
	PairsCosted: number;
	Notes?: string;
	MadeInPairsStatus?: MadeInPairsStatusType;
	PhotoURL?: string;
	Departments?: DesignDepartmentData[];
	Allowed_Time_PairsCosted?: {
		Seconds: {
			Total: number;
			VA: number;
			NVA: number;
		};
		Minutes: {
			Total: number;
			VA: number;
			NVA: number;
		};
	};
	Cost_PairsCosted?: number;
};

export type DesignDepartmentProcessData = {
	readonly ID?: number;
	ProcessID: number;
	Seq: number;
	_Operation?: ProcessData;
};

export type DesignDepartmentData = {
	UpdateMap?: {
		Header: boolean;
		Processes: boolean;
	};
	readonly ID?: number;
	DesignID: number;
	DepartmentID: number;
	_Department?: DepartmentData;
	BatchSize?: number;
	PairsCosted?: number;
	Notes?: string;
	MadeInPairsStatus?: MadeInPairsStatusType;
	Processes?: DesignDepartmentProcessData[];
	Calculations?: {
		PairsCosted: number;
		PairsCosted_BatchSize: number;
		Allowed_Time: {
			PairsCosted: number;
			PairsCosted_BatchSize: number;
			Seconds: {
				Total: number;
				VA: number;
				NVA: number;
				Costed_Total: number;
				Costed_VA: number;
				Costed_NVA: number;
			};
			Minutes: {
				Total: number;
				VA: number;
				NVA: number;
				Costed_Total: number;
				Costed_VA: number;
				Costed_NVA: number;
			};
		};
		Cost_Batch: number;
		Cost_PairsCosted: number;
	};
};

export type AuditData = {
	DateTime: string;
	Username: string;
	Section: SectionTypes;
	_Section: string;
	SectionAction: SectionActions;
	_SectionAction: string;
	CodeOrNo: string;
	Description: string;
};

export type DateFilters = {
	DateFrom?: string;
	DateTo?: string;
};

export interface ProcessesFilters {
	department?: string;
	processClass?: string;
	processType?: string;
}

export interface AuditFilters extends DateFilters {
	User?: string;
	Sections?: string;
	SectionActions?: string;
}

export interface AuditQueryData extends Omit<
	AuditFilters,
	"Sections" | "SectionActions"
> {
	CodeOrNo?: string;
	Sections?: SectionQueryData[];
	SectionActions?: SectionQueryData[];
}

export type AuditDisplayData = {
	ID?: string;
	SectionName?: string;
	WhenCreated?: string;
	WhoCreated?: string;
	WhenModified?: string;
	WhoModified?: string;
	WhenDeleted?: string;
	WhoDeleted?: string;
};

type SectionQueryData = {
	Name: string;
};

type SectionTypes =
	| "sAction"
	| "sStep"
	| "sProcess"
	| "sDesign"
	| "sDesignDepartment"
	| "sProcessclass"
	| "sProcesstype"
	| "sProcessdefinition"
	| "sProcessset"
	| "sDepartment"
	| "sGrade"
	| "sMachine"
	| "sSettingsGeneral"
	| "sSettingsMachiningamendments"
	| "sSettingsMachiningSteps"
	| "sSettingsProcessdefinitionsdefaultcutting"
	| "sSettingsProcessdefinitionsmachining"
	| "sSettingsProcessdefinitionspathfeatures"
	| "sSettingsProcessdefinitionsquestioncolumns"
	| "sSettingsStitchingcharacteristics"
	| "sSettingsStitchingmodifiers";
type SectionActions =
	| "aCreate"
	| "aUpdate"
	| "aDelete"
	| "aCopy"
	| "aCreateFromCopy";
