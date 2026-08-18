import {
	createContext,
	Dispatch,
	SetStateAction,
	useState,
	ReactNode,
} from "react";
import {
	StepHandActionData,
	StepLinkActionData,
} from "../../hooks.queries/useStep";
export type Items = {
	link: StepLinkActionData[];
	left: StepHandActionData[];
	right: StepHandActionData[];
};
type ItemsContext = {
	items: Items;
	setItems: Dispatch<SetStateAction<Items>>;
	isModalOpen: boolean;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
	canSave: boolean;
	setCanSave: Dispatch<SetStateAction<boolean>>;
};
// eslint-disable-next-line react-refresh/only-export-components
export const ItemsContext = createContext<ItemsContext>({
	items: { left: [], link: [], right: [] },
	setItems: () => {},
	isModalOpen: false,
	setIsModalOpen: () => {},
	canSave: false,
	setCanSave: () => {},
});
export const ItemsContextProvider = ({ children }: { children: ReactNode }) => {
	const [items, setItems] = useState<Items>({
		left: [],
		link: [],
		right: [],
	});
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [canSave, setCanSave] = useState<boolean>(false);
	return (
		<ItemsContext.Provider
			value={{
				items,
				setItems,
				isModalOpen,
				setIsModalOpen,
				setCanSave,
				canSave,
			}}
		>
			{children}
		</ItemsContext.Provider>
	);
};
