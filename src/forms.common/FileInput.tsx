import { ChangeEvent, useEffect, useState } from "react";
import {
	FieldError,
	FieldValues,
	Path,
	UseFormRegister,
} from "react-hook-form";
import { Icon } from "../config.common/Icons";
import { RenderIcon } from "../utilities.common/RenderIcon";
import { FormError } from "./FormError";
import { Label } from "./Label";

type FileInputProps<T extends FieldValues> = {
	accept?: string;
	defaultValue?: string | number;
	error?: FieldError;
	htmlFor: string;
	icon?: Icon;
	label: string;
	name: Path<T>;
	placeholder?: string;
	register: UseFormRegister<T>;
};

export const FileInput = <T extends FieldValues>({
	accept,
	defaultValue,
	htmlFor,
	icon,
	label,
	name,
	placeholder,
	register,
	error,
	...props
}: FileInputProps<T>) => {
	const [fileName, setFileName] = useState(defaultValue);

	const registerOptions = register(name);

	const handleChange = (e: ChangeEvent) => {
		const target = e.currentTarget as HTMLInputElement;
		registerOptions.onChange(e);
		setFileName(target.files?.[0].name);
	};

	useEffect(() => {
		setFileName(defaultValue);
	}, [defaultValue]);

	return (
		<div className="form-field">
			<Label htmlFor={htmlFor} label={label} />
			<div className="relative bg-dashed-light dark:bg-dashed-dark rounded-md">
				<div
					className={`form-input form-input--file${
						error ? " form-input--error" : ""
					} h-44 border-transparent dark:border-transparent`}
				>
					<input
						{...registerOptions}
						aria-invalid={error ? "true" : "false"}
						accept={accept}
						className="absolute inset-0 w-full h-full rounded-md opacity-0 cursor-pointer"
						defaultValue={defaultValue}
						id={htmlFor}
						onChange={handleChange}
						title=""
						type="file"
						{...props}
					/>
					{icon && (
						<RenderIcon classes="text-grey-light" icon={icon} />
					)}
					<span className={!fileName ? "text-grey-light" : ""}>
						{fileName || placeholder}
					</span>
				</div>
			</div>
			<FormError error={error} />
		</div>
	);
};
