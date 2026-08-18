import { createContext, ReactNode } from "react";
import { useToggle } from "../../hooks.common/useToggle";

type ActionsContext = {
	openModal: boolean;
	setOpenModal: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ActionsContext = createContext<ActionsContext>({
	openModal: false,
	setOpenModal: () => {},
});

export const ActionsContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [openModal, setOpenModal] = useToggle(false);

	return (
		<ActionsContext.Provider value={{ openModal, setOpenModal }}>
			{children}
		</ActionsContext.Provider>
	);
};
