import { useAuth0 } from "@auth0/auth0-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Avatar } from "../components/common/avatar/Avatar";
import useClickOutside from "../hooks.common/useClickOutside";
import { useIdTokenClaims } from "../hooks.common/useIdTokenClaims";
import { LanguageSelector } from "./LanguageSelector";

export const Account = ({ ...props }) => {
	const { user, isAuthenticated, logout } = useAuth0();

	const claims = useIdTokenClaims();
	const { t } = useTranslation();
	const menuRef = useRef<HTMLDetailsElement>(null);

	useClickOutside(menuRef, () => {
		if (menuRef.current && menuRef.current.open) {
			menuRef.current.open = false;
		}
	});

	if (!isAuthenticated) {
		return <></>;
	}

	// TODO: Look into an alternative for retrieving the user's first and last names as Auth0 has Family/Given names but these are undefined
	const names = user?.name?.split(" ");
	const linkClasses =
		"block -mx-3.5 py-1.75 px-3.5 hover:text-green focus:text-green hover:bg-black focus:bg-black rounded-[3px]";

	return (
		<details
			className="relative z-100 text-white pointer-events-auto"
			ref={menuRef}
			{...props}
		>
			<summary className="relative z-20 flex justify-end">
				<Avatar size="xs" src={user?.picture} altText={user?.name} />
			</summary>
			<div className="absolute z-10 top-[-14px] right-[-14px] bg-black-subtle w-60 rounded-md pt-10.5 px-7 pb-7">
				{claims?.organisation && (
					<>
						<span className="block typo-pre-heading text-grey-light">
							{t("organisation")}
						</span>
						<span className="block mt-1.5 mb-5 typo-account-name">
							{claims?.organisation}
						</span>
					</>
				)}
				<span className="block typo-pre-heading text-grey-light">
					{t("account")}
				</span>
				<span className="block mt-1.5 typo-account-name">
					{names?.[0]}
					<br />
					{names?.[1]}
				</span>
				<nav className="pt-7">
					<ul>
						<li>
							<a href="#" className={linkClasses}>
								{t("profile")}
							</a>
						</li>
						<li>
							<a href="#" className={linkClasses}>
								{t("managePassword")}
							</a>
						</li>
						<li>
							<a href="#" className={linkClasses}>
								My Account
							</a>
						</li>
						<li>
							<a href="#" className={linkClasses}>
								{t("contact")}
							</a>
						</li>
					</ul>
				</nav>
				<div className="mt-12 border-t border-black pt-3 flex justify-between items-center">
					<div>
						<LanguageSelector />
					</div>
					<button
						type="button"
						onClick={() => {
							logout({
								logoutParams: {
									returnTo: window.location.origin,
								},
							});
						}}
						className="typo-pre-heading hover:underline focus:underline"
					>
						{t("logOut", { defaultValue: "Log out" })}
					</button>
				</div>
			</div>
		</details>
	);
};
