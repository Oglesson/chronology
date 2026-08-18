import {
	createContext,
	ReactNode,
	useState,
	SetStateAction,
	Dispatch,
} from "react";

type DesignsContext = {
	openModalContent: ReactNode | null;
	setOpenModalContent: Dispatch<SetStateAction<ReactNode | null>>;
	openModalSettings: Record<string, unknown> | null;
	setOpenModalSettings: Dispatch<
		SetStateAction<Record<string, unknown> | null>
	>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const DesignsContext = createContext<DesignsContext>({
	openModalContent: null,
	setOpenModalContent: () => {},
	openModalSettings: null,
	setOpenModalSettings: () => {},
});

export const DesignsContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [openModalContent, setOpenModalContent] = useState<ReactNode | null>(
		null
	);
	const [openModalSettings, setOpenModalSettings] = useState<Record<string, unknown> | null>(null);

	return (
		<DesignsContext.Provider
			value={{
				openModalContent,
				setOpenModalContent,
				openModalSettings,
				setOpenModalSettings,
			}}
		>
			{children}
		</DesignsContext.Provider>
	);
};
