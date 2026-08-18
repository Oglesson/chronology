import {
	AppState,
	Auth0Provider,
	AuthorizationParams,
} from "@auth0/auth0-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Auth0ProviderWithRedirectCallbackProps {
	children?: ReactNode;
}

export const Auth0ProviderWithRedirectCallback = ({
	children,
	...props
}: Auth0ProviderWithRedirectCallbackProps) => {
	const appClientId = `${import.meta.env.VITE_APP_CLIENTID}`;
	const appIssuerDomain = `${import.meta.env.VITE_APP_ISSUER_DOMAIN}`;
	const apiAudienceIdentifier = `${
		import.meta.env.VITE_API_AUDIENCE_IDENTIFIER
	}`;
	const navigate = useNavigate();
	const onRedirectCallback = (appState?: AppState) => {
		navigate((appState && appState.returnTo) || window.location.pathname);
	};

	const authorizationParams: AuthorizationParams = {
		audience: apiAudienceIdentifier,
		redirect_uri: window.location.origin,
	};

	return (
		<Auth0Provider
			domain={appIssuerDomain}
			clientId={appClientId}
			authorizationParams={authorizationParams}
			onRedirectCallback={onRedirectCallback}
			cacheLocation="localstorage"
			useRefreshTokens={true}
			{...props}
		>
			{children}
		</Auth0Provider>
	);
};
