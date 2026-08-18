import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/common/button/Button";

export const LogoutButton = ({ ...props }) => {
	const { logout } = useAuth0();

	const { t } = useTranslation();

	return (
		<Button
			text={t("logOut", { defaultValue: "Log out" })}
			onClick={() => {
				logout({
					logoutParams: {
						returnTo: window.location.origin,
					},
				});
			}}
			{...props}
		/>
	);
};
