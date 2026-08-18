import { User } from "@auth0/auth0-react";

export const ADDON_ID = "storybook/addon-auth0-react";
export const PANEL_ID = `${ADDON_ID}/panel`;
export const PARAM_KEY = `auth0React`;
export const defaultAuth0State: Auth0State = {
	isLoading: false,
	isAuthenticated: false,
	user: undefined,
	getAccessTokenSilently: (): unknown => null,
	getAccessTokenWithPopup: (): unknown => null,
	getIdTokenClaims: (): unknown => null,
	loginWithRedirect: (): unknown => null,
	loginWithPopup: (): unknown => null,
	logout: (): unknown => null,
	handleRedirectCallback: (): unknown => null,
	buildAuthorizeUrl: (): unknown => null,
	buildLogoutUrl: (): unknown => null,
};

interface Auth0State {
	isLoading: boolean;
	isAuthenticated: boolean;
	user: User | undefined;
	getAccessTokenSilently: () => unknown;
	getAccessTokenWithPopup: () => unknown;
	getIdTokenClaims: () => unknown;
	loginWithRedirect: () => unknown;
	loginWithPopup: () => unknown;
	logout: () => unknown;
	handleRedirectCallback: () => unknown;
	buildAuthorizeUrl: () => unknown;
	buildLogoutUrl: () => unknown;
}
