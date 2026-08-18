import { FocusEvent, ReactNode } from "react";
import {
	FieldError,
	FieldValues,
	Path,
	UseFormRegister,
} from "react-hook-form";
import { Checkable } from "./Checkable";
import { FormError } from "./FormError";
import { Label } from "./Label";
import { Tooltip } from "../components/common/tooltip/Tooltip";
import { RenderIcon } from "../utilities.common/RenderIcon";
import Icons from "../config.common/Icons";

type CheckableListProps<T extends FieldValues> = {
	error?: FieldError;
	items: CheckableListItem<T>[];
	label: string;
	onBlur?: (e: FocusEvent<HTMLInputElement, Step>) => void;
	register: UseFormRegister<T>;
	tooltipContent?: ReactNode;
	type: "checkbox" | "radio";
	horizontal?: boolean;
	onChange?: (e: FocusEvent<HTMLInputElement, Step>) => void;
};

export type CheckableListItem<T extends FieldValues> = {
	htmlFor: string;
	isDefault?: boolean;
	label: string;
	name: Path<T>;
	value: string | number;
};

export const CheckableList = <T extends FieldValues>({
	error,
	items,
	label,
	register,
	tooltipContent,
	type,
	horizontal,
	onChange,
	...props
}: CheckableListProps<T>) => {
	return (
		<div
			className={`form-field form-field--list${
				horizontal ? " flex gap-x-3.5" : ""
			}`}
		>
			<div className="flex justify-between form-field__label ">
				<Label label={label} theme={horizontal ? "horizontal" : null} />
				{tooltipContent && (
					<Tooltip content={tooltipContent}>
						<RenderIcon icon={Icons.Interface.Info} />
					</Tooltip>
				)}
			</div>
			<div
				className={`flex-auto${
					horizontal ? " flex gap-x-5" : " space-y-3.5 "
				}`}
			>
				{items.map((item) => (
					<Checkable
						defaultChecked={item.isDefault}
						htmlFor={item.htmlFor}
						label={item.label}
						name={item.name}
						register={register}
						type={type}
						value={item.value}
						key={item.htmlFor}
						onChange={onChange}
						{...props}
					/>
				))}
			</div>
			<FormError error={error} />
		</div>
	);
};
