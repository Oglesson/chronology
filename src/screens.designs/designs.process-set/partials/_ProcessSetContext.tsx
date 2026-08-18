import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
} from "react";
import { ProcessSetProcessData } from "../../../api.common/types";
import { useProcessSet } from "../../../hooks.queries/useProcessSet";

type ProcessSetContext = {
	processes: ProcessSetProcessData[];
	setProcesses: Dispatch<SetStateAction<ProcessSetProcessData[]>>;
	canSave: boolean;
	setCanSave: Dispatch<SetStateAction<boolean>>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ProcessSetContext = createContext<ProcessSetContext>({
	processes: [],
	setProcesses: () => {},
	canSave: false,
	setCanSave: () => {},
});

export const ProcessSetContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const processSet = useProcessSet();
	const [processes, setProcesses] = useState<ProcessSetProcessData[]>(
		processSet.Processes || []
	);
	const [canSave, setCanSave] = useState(false);

	return (
		<ProcessSetContext.Provider
			value={{
				processes,
				setProcesses,
				canSave,
				setCanSave,
			}}
		>
			{children}
		</ProcessSetContext.Provider>
	);
};
