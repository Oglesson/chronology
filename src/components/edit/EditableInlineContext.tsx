import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
} from "react";
import { Control, FieldValues } from "react-hook-form";

type EditableInlineContext = {
	control?: Control<FieldValues>;
	setControl?: Dispatch<SetStateAction<Control<FieldValues> | undefined>>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const EditableInlineContext = createContext<EditableInlineContext>({});

type EditableInlineProviderProps = {
	children?: ReactNode;
};

export const EditableInlineProvider = ({
	children,
	...props
}: EditableInlineProviderProps) => {
	const [control, setControl] = useState<Control<FieldValues>>();

	return (
		<EditableInlineContext.Provider
			value={{ control, setControl }}
			{...props}
		>
			{children}
		</EditableInlineContext.Provider>
	);
};
