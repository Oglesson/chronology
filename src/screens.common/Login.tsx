import { useTranslation } from "react-i18next";
import { AuthenticationButton } from "../authentication.common/AuthenticationButton";
import { useIdTokenClaims } from "../hooks.common/useIdTokenClaims";

export const Login = ({ ...props }) => {
	const { t } = useTranslation();
	const claims = useIdTokenClaims();

	return (
		<div
			className="grid-container min-h-full flex flex-col justify-between pl-20"
			{...props}
		>
			<div className="flex flex-col justify-center flex-1">
				<h1 className="typo-large mb-10">{t("login")}</h1>

				<p className="typo-h3">
					{t(
						claims !== undefined
							? "notAuthorisedText"
							: "loginDescription",
					)}
				</p>
				<AuthenticationButton className="mt-12 w-fit" />
			</div>
			<p className="typo-copyright text-grey-light">
				&copy;{" "}
				{t("copyrightText").replace(
					"{year}",
					new Date().getFullYear().toString(),
				)}
			</p>
		</div>
	);
};
