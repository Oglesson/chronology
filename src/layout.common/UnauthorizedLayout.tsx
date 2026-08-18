import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NotificationContext } from "../context.common/NotificationContext";
import { UnauthorizedNavigation } from "../navigation.main/UnauthorizedNavigation";
import { Login } from "../screens.common/Login";
import { toCamelCase } from "../utilities.common/StringUtilities";
import { useSessionStorage } from "../hooks.common/useStorage";
import { STORAGE_KEYS } from "../constants.common/storageKeys";
import ObjectUtilities from "../utilities.common/ObjectUtilities";
import { ResponseData } from "../api.common/types";

export const UnauthorizedLayout = ({ ...props }) => {
	return (
		<>
			<UnauthorizedNavigation />
			<main className="main-content h-full py-6.5" {...props}>
				<Inner />
			</main>
		</>
	);
};

const userRegex = /auth0\|\S+/g;
const orgRegex = /org_\S+/g;

const Inner = () => {
	const { isLoading, error } = useAuth0();
	const { t } = useTranslation();
	const { addNotification } = useContext(NotificationContext);
	const [loginError] = useSessionStorage<ResponseData>(
		STORAGE_KEYS.loginError
	);

	useEffect(() => {
		if (error?.message) {
			const errorMessage = error.message
				.replace(userRegex, "")
				.replace(orgRegex, "");

			addNotification({
				message: t(toCamelCase(errorMessage), {
					defaultValue:
						errorMessage.charAt(0).toUpperCase() +
						errorMessage.slice(1),
				}),
				type: "error",
			});
		}
	}, [error, addNotification, t]);

	useEffect(() => {
		if (loginError && !ObjectUtilities.objIsEmpty(loginError)) {
			addNotification({
				heading: "Login Error",
				message: loginError?.responseMessage
					? loginError?.responseMessage?.message ||
					  loginError?.responseMessage?.Reason
					: `There has been a login error - ${loginError?.code}`,
				type: "error",
			});
		}
	}, [loginError, addNotification]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return <Login />;
};
