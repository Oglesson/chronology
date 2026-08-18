import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
	useEffect,
} from "react";
import { ResponseData } from "../api.common/types";
import { useSessionStorage } from "../hooks.common/useStorage";
import { STORAGE_KEYS } from "../constants.common/storageKeys";

type NavigationContext = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isLoading: boolean;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	retryAuth: boolean;
	setRetryAuth: Dispatch<SetStateAction<boolean>>;
	loginErrorData: ResponseData | null;
	setLoginErrorData: Dispatch<SetStateAction<ResponseData | null>>;
};

export const NavigationContext = createContext<NavigationContext>({
	isOpen: false,
	setIsOpen: () => {},
	isLoading: false,
	setIsLoading: () => {},
	retryAuth: true,
	setRetryAuth: () => {},
	loginErrorData: null,
	setLoginErrorData: () => {},
});

interface NavigationProviderProps {
	children?: ReactNode;
}

export const NavigationProvider = ({
	children,
	...props
}: NavigationProviderProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [retryAuth, setRetryAuth] = useState(false);
	const [loginErrorData, setLoginErrorData] = useState<ResponseData | null>(
		null,
	);

	const [, setLoginError] = useSessionStorage(STORAGE_KEYS.loginError);

	useEffect(() => {
		if (loginErrorData) {
			setLoginError(loginErrorData);
		}
	}, [loginErrorData]);

	return (
		<NavigationContext.Provider
			value={{
				isOpen,
				setIsOpen,
				isLoading,
				setIsLoading,
				retryAuth,
				setRetryAuth,
				loginErrorData,
				setLoginErrorData,
			}}
			{...props}
		>
			{children}
		</NavigationContext.Provider>
	);
};
