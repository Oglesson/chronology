import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

interface Claims {
	canAccess: boolean;
	organisation: string;
}

export const useIdTokenClaims = () => {
	const { isAuthenticated, getIdTokenClaims } = useAuth0();
	const [appClaims, setAppClaims] = useState<Claims | undefined>(undefined);

	useEffect(() => {
		let isSubscribed = true;

		const getUserMetadata = async () => {
			try {
				const claims = await getIdTokenClaims();
				if (isSubscribed && claims) {
					const canAccess = isAuthenticated;

					setAppClaims({
						canAccess: canAccess,
						organisation: claims["organization_display_name"],
					});
				}
			} catch (e) {
				console.error(e instanceof Error ? e.message : e);
			}
		};

		getUserMetadata();

		return () => (isSubscribed = false);
	}, [isAuthenticated, getIdTokenClaims]);

	return appClaims;
};
