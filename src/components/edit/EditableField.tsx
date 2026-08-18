import { DefaultTReturn, TOptions } from "i18next";
import { ReactElement, useContext, ReactNode } from "react";
import { FieldValues } from "react-hook-form";
import { EditableInput, EditableInputProps } from "./EditableInput";
import { EditableSectionContext } from "./EditableSection";
import { Tooltip } from "../common/tooltip/Tooltip";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import Icons from "../../config.common/Icons";

type EditableFieldProps<T extends FieldValues> = EditableInputProps<T> & {
	label: ReactElement | DefaultTReturn<TOptions>;
	inline?: boolean;
	className?: string;
	tooltipContent?: ReactNode;
	alignHorizontal?: "left" | "right" | "center";
};

export const EditableField = <T extends FieldValues>({
	action,
	alignHorizontal,
	inline,
	className,
	defaultElement,
	defaultValue,
	disableEdit,
	identifier,
	inputName,
	inputType,
	label,
	placeholder,
	schema,
	selectedValue,
	tooltipContent,
	...props
}: EditableFieldProps<T>) => {
	const editableSectionContext = useContext(EditableSectionContext);

	return (
		<>
			<div
				className={`${inline ? "flex mb-1 typo-h5" : ""} ${
					className ?? ""
				} ${
					editableSectionContext?.inputName &&
					editableSectionContext.inputName !== inputName
						? "text-grey-lightest dark:text-grey-mid"
						: ""
				}`}
				{...props}
			>
				<span
					className={`block ${
						editableSectionContext?.inputName &&
						editableSectionContext.inputName !== inputName
							? ""
							: "text-grey-light"
					}
					${inline ? "editable__label w-[12.5rem] mr-5" : "mb-1.5"}
					${tooltipContent ? "!flex" : ""}
				`}
				>
					{tooltipContent ? <span>{label}</span> : label}
					{tooltipContent && (
						<Tooltip content={tooltipContent} className="ml-3">
							<RenderIcon icon={Icons.Interface.Info} />
						</Tooltip>
					)}
				</span>

				<EditableInput
					action={action}
					alignHorizontal={alignHorizontal}
					defaultElement={defaultElement}
					defaultValue={defaultValue}
					disableEdit={disableEdit}
					identifier={identifier}
					inputName={inputName}
					inputType={inputType}
					placeholder={placeholder}
					schema={schema}
					selectedValue={selectedValue}
				/>
			</div>
		</>
	);
};
