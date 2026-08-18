import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";
import Icons from "../config.common/Icons";
import useClickOutside from "../hooks.common/useClickOutside";
import { RenderIcon } from "../utilities.common/RenderIcon";
import { useAuth0 } from "@auth0/auth0-react";
import { NavigationContext } from "../context.common/NavigationContext";
import classNames from "classnames";
import { usePermissionsContext } from "../hooks.common/usePermissionsContext";
import { ThemeToggle } from "../components/common/button/ThemeToggle";

export const AuthorizedNavigation = ({ ...props }) => {
	const { t } = useTranslation();
	const { isAuthenticated } = useAuth0();
	const { isOpen, setIsOpen } = useContext(NavigationContext);
	const { permissions } = usePermissionsContext();
	const navigationRef = useRef<HTMLElement>(null);
	const location = useLocation();
	const isHome = location.pathname === "/" && !location.search.length;
	const renderNavigationItem = (
		to: string,
		text: string,
		wrapperClasses: string,
		hasLargeGap = false,
	) => {
		return (
			<li className={`${wrapperClasses}${hasLargeGap ? " !mt-12" : ""}`}>
				<NavLink
					to={to}
					className={({ isActive }) =>
						[
							"hover:text-green focus:text-green",
							isActive ? "text-green" : null,
						]
							.filter(Boolean)
							.join(" ")
					}
					end={to === "/"}
					onClick={() => {
						if (to !== "/") {
							setIsOpen(false);
						}
					}}
				>
					{text}
				</NavLink>
			</li>
		);
	};

	const renderNavigation = () => {
		const primaryClasses = "typo-h3 mt-1.5 first:mt-0";
		const secondaryClasses = "typo-pre-heading mt-3";

		return (
			<nav className="col-span-3 col-start-3 text-right">
				<ul>
					{renderNavigationItem(
						"/",
						t("home", { defaultValue: "Home" }),
						primaryClasses,
					)}
					{renderNavigationItem(
						"/designs",
						"Designs",
						primaryClasses,
					)}
					{renderNavigationItem(
						"/processes",
						"Processes",
						primaryClasses,
					)}
					{renderNavigationItem("/steps", "Steps", primaryClasses)}
					{renderNavigationItem(
						"/actions",
						"Actions",
						primaryClasses,
					)}
					{renderNavigationItem(
						"/settings",
						"Settings",
						secondaryClasses,
						true,
					)}
					{permissions.admin
						? renderNavigationItem(
								"/audit",
								"Audit",
								secondaryClasses,
							)
						: ""}
				</ul>
			</nav>
		);
	};

	useEffect(() => {
		document.documentElement.classList.toggle("nav-is-open", isOpen);
	}, [isOpen]);

	useEffect(() => {
		if (isAuthenticated && isHome && !isOpen) {
			setIsOpen(true);
		} else if (!isHome) {
			setIsOpen(false);
		}
	}, [isHome, isAuthenticated, isOpen, setIsOpen]);

	useClickOutside(navigationRef, () => {
		if (!isHome && isOpen) {
			setIsOpen(false);
		}
	});

	return (
		<header
			ref={navigationRef}
			className={classNames(
				"fixed top-0 left-0 py-6.5 pl-6.5 h-screen",
				isOpen && "z-100",
			)}
			{...props}
		>
			<div className="flex flex-col items-center h-full pr-6.5 border-r border-black">
				<Link
					to="/"
					className="relative z-10"
					onClick={() => {
						setIsOpen((previous) => {
							if (!isHome && isOpen) {
								return previous;
							}
							return !previous;
						});
					}}
				>
					<img
						src={Icons.Logo.ChronologyNoText.path}
						className="h-[50px]"
						alt="Chronology logo"
					/>
				</Link>

				<button
					type="button"
					className="my-auto relative z-10"
					onClick={() => {
						setIsOpen((previous) => !previous);
					}}
				>
					<span className="sr-only">
						{isOpen ? "Close" : "Open"} menu
					</span>
					<RenderIcon
						icon={
							isOpen ? Icons.Interface.Close : Icons.Menu.Burger
						}
					/>
				</button>

				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ translateX: "-100%" }}
							animate={{ translateX: 0 }}
							transition={{ type: "tween", duration: 0.5 }}
							exit={{
								translateX: "-100%",
							}}
							className="nav fixed inset-y-0 -translate-x-full left-0 h-full w-[41vw] pt-35 pr-12 pb-6.5 pl-6.5 bg-gradient-light dark:bg-gradient-dark"
						>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{
									opacity: 1,
									transition: { delay: 0.3 },
								}}
								exit={{
									opacity: 0,
								}}
								className="grid-container-5 h-full"
							>
								{renderNavigation()}
								<div className="col-span-1 self-end">
									<Link
										to="/privacy-policy"
										className="text-copyright text-black dark:text-grey-light hover:underline focus:underline"
									>
										{t("privacyPolicy")}
									</Link>
								</div>
								<div className="col-span-1 self-end">
									<Link
										to="/terms-of-use"
										className="text-copyright text-black dark:text-grey-light hover:underline focus:underline"
									>
										{t("termsOfUse")}
									</Link>
								</div>
								<div className="col-span-1 col-start-5 self-end flex justify-end">
									<ThemeToggle />
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</header>
	);
};
