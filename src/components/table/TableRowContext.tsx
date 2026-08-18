import { createContext, Dispatch, ReactNode, useState } from "react";
import { TableRowOptionsProps } from "./TableRow";

type TableRowContext<T> = {
	data?: T;
	options?: TableRowOptionsProps<T>;
	additionalData?: {
		current: unknown;
		set: Dispatch<unknown>;
	};
	extraRowClasses: string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const TableRowContext = createContext<TableRowContext<unknown>>({
	extraRowClasses: "",
});

type TableRowProviderProps<T> = {
	children?: ReactNode;
	data: T;
	options: TableRowOptionsProps<T>;
};

export const TableRowProvider = <T,>({
	children,
	data,
	options,
	...props
}: TableRowProviderProps<T>) => {
	const [additional, setAdditional] = useState<unknown>();

	const additionalData = {
		current: additional,
		set: setAdditional,
	};

	return (
		<TableRowContext.Provider
			value={{ data, options, additionalData, extraRowClasses: "" }}
			{...props}
		>
			{children}
		</TableRowContext.Provider>
	);
};
