import { FocusEvent } from "react";
import {
	FieldError,
	FieldValues,
	Path,
	UseFormRegister,
} from "react-hook-form";
import { Label } from "./Label";

type CheckableProps<T extends FieldValues> = {
	defaultChecked?: boolean;
	error?: FieldError;
	htmlFor: string;
	label: string;
	name: Path<T>;
	onBlur?: (e: FocusEvent<HTMLInputElement, Step>) => void;
	register: UseFormRegister<T>;
	type: "checkbox" | "radio";
	value: string | number;
	onChange?: (e: FocusEvent<HTMLInputElement, Step>) => void;
};

export const Checkable = <T extends FieldValues>({
	defaultChecked,
	error,
	htmlFor,
	label,
	name,
	register,
	type,
	value,
	...props
}: CheckableProps<T>) => {
	let classes;

	switch (type) {
		case "checkbox":
			classes = "form-checkbox";
			break;

		case "radio":
		default:
			classes = "form-radio";
	}

	return (
		<div className="flex items-center">
			<input
				{...register(name)}
				id={htmlFor}
				className={classes}
				type={type}
				value={value}
				defaultChecked={defaultChecked}
				aria-invalid={error ? "true" : "false"}
				{...props}
			/>
			<Label htmlFor={htmlFor} label={label} theme="checkable" />
		</div>
	);
};
