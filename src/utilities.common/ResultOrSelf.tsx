// Calls item with props if it's a function, otherwise returns it as-is
export const ResultOrSelf = (item: unknown, ...props: unknown[]) =>
	typeof item === "function" ? item(...props) : item;
