type LabelProps = {
	htmlFor?: string;
	label: string;
	theme?: "default" | "checkable" | "horizontal" | null;
};

export const Label = ({ htmlFor, label, theme, ...props }: LabelProps) => {
	let themeClasses;

	switch (theme) {
		case "checkable":
			themeClasses = "ml-3";
			break;
		case "horizontal":
			themeClasses = "text-grey-light";
			break;

		case "default":
		default:
			themeClasses = "block text-grey-light mb-5";
	}

	return (
		<label htmlFor={htmlFor} className={themeClasses} {...props}>
			{label}
		</label>
	);
};
