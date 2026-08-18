import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
} from "react";

type EditableSectionProps = { children: ReactNode };

// eslint-disable-next-line react-refresh/only-export-components
export const EditableSectionContext = createContext<
	| {
			inputName: string | undefined;
			setInputName: Dispatch<SetStateAction<string | undefined>>;
	  }
	| undefined
>(undefined);

export const EditableSection = ({ children }: EditableSectionProps) => {
	const [inputName, setInputName] = useState<string>();

	return (
		<EditableSectionContext.Provider
			value={{
				inputName: inputName,
				setInputName: setInputName,
			}}
		>
			{children}
		</EditableSectionContext.Provider>
	);
};
