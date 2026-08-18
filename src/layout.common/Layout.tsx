import { useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Auth0ProviderWithRedirectCallback } from "../authentication.common/Auth0ProviderWithRedirectCallback";
import { useIdTokenClaims } from "../hooks.common/useIdTokenClaims";
import { AuthorizedNavigation } from "../navigation.main/AuthorizedNavigation";
import { AuthorizedLayout } from "./AuthorizedLayout";
import { PermissionsProvider } from "./PermissionsContext";
import { UnauthorizedLayout } from "./UnauthorizedLayout";
import { Loader } from "../components/common/loader/Loader";
import { NavigationContext } from "../context.common/NavigationContext";

export const Layout = () => {
	return (
		<Auth0ProviderWithRedirectCallback>
			<PermissionsProvider>
				<Inner />
			</PermissionsProvider>
		</Auth0ProviderWithRedirectCallback>
	);
};

const Inner = () => {
	const { isLoading, error } = useAuth0();
	const claims = useIdTokenClaims();
	const { loginErrorData, retryAuth } = useContext(NavigationContext);

	if (isLoading) {
		return (
			<div>
				<AuthorizedNavigation />
				<Loader />
			</div>
		);
	}

	if (!claims?.canAccess || error || loginErrorData) {
		return <UnauthorizedLayout />;
	} else if (retryAuth) {
		return <Loader />;
	}

	return <AuthorizedLayout />;
};
