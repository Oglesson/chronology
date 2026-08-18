import {
	createContext,
	ReactNode,
	useState,
	SetStateAction,
	Dispatch,
} from "react";
import { ProcessesFilters } from "../../api.common/types";
import { ModalProps } from "../../components/modal/Modal";

type ProcessesContext = {
	openModalContent: ReactNode | null;
	setOpenModalContent: Dispatch<SetStateAction<ReactNode | null>>;
	openModalSettings: ModalProps | null;
	setOpenModalSettings: Dispatch<SetStateAction<ModalProps | null>>;
	defaultFilterValues: ProcessesFilters;
	filterValues: ProcessesFilters;
	setFilterValues: Dispatch<SetStateAction<ProcessesFilters>>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ProcessesContext = createContext<ProcessesContext>({
	openModalContent: null,
	setOpenModalContent: () => {},
	openModalSettings: null,
	setOpenModalSettings: () => {},
	defaultFilterValues: {},
	filterValues: {},
	setFilterValues: () => {},
});

export const ProcessesContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const defaultFilterValues = {
		department: "All",
		processClass: "All",
		processType: "",
	};
	const [openModalContent, setOpenModalContent] = useState<ReactNode | null>(
		null,
	);
	const [openModalSettings, setOpenModalSettings] =
		useState<ModalProps | null>(null);
	const [filterValues, setFilterValues] = useState<ProcessesFilters>({
		...defaultFilterValues,
	}); // List of properties being used to filter the data

	return (
		<ProcessesContext.Provider
			value={{
				openModalContent,
				setOpenModalContent,
				openModalSettings,
				setOpenModalSettings,
				defaultFilterValues,
				filterValues,
				setFilterValues,
			}}
		>
			{children}
		</ProcessesContext.Provider>
	);
};
