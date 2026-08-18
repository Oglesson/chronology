import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useEffect, useMemo, useState } from "react";
import {
	isRouteErrorResponse,
	useAsyncError,
	useLocation,
	useNavigate,
	useRouteError,
} from "react-router-dom";
import { ResponseData, ResponseMessage } from "../../../api.common/types";
import { isAxiosError } from "axios";
import { NotificationContext } from "../../../context.common/NotificationContext";
import { NavigationContext } from "../../../context.common/NavigationContext";
import { toCamelCase } from "../../../utilities.common/StringUtilities";
import { useTranslation } from "react-i18next";
import { Loader } from "../../common/loader/Loader";
import { useSessionStorage } from "../../../hooks.common/useStorage";
import { STORAGE_KEYS } from "../../../constants.common/storageKeys";

export const Error = () => {
	const { retryAuth, setRetryAuth } = useContext(NavigationContext);

	const [showError, setShowError] = useState(true);
	const { logout } = useAuth0();

	const syncError = useAsyncError();
	const routerError = useRouteError();
	const navigate = useNavigate();
	const location = useLocation();
	const { pathname } = location;
	const { processResponse } = useContext(NotificationContext);
	const { t } = useTranslation();
	const [, setLoginError] = useSessionStorage(
		STORAGE_KEYS.loginError
	);

	const errorData = useMemo<ResponseData | null>(() => {
		const base: ResponseData = { type: "error" };
		if (syncError) {
			if (isAxiosError(syncError)) {
				if (syncError.response) {
					return {
						...base,
						code: syncError.response?.status,
						message: syncError.response?.statusText,
						responseMessage: syncError.response?.data as ResponseMessage,
					};
				}
				return {
					...base,
					code: syncError?.code,
					message: syncError?.message,
					responseMessage: {
						Reason: `Axios Error: ${syncError?.message}`,
						Type: "etError",
					},
				};
			} else if (isRouteErrorResponse(syncError)) {
				return {
					...base,
					code: syncError.status,
					message: syncError.statusText,
					responseMessage: syncError.data as ResponseMessage,
				};
			} else if (syncError instanceof Response) {
				return {
					...base,
					code: syncError.status,
					responseMessage: { Reason: syncError.statusText },
				};
			}
		}
		if (routerError && isRouteErrorResponse(routerError)) {
			return {
				...base,
				code: routerError?.status,
				message: routerError?.statusText,
				responseMessage: {
					Reason: `Router Error: ${routerError?.data}`,
					Type: "etError",
				},
			};
		}
		return null;
	}, [syncError, routerError]);

	const returnToLogin = (errorData: ResponseData) => {
		if (errorData) {
			setLoginError(errorData);
			logout({
				logoutParams: {
					returnTo: window.location.origin,
				},
			});
		}
	};

	useEffect(() => {
		if (errorData) {
			if (retryAuth) {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setShowError(false);
				setTimeout(() => {
					setRetryAuth(false);
					navigate(pathname, { replace: true });
					setShowError(true);
				}, 2000);
			} else {
				switch (errorData.code) {
					case 404:
						processResponse(errorData);
						navigate(
							pathname.substring(0, pathname.lastIndexOf("/"))
						);
						break;
					case 401:
					case 403:
						returnToLogin(errorData);

						break;
				}
			}
		}
	}, [errorData]);

	if (errorData?.code === 404) {
		return <p>This page doesn't exist!</p>;
	}
	if (showError) {
		return (
			<>
				{(errorData?.code || errorData?.message) && (
					<h1 className="typo-h1 mb-6">{`${errorData.code ?? ""}${
						errorData.code && errorData.message ? " - " : ""
					}${errorData.message ?? ""}`}</h1>
				)}
				{errorData?.responseMessage?.Reason ? (
					<p>
						{`${t(
							toCamelCase(errorData.responseMessage.Reason),
							errorData.responseMessage.Reason
						).replace(
							"%s",
							errorData.responseMessage.Detail ?? ""
						)}`}
						{errorData.responseMessage.Info && (
							<>
								<br />
								<>{errorData.responseMessage.Info}</>
							</>
						)}
					</p>
				) : undefined}
			</>
		);
	} else {
		return <Loader />;
	}
};
