import { FieldError } from "react-hook-form";

type ErrorProps = {
	error?: FieldError;
	horizontal?: boolean;
};

export const FormError = ({ error, horizontal, ...props }: ErrorProps) => {
	if (!error) {
		return <></>;
	}
	return (
		error && (
			<p
				className={`basis-full text-validation mt-2 text-decline${
					horizontal ? " grow" : ""
				}`}
				{...props}
			>
				{error?.message}
			</p>
		)
	);
};
