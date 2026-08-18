import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import classNames from "classnames";
import { AnimatePresence } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import { Outlet, useLocation, useNavigation } from "react-router-dom";
import { NavigationContext } from "../context.common/NavigationContext";
import { AuthorizedNavigation } from "../navigation.main/AuthorizedNavigation";
import { UtilityNavigation } from "../navigation.utility/UtilityNavigation";
import { STORAGE_KEYS } from "../constants.common/storageKeys";

export const AuthorizedLayout = ({ ...props }) => {
	const location = useLocation();
	const { isOpen, setIsLoading } = useContext(NavigationContext);
	const navigation = useNavigation();

	useEffect(() => {
		setIsLoading(navigation.state !== "idle");
	}, [navigation.state, setIsLoading]);

	const [imageLoaded, setImageLoaded] = useState(false);

	const imageURL = null; // TODO: Add image
	const isHome = location.pathname === "/";

	sessionStorage.removeItem(STORAGE_KEYS.loginError);

	return (
		<>
			<AuthorizedNavigation />
			<main
				className={classNames(
					"main-content py-6.5 ml-[98px] relative",
					isOpen && "pointer-events-none",
					isHome && "overflow-hidden",
				)}
				{...props}
			>
				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ type: "tween", duration: 0.5 }}
							className="fixed inset-0 bg-black-subtle bg-opacity-50 z-50 backdrop-blur-sm"
						></motion.div>
					)}
				</AnimatePresence>

				{imageURL && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{
							opacity: imageLoaded && isHome ? 1 : 0,
						}}
						transition={{ type: "tween", duration: 0.5 }}
						className="fixed z-50 inset-0 w-screen h-full pointer-events-none"
					>
						<img
							onLoad={() => {
								setImageLoaded(true);
							}}
							className="absolute inset-0 w-full h-full object-contain"
							src={imageURL}
						/>
					</motion.div>
				)}
				<UtilityNavigation />
				<div className="mt-6">
					<Inner />
				</div>
			</main>
		</>
	);
};

const Inner = () => {
	const { isLoading, error } = useAuth0();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>An error has occurred: {error.message}</div>;
	}

	return <Outlet />;
};
