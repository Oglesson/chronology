import { useAuth0 } from "@auth0/auth0-react";
import { AuthenticationButton } from "./AuthenticationButton";

export const Profile = () => {
	const { user, isAuthenticated } = useAuth0();

	if (!isAuthenticated) {
		return <></>;
	}

	return (
		<div className="mt-6 bg-black rounded-lg p-5 text-white">
			<img src={user?.picture} alt={user?.name} />
			<h2>{user?.name}</h2>
			<p>{user?.sub}</p>
			<AuthenticationButton />
		</div>
	);
};
