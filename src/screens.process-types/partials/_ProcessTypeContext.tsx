import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
} from "react";
import { ProcessClassData, ProcessTypeData } from "../../api.common/types";
import { useToggle } from "../../hooks.common/useToggle";

type ProcessTypeContext = {
	canSave: boolean;
	setCanSave: Dispatch<SetStateAction<boolean>>;

	// Class
	editClassData: ProcessClassData | null;
	setEditClassData: Dispatch<SetStateAction<ProcessClassData | null>>;
	openEditClassModal: boolean;
	setOpenEditClassModal: () => void;
	deleteClassId: number | null;
	setDeleteClassId: Dispatch<SetStateAction<number | null>>;
	deleteClassName: string | null;
	setDeleteClassName: Dispatch<SetStateAction<string | null>>;
	openCreateClassModal: boolean;
	setOpenCreateClassModal: () => void;
	openDeleteClassModal: boolean;
	setOpenDeleteClassModal: () => void;

	// Type
	createTypeClassId: number | null;
	setCreateTypeClassId: Dispatch<SetStateAction<number | null>>;
	editTypeClassId: number | null;
	setEditTypeClassId: Dispatch<SetStateAction<number | null>>;
	editTypeData: ProcessTypeData | null;
	setEditTypeData: Dispatch<SetStateAction<ProcessTypeData | null>>;
	openEditTypeModal: boolean;
	setOpenEditTypeModal: () => void;
	deleteTypeId: number | null;
	setDeleteTypeId: Dispatch<SetStateAction<number | null>>;
	deleteTypeName: string | null;
	setDeleteTypeName: Dispatch<SetStateAction<string | null>>;
	openCreateTypeModal: boolean;
	setOpenCreateTypeModal: () => void;
	openDeleteTypeModal: boolean;
	setOpenDeleteTypeModal: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ProcessTypeContext = createContext<ProcessTypeContext>({
	canSave: false,
	setCanSave: () => {},

	// Class
	editClassData: null,
	setEditClassData: () => {},
	openEditClassModal: false,
	setOpenEditClassModal: () => {},
	deleteClassId: null,
	setDeleteClassId: () => {},
	deleteClassName: null,
	setDeleteClassName: () => {},
	openCreateClassModal: false,
	setOpenCreateClassModal: () => {},
	openDeleteClassModal: false,
	setOpenDeleteClassModal: () => {},

	// Type
	createTypeClassId: null,
	setCreateTypeClassId: () => {},
	editTypeClassId: null,
	setEditTypeClassId: () => {},
	editTypeData: null,
	setEditTypeData: () => {},
	openEditTypeModal: false,
	setOpenEditTypeModal: () => {},
	deleteTypeId: null,
	setDeleteTypeId: () => {},
	deleteTypeName: null,
	setDeleteTypeName: () => {},
	openCreateTypeModal: false,
	setOpenCreateTypeModal: () => {},
	openDeleteTypeModal: false,
	setOpenDeleteTypeModal: () => {},
});

export const ProcessTypeContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [canSave, setCanSave] = useState(false);

	// Class
	const [editClassData, setEditClassData] =
		useState<ProcessClassData | null>(null);
	const [openEditClassModal, setOpenEditClassModal] = useToggle(false);
	const [deleteClassId, setDeleteClassId] = useState<number | null>(null);
	const [deleteClassName, setDeleteClassName] = useState<string | null>(null);
	const [openCreateClassModal, setOpenCreateClassModal] = useToggle(false);
	const [openDeleteClassModal, setOpenDeleteClassModal] = useToggle(false);

	// Type
	const [createTypeClassId, setCreateTypeClassId] = useState<number | null>(
		null
	);
	const [editTypeClassId, setEditTypeClassId] = useState<number | null>(null);
	const [editTypeData, setEditTypeData] = useState<ProcessTypeData | null>(
		null
	);
	const [openEditTypeModal, setOpenEditTypeModal] = useToggle(false);
	const [deleteTypeId, setDeleteTypeId] = useState<number | null>(null);
	const [deleteTypeName, setDeleteTypeName] = useState<string | null>(null);
	const [openCreateTypeModal, setOpenCreateTypeModal] = useToggle(false);
	const [openDeleteTypeModal, setOpenDeleteTypeModal] = useToggle(false);

	return (
		<ProcessTypeContext.Provider
			value={{
				canSave,
				setCanSave,

				// Class
				deleteClassId,
				setDeleteClassId,
				deleteClassName,
				setDeleteClassName,
				openDeleteClassModal,
				setOpenDeleteClassModal,
				editClassData,
				setEditClassData,
				openCreateClassModal,
				setOpenCreateClassModal,
				openEditClassModal,
				setOpenEditClassModal,

				// Type
				createTypeClassId,
				setCreateTypeClassId,
				editTypeClassId,
				setEditTypeClassId,
				editTypeData,
				setEditTypeData,
				openEditTypeModal,
				setOpenEditTypeModal,
				deleteTypeId,
				setDeleteTypeId,
				deleteTypeName,
				setDeleteTypeName,
				openCreateTypeModal,
				setOpenCreateTypeModal,
				openDeleteTypeModal,
				setOpenDeleteTypeModal,
			}}
		>
			{children}
		</ProcessTypeContext.Provider>
	);
};
