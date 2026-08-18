import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/common/button/Button";
import { STORAGE_KEYS } from "../constants.common/storageKeys";

export const LoginButton = ({ ...props }) => {
	const { loginWithRedirect } = useAuth0();
	const { t } = useTranslation();

	return (
		<Button
			text={t("logIn", { defaultValue: "Log in" })}
			onClick={() => {
				document.cookie = `sLog=false;`;
				loginWithRedirect({
					appState: { returnTo: window.location.pathname },
				});
				sessionStorage.removeItem(STORAGE_KEYS.loginError);
			}}
			{...props}
		/>
	);
};
