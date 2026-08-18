import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import { DesignDepartmentProcessData } from "../../../api.common/types";
import { useToggle } from "../../../hooks.common/useToggle";
import { useDesignDepartment } from "../../../hooks.queries/useDesignDepartment";

type DesignDepartmentContext = {
	styleProcesses: DesignDepartmentProcessData[];
	setStyleProcesses: Dispatch<
		SetStateAction<DesignDepartmentProcessData[]>
	>;
	openSingleModal: boolean;
	setOpenSingleModal: () => void;
	openSetModal: boolean;
	setOpenSetModal: () => void;
	insertIndex: number | undefined;
	setInsertIndex: Dispatch<SetStateAction<number | undefined>>;
	canSave: boolean;
	setCanSave: Dispatch<SetStateAction<boolean>>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const DesignDepartmentContext = createContext<DesignDepartmentContext>({
	styleProcesses: [],
	setStyleProcesses: () => {},
	openSingleModal: false,
	setOpenSingleModal: () => {},
	openSetModal: false,
	setOpenSetModal: () => {},
	insertIndex: undefined,
	setInsertIndex: () => {},
	canSave: false,
	setCanSave: () => {},
});

export const DesignDepartmentContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const styleDepartment = useDesignDepartment();
	const [styleProcesses, setStyleProcesses] = useState(
		styleDepartment?.Processes || []
	);
	const [openSingleModal, setOpenSingleModal] = useToggle(false);
	const [openSetModal, setOpenSetModal] = useToggle(false);
	const [insertIndex, setInsertIndex] = useState<number>();
	const [canSave, setCanSave] = useState(false);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setStyleProcesses(styleDepartment?.Processes || []);
	}, [styleDepartment?.Processes]);

	return (
		<DesignDepartmentContext.Provider
			value={{
				styleProcesses,
				setStyleProcesses,
				openSingleModal,
				setOpenSingleModal,
				openSetModal,
				setOpenSetModal,
				insertIndex,
				setInsertIndex,
				canSave,
				setCanSave,
			}}
		>
			{children}
		</DesignDepartmentContext.Provider>
	);
};
