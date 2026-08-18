import {
	FieldError,
	FieldValues,
	Path,
	UseFormRegister,
} from "react-hook-form";
import { FormError } from "./FormError";
import { Label } from "./Label";

type InputProps<T extends FieldValues> = {
	defaultValue?: string;
	error?: FieldError;
	htmlFor: string;
	label: string;
	name: Path<T>;
	placeholder?: string;
	register: UseFormRegister<T>;
};

export const Textarea = <T extends FieldValues>({
	defaultValue,
	htmlFor,
	label,
	name,
	register,
	error,
	placeholder,
	...props
}: InputProps<T>) => {
	return (
		<div className="form-field" {...props}>
			<Label htmlFor={htmlFor} label={label} />
			<textarea
				{...register(name)}
				id={htmlFor}
				placeholder={placeholder}
				className={`form-input h-28 resize-none${
					error ? " form-input--error" : ""
				}`}
				aria-invalid={error ? "true" : "false"}
				defaultValue={defaultValue}
			/>
			<FormError error={error} />
		</div>
	);
};
