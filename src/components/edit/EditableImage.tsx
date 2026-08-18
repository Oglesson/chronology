import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
	FieldError,
	FieldValues,
	Path,
	useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import Icons from "../../config.common/Icons";
import { FormError } from "../../forms.common/FormError";
import { Label } from "../../forms.common/Label";
import { useFetcher } from "../../hooks.common/useFetcher";
import { useImageSchema } from "../../hooks.schema/fields";
import { RenderIcon } from "../../utilities.common/RenderIcon";

interface EditableImageProps<T extends FieldValues> {
	className?: string;
	disableEdit?: boolean;
	formAction?: string;
	htmlFor?: string;
	inputName: Path<T>;
	labelText?: string;
	imageAltText?: string;
	imageAspectRatio?: string;
	imageClasses?: string;
	imageWidth?: string;
	imageSrc?: string;
}

export const EditableImage = <T extends FieldValues>({
	className,
	disableEdit,
	formAction,
	htmlFor,
	inputName,
	labelText,
	imageAltText,
	imageAspectRatio,
	imageClasses,
	imageWidth,
	imageSrc,
	...props
}: EditableImageProps<T>) => {
	const [src, setSrc] = useState(imageSrc);
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const location = useLocation();
	const imageSchema = useImageSchema();
	const imageFormSchema = z.object({
		[inputName]: imageSchema,
	});
	type ImageFormData = z.infer<typeof imageFormSchema>;

	const { t } = useTranslation();

	const {
		register,
		handleSubmit,
		trigger,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(imageFormSchema),
	});
	const onSubmit = (data: ImageFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const { fetcher, isFetching } = useFetcher();

	const registerOptions = register(inputName);

	const handleChange = async (e: ChangeEvent) => {
		const target = e.currentTarget as HTMLInputElement;

		if (!target.value) {
			return;
		}

		registerOptions.onChange(e);

		await trigger(inputName).then((isValid) => {
			if (isValid) {
				fetcher.submit(
					{ [inputName]: target.value },
					{ method: "put", action: location.pathname }
				);
			}
		});
	};

	const remove = () => {
		fetcher.submit(
			{ [inputName]: "" },
			{ method: "put", action: location.pathname }
		);
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	useEffect(() => {
		setSrc(imageSrc);
	}, [imageSrc]);

	useEffect(() => {
		setIsLoading(isFetching);
	}, [isFetching]);

	return (
		<fetcher.Form
			method="put"
			action={formAction}
			className={className}
			onSubmit={(e) => {
				if (!isValid) {
					handleSubmit(onSubmit, onSubmitError)(e);

					return;
				}
			}}
			{...props}
		>
			{labelText && <Label htmlFor={htmlFor} label={labelText} />}
			<div
				className={`relative z-10 ${src ? "inline-flex" : "flex"} ${
					imageWidth ?? ""
				} ${imageAspectRatio ?? (src ? "" : "aspect-video")} ${
					imageClasses ?? ""
				} items-center justify-center overflow-hidden ${
					isLoading
						? "bg-grey-lighter dark:bg-black-subtle"
						: "bg-grey-lightest dark:bg-black"
				} transition-colors duration-300 hover:bg-grey-lighter dark:hover:bg-black-subtle select-none group ${
					disableEdit ? " pointer-events-none" : ""
				}`}
			>
				{src && (
					<img
						alt={imageAltText}
						className={`${
							imageAspectRatio ?? ""
						} w-full object-cover rounded-[inherit] ${
							isLoading ? "opacity-25" : "opacity-100"
						} transition-opacity duration-300 group-hover:opacity-25`}
						src={src}
					/>
				)}
				<div className="absolute inset-0 flex items-center justify-center rounded-[inherit]">
					<RenderIcon
						classes={`max-w-[45%] max-h-[45%] text-[#787878] ${
							src
								? "transition-opacity duration-300 opacity-0 group-hover:opacity-100"
								: ""
						} ${isLoading ? "opacity-100 animate-spin-slow" : ""}`}
						icon={
							isLoading
								? Icons.Interface.Loading
								: Icons.Interface.Media
						}
					/>
				</div>
				<input
					{...registerOptions}
					ref={(e: HTMLInputElement) => {
						registerOptions?.ref(e);
						inputRef.current = e;
					}}
					aria-invalid={errors[inputName] ? "true" : "false"}
					accept="image/jpeg, image/jpg, image/bmp, image/gif, image/png"
					className="absolute z-10 inset-0 w-full h-full opacity-0 cursor-pointer rounded-[inherit]"
					id={htmlFor}
					onChange={handleChange}
					title=""
					type="file"
				/>
				{src && (
					<button
						className="absolute z-20 top-5 right-5"
						disabled={isLoading}
						onClick={remove}
						type="button"
					>
						<span className="sr-only">{t("remove")}</span>
						<RenderIcon
							classes="text-[#787878] opacity-0 transition-opacity duration-300 hover:text-white group-hover:opacity-100"
							icon={Icons.Edit.Remove}
						/>
					</button>
				)}
			</div>
			<FormError error={errors[inputName] as FieldError | undefined} />
		</fetcher.Form>
	);
};
