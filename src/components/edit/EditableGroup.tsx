import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from "react";
import { EditableSectionContext } from "./EditableSection";

type EditableGroupProps = {
	children: ReactNode;
};

// eslint-disable-next-line react-refresh/only-export-components
export const EditableGroupContext = createContext<
	| {
			isActive: boolean | undefined;
			setIsActive: Dispatch<SetStateAction<boolean>>;
	  }
	| undefined
>(undefined);

export const EditableGroup = ({ children }: EditableGroupProps) => {
	const editableSectionContext = useContext(EditableSectionContext);
	const [isActive, setIsActive] = useState<boolean>(true);

	return (
		<EditableGroupContext.Provider
			value={{
				isActive: isActive,
				setIsActive: setIsActive,
			}}
		>
			<div
				className={
					editableSectionContext?.inputName && !isActive
						? "text-grey-mid"
						: undefined
				}
			>
				{children}
			</div>
		</EditableGroupContext.Provider>
	);
};
