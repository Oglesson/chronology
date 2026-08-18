import { createContext, ReactNode } from "react";
import { useToggle } from "../../hooks.common/useToggle";

type ProcessDefinitionContext = {
	openCreateProcessDefinitionModal: boolean;
	setOpenCreateProcessDefinitionModal: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ProcessDefinitionContext =
	createContext<ProcessDefinitionContext>({
		openCreateProcessDefinitionModal: false,
		setOpenCreateProcessDefinitionModal: () => {},
	});

export const ProcessDefinitionContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [
		openCreateProcessDefinitionModal,
		setOpenCreateProcessDefinitionModal,
	] = useToggle(false);

	return (
		<ProcessDefinitionContext.Provider
			value={{
				openCreateProcessDefinitionModal,
				setOpenCreateProcessDefinitionModal,
			}}
		>
			{children}
		</ProcessDefinitionContext.Provider>
	);
};
