import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useContext } from "react";
import { z } from "zod";
import api from "../api.common";
import { NavigationContext } from "../context.common/NavigationContext";

const Jwt = z.object({
	permissions: z.array(z.string()).optional(),
	orgId: z.string().optional(),
});

type Jwt = z.infer<typeof Jwt>;

export const usePermissions = () => {
	const { setLoginErrorData } = useContext(NavigationContext);

	const { isAuthenticated, getAccessTokenSilently } = useAuth0();
	const [permissions, setPermissions] = useState<string[]>([]);

	useEffect(() => {
		let isSubscribed = true;

		const getAccessTokenForUser = async () => {
			try {
				if (isAuthenticated) {
					const accessToken = await getAccessTokenSilently();
					if (isSubscribed && accessToken) {
						api.setAuthorizationHeader(accessToken);
						const decodedAccessToken = jwtDecode(accessToken);

						const parsedAccessToken = Jwt.parse(decodedAccessToken);
						if (!parsedAccessToken.permissions) {
							return;
						}
						setPermissions(parsedAccessToken.permissions);
					}
				}
			} catch (e) {
				console.error(e.message, e);
				if (e.error_description) {
					setLoginErrorData({
						responseMessage: { Reason: e.error_description },
					});
				} else {
					setLoginErrorData(e);
				}
			}
		};

		getAccessTokenForUser();

		return () => {
			isSubscribed = false;
		};
	}, [isAuthenticated, getAccessTokenSilently, setLoginErrorData]);

	return { permissions };
};
