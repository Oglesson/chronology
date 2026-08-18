import { UniqueIdentifier } from "@dnd-kit/core";
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
} from "react";
import {
	ProcessDefinitionStepData,
	ProcessDefinitionPathFeaturesStepData,
	ProcessDefinitionPathTypeData,
	ProcessDefinitionQuestionData,
	ProcessDefinitionQuestionGroup,
} from "../../../api.common/types";
import { useToggle } from "../../../hooks.common/useToggle";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";
import ObjectUtilities from "../../../utilities.common/ObjectUtilities";

export type QuestionType = "choice" | "number" | null;

type DefinitionContext = {
	definitionType: "H" | "T" | "";
	addQuestionContainerId: UniqueIdentifier | null;
	setAddQuestionContainerId: Dispatch<
		SetStateAction<UniqueIdentifier | null>
	>;
	questionType: QuestionType;
	setQuestionType: Dispatch<SetStateAction<QuestionType>>;
	canSave: boolean;
	setCanSave: Dispatch<SetStateAction<boolean>>;
	containers: UniqueIdentifier[];
	setContainers: Dispatch<SetStateAction<UniqueIdentifier[]>>;
	groups: ProcessDefinitionQuestionGroup[] | undefined;
	setGroups: Dispatch<
		SetStateAction<ProcessDefinitionQuestionGroup[] | undefined>
	>;
	items: {
		[key: string]: UniqueIdentifier[];
	};
	setItems: Dispatch<
		SetStateAction<{
			[key: string]: UniqueIdentifier[];
		}>
	>;
	editQuestionModalData: ProcessDefinitionQuestionData | null;
	setEditQuestionModalData: Dispatch<
		SetStateAction<ProcessDefinitionQuestionData | null>
	>;
	openAddQuestionModal: boolean;
	setOpenAddQuestionModal: () => void;
	openEditQuestionModal: boolean;
	setOpenEditQuestionModal: () => void;
	openEditPathTypeModal: boolean;
	setOpenEditPathTypeModal: () => void;
	openRemovePathTypeModal: boolean;
	setOpenRemovePathTypeModal: () => void;
	openEditStepModal: boolean;
	setOpenEditStepModal: () => void;
	openRemoveStepModal: boolean;
	setOpenRemoveStepModal: () => void;
	questions: ProcessDefinitionQuestionData[] | undefined;
	setQuestions: Dispatch<
		SetStateAction<ProcessDefinitionQuestionData[] | undefined>
	>;
	pathTypes: ProcessDefinitionPathTypeData[] | undefined;
	setPathTypes: Dispatch<
		SetStateAction<ProcessDefinitionPathTypeData[] | undefined>
	>;
	pathTypeActionIndex: number | null;
	setPathTypeActionIndex: Dispatch<SetStateAction<number | null>>;
	definitionStepActionIndex: number | null;
	setDefinitionStepActionIndex: Dispatch<SetStateAction<number | null>>;
	definitionSteps: ProcessDefinitionStepData[] | undefined;
	setDefinitionSteps: Dispatch<
		SetStateAction<ProcessDefinitionStepData[] | undefined>
	>;
	definitionStepsForPathFeatures:
		| ProcessDefinitionPathFeaturesStepData[]
		| undefined;
	setDefinitionStepsForPathFeatures: Dispatch<
		SetStateAction<ProcessDefinitionPathFeaturesStepData[] | undefined>
	>;
	innerIndex: number | undefined;
	setInnerIndex: Dispatch<SetStateAction<number | undefined>>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const DefinitionContext = createContext<DefinitionContext>({
	definitionType: "",
	addQuestionContainerId: null,
	setAddQuestionContainerId: () => {},
	questionType: null,
	setQuestionType: () => {},
	canSave: false,
	setCanSave: () => {},
	containers: [],
	setContainers: () => {},
	groups: [],
	setGroups: () => {},
	items: {},
	setItems: () => {},
	editQuestionModalData: null,
	setEditQuestionModalData: () => {},
	openAddQuestionModal: false,
	setOpenAddQuestionModal: () => {},
	openEditQuestionModal: false,
	setOpenEditQuestionModal: () => {},
	openEditPathTypeModal: false,
	setOpenEditPathTypeModal: () => {},
	openRemovePathTypeModal: false,
	setOpenRemovePathTypeModal: () => {},
	openEditStepModal: false,
	setOpenEditStepModal: () => {},
	openRemoveStepModal: false,
	setOpenRemoveStepModal: () => {},
	questions: [],
	setQuestions: () => {},
	pathTypes: [],
	setPathTypes: () => {},
	pathTypeActionIndex: null,
	setPathTypeActionIndex: () => {},
	definitionStepActionIndex: null,
	setDefinitionStepActionIndex: () => {},
	definitionSteps: [],
	setDefinitionSteps: () => {},
	definitionStepsForPathFeatures: [],
	setDefinitionStepsForPathFeatures: () => {},
	innerIndex: undefined,
	setInnerIndex: () => {},
});

export const DefinitionContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const definition = ObjectUtilities.deepCopy(useProcessDefinition());
	const groupById = definition?.Questions?.reduce(
		(
			r: {
				[key: string]: ProcessDefinitionQuestionData[];
			},
			a
		) => {
			r[a.QuestionColumnID] = [...(r[a.QuestionColumnID] || []), a];
			return r;
		},
		{}
	);

	let keys;

	const itemsObj: {
		[key: string]: UniqueIdentifier[];
	} = {};

	if (groupById) {
		keys = Object.keys(groupById).map(Number);

		if (keys) {
			for (const key of keys) {
				itemsObj[key] = groupById[key].map((q) => q.Code);
			}
		}
	}
	const [addQuestionContainerId, setAddQuestionContainerId] =
		useState<UniqueIdentifier | null>(null);
	const [questionType, setQuestionType] = useState<QuestionType>(null);
	const [canSave, setCanSave] = useState(false);
	const [containers, setContainers] = useState(keys as UniqueIdentifier[]);
	const [groups, setGroups] = useState(definition.QuestionGroups);
	const [items, setItems] = useState(itemsObj);
	const [editQuestionModalData, setEditQuestionModalData] =
		useState<ProcessDefinitionQuestionData | null>(null);
	const [openAddQuestionModal, setOpenAddQuestionModal] = useToggle(false);
	const [openEditQuestionModal, setOpenEditQuestionModal] = useToggle(false);
	const [openEditPathTypeModal, setOpenEditPathTypeModal] = useToggle(false);
	const [openRemovePathTypeModal, setOpenRemovePathTypeModal] =
		useToggle(false);
	const [openEditStepModal, setOpenEditStepModal] = useToggle(false);
	const [openRemoveStepModal, setOpenRemoveStepModal] =
		useToggle(false);
	const [questions, setQuestions] = useState(definition.Questions);
	const [definitionSteps, setDefinitionSteps] = useState(
		definition.Steps
	);
	const [
		definitionStepsForPathFeatures,
		setDefinitionStepsForPathFeatures,
	] = useState(definition.PathfeaturesSteps);
	const [pathTypes, setPathTypes] = useState(definition.Pathtypes);
	const [pathTypeActionIndex, setPathTypeActionIndex] = useState<
		number | null
	>(null);
	const [definitionStepActionIndex, setDefinitionStepActionIndex] =
		useState<number | null>(null);
	const [innerIndex, setInnerIndex] = useState(
		definition.InnerIndex !== undefined && definition.InnerIndex < 0
			? undefined
			: definition.InnerIndex
	);

	return (
		<DefinitionContext.Provider
			value={{
				definitionType: definition.Handling ? "H" : "T",
				addQuestionContainerId,
				setAddQuestionContainerId,
				questionType,
				setQuestionType,
				canSave,
				setCanSave,
				containers,
				setContainers,
				groups,
				setGroups,
				items,
				setItems,
				editQuestionModalData,
				setEditQuestionModalData,
				openAddQuestionModal,
				setOpenAddQuestionModal,
				openEditQuestionModal,
				setOpenEditQuestionModal,
				openEditPathTypeModal,
				setOpenEditPathTypeModal,
				openRemovePathTypeModal,
				setOpenRemovePathTypeModal,
				questions,
				setQuestions,
				pathTypes,
				setPathTypes,
				pathTypeActionIndex,
				setPathTypeActionIndex,
				openEditStepModal,
				setOpenEditStepModal,
				openRemoveStepModal,
				setOpenRemoveStepModal,
				definitionSteps,
				setDefinitionSteps,
				definitionStepActionIndex,
				setDefinitionStepActionIndex,
				innerIndex,
				setInnerIndex,
				definitionStepsForPathFeatures,
				setDefinitionStepsForPathFeatures,
			}}
		>
			{children}
		</DefinitionContext.Provider>
	);
};
